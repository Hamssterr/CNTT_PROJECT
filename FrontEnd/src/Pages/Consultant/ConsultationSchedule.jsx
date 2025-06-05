import React, { useState, useEffect } from "react";
import Navbar from "../../Components/Consultant/Navbar";
import Sidebar from "../../Components/Consultant/Sidebar";
import Footer from "../../Components/Footer";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import Modal from "react-modal";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, Clock, Info, Search, X } from "lucide-react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../../public/ModalStyle.css";
import enUS from "date-fns/locale/en-US";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import Loading from "../../Components/Loading";
import axios from "axios";
import "../../public/ModalStyle.css"; // Tạo file CSS riêng cho custom styles

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

Modal.setAppElement("#root");

function ConsultationSchedule() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { schedules, setSchedules, backendUrl } = useContext(AppContext);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState("month");
  const [calendarHeight, setCalendarHeight] = useState(
    window.innerHeight - 250
  );

  // Fetch schedules from backend
  const fetchSchedules = async () => {
    try {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate loading delay
      const response = await axios.get(
        `${backendUrl}/api/consultant/getSchedules`
      );
      if (response.data.success) {
        const formattedEvents = response.data.schedules.map((schedule) => ({
          ...schedule,
          start: new Date(schedule.start),
          end: new Date(schedule.end),
        }));
        setEvents(formattedEvents);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch schedules",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
    const handleResize = () => {
      setCalendarHeight(window.innerHeight - 250);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle creating new event
  // Handle creating new event
  const handleSelect = ({ start, end }) => {
    setSelectedEvent({
      title: "",
      start: start || new Date(), // Đảm bảo start có giá trị mặc định
      end: end || new Date(), // Đảm bảo end có giá trị mặc định
      desc: "",
    });
    setModalIsOpen(true);
  };

  // Handle editing existing event
  const handleEventSelect = (event) => {
    setSelectedEvent({
      ...event,
      start: event.start ? new Date(event.start) : new Date(), // Đảm bảo start là kiểu Date
      end: event.end ? new Date(event.end) : new Date(), // Đảm bảo end là kiểu Date
    });
    setModalIsOpen(true);
  };

  // Handle save event
  const handleSave = async () => {
    try {
      // Kiểm tra dữ liệu trước khi gửi
      if (!selectedEvent.title || !selectedEvent.start || !selectedEvent.end) {
        Swal.fire("Error", "Please fill in all required fields", "error");
        return;
      }

      // Chuẩn bị dữ liệu sự kiện
      const eventData = {
        title: selectedEvent.title,
        start: selectedEvent.start,
        end: selectedEvent.end,
        desc: selectedEvent.desc || "",
      };

      if (selectedEvent._id) {
        // Cập nhật sự kiện hiện có
        const response = await axios.put(
          `${backendUrl}/api/consultant/updateSchedule/${selectedEvent._id}`,
          eventData
        );
        if (response.data.success) {
          await fetchSchedules(); // Đồng bộ lại danh sách sự kiện
          Swal.fire("Success", "Schedule updated successfully", "success");
        } else {
          throw new Error(response.data.message || "Failed to update schedule");
        }
      } else {
        // Thêm sự kiện mới
        const response = await axios.post(
          `${backendUrl}/api/consultant/addSchedule`,
          eventData
        );
        if (response.data.success) {
          await fetchSchedules(); // Đồng bộ lại danh sách sự kiện
          Swal.fire("Success", "Schedule added successfully", "success");
        } else {
          throw new Error(response.data.message || "Failed to add schedule");
        }
      }
      closeModal(); // Đóng modal sau khi lưu thành công
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message || error.message || "Operation failed",
      });
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.delete(
          `${backendUrl}/api/consultant/deleteSchedule/${selectedEvent._id}`
        );
        if (response.data.success) {
          // Gọi lại fetchSchedules để đồng bộ dữ liệu mới nhất
          await fetchSchedules();

          Swal.fire("Deleted!", "Schedule has been deleted.", "success");
          closeModal();
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to delete schedule",
        });
      }
    }
  };

  const closeModal = () => {
    setSelectedEvent(null);
    setModalIsOpen(false);
  };

  // Filter events based on search query
  const filteredEvents = events.filter(
    (event) =>
      event &&
      event.title &&
      event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Thêm custom styling cho calendar
  const eventStyleGetter = (event, start, end, isSelected) => {
    return {
      style: {
        backgroundColor: "#3b82f6",
        borderRadius: "8px",
        opacity: 0.8,
        color: "white",
        border: "0",
        display: "block",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        fontSize: "14px",
        padding: "4px 8px",
        margin: "0 2px",
      },
    };
  };

  // Thêm custom components cho calendar
  const components = {
    event: (props) => (
      <div
        title={`${props.event.title}\n${props.event.desc || ""}`}
        className="truncate px-2 py-1"
      >
        {props.event.title}
      </div>
    ),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 p-8 ml-20"
        >
          {/* Header Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  Consultation Schedule
                </h1>
                <p className="text-gray-500 mt-1">
                  Manage your consultation appointments
                </p>
              </motion.div>

              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-4"
              >
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search schedules..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64 py-2 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <Search
                    className="absolute left-3 top-2.5 text-gray-400"
                    size={20}
                  />
                </div>
              </motion.div>
            </div>
          </div>

          {/* Calendar Section */}
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center items-center h-[calc(100vh-280px)] bg-white rounded-2xl shadow-lg"
            >
              <Loading />
            </motion.div>
          ) : (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <Calendar
                localizer={localizer}
                events={filteredEvents}
                startAccessor="start"
                endAccessor="end"
                style={{ height: calendarHeight }}
                onSelectSlot={handleSelect}
                onSelectEvent={handleEventSelect}
                selectable
                view={view}
                onView={setView}
                views={["month", "week", "day", "agenda"]}
                defaultView="month"
                toolbar={true}
                popup
                step={60}
                showMultiDayTimes
                className="custom-calendar"
                eventPropGetter={eventStyleGetter}
                components={components}
                formats={{
                  eventTimeRangeFormat: () => null, // Ẩn thời gian trong view tháng
                  dayRangeHeaderFormat: ({ start, end }) =>
                    `${format(start, "MMM d")} - ${format(end, "MMM d, yyyy")}`,
                }}
              />
            </motion.div>
          )}
        </motion.div>
      </div>
      <Footer />

      {/* Enhanced Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="myModal"
        overlayClassName="myOverlay"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white  shadow-xl w-full overflow-hidden"
        >
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  {selectedEvent?._id ? "Edit Schedule" : "Add New Schedule"}
                </h2>
                <p className="text-blue-100 text-sm mt-1">
                  {selectedEvent?._id
                    ? "Modify existing schedule"
                    : "Create a new schedule"}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={20} className="text-white" />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6">
            {selectedEvent && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="space-y-6"
              >
                {/* Title Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <CalendarIcon
                      className="absolute left-3 top-3 text-gray-400"
                      size={20}
                    />
                    <input
                      type="text"
                      value={selectedEvent.title}
                      onChange={(e) =>
                        setSelectedEvent({
                          ...selectedEvent,
                          title: e.target.value,
                        })
                      }
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="Enter schedule title"
                    />
                  </div>
                </div>

                {/* Description Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <div className="relative">
                    <Info
                      className="absolute left-3 top-3 text-gray-400"
                      size={20}
                    />
                    <textarea
                      value={selectedEvent.desc}
                      onChange={(e) =>
                        setSelectedEvent({
                          ...selectedEvent,
                          desc: e.target.value,
                        })
                      }
                      rows="4"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                      placeholder="Enter schedule description"
                    />
                  </div>
                </div>

                {/* Date and Time Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Time <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Clock
                        className="absolute left-3 top-3 text-gray-400"
                        size={20}
                      />
                      <input
                        type="datetime-local"
                        value={
                          selectedEvent?.start
                            ? format(
                                new Date(selectedEvent.start),
                                "yyyy-MM-dd'T'HH:mm"
                              )
                            : ""
                        }
                        onChange={(e) =>
                          setSelectedEvent({
                            ...selectedEvent,
                            start: new Date(e.target.value),
                          })
                        }
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Time <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Clock
                        className="absolute left-3 top-3 text-gray-400"
                        size={20}
                      />
                      <input
                        type="datetime-local"
                        value={
                          selectedEvent.end
                            ? format(selectedEvent.end, "yyyy-MM-dd'T'HH:mm")
                            : ""
                        }
                        onChange={(e) =>
                          setSelectedEvent({
                            ...selectedEvent,
                            end: new Date(e.target.value),
                          })
                        }
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-end gap-3">
              {selectedEvent?._id && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDelete}
                  className="px-4 py-2 bg-white border border-red-500 text-red-500 rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all"
                >
                  Delete Schedule
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={closeModal}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
              >
                {selectedEvent?._id ? "Update Schedule" : "Add Schedule"}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </Modal>
    </div>
  );
}

export default ConsultationSchedule;
