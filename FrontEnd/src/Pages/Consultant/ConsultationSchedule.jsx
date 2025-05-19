import React, { useState, useEffect } from "react";
import Navbar from "../../Components/Consultant/Navbar";
import Sidebar from "../../Components/Consultant/Sidebar";
import Footer from "../../Components/Footer";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import Modal from "react-modal";
import Swal from "sweetalert2";
import { Search, X } from "lucide-react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../../public/ModalStyle.css";
import enUS from "date-fns/locale/en-US";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import Loading from "../../Components/Loading";
import axios from "axios";

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

  return (
    <div>
      <Navbar />
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 p-8 ml-20">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">
              Consultation Schedule
            </h1>
            <div className="relative">
              <input
                type="text"
                placeholder="Search schedules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="py-2 pl-10 pr-4 rounded-lg shadow-sm border border-gray-300"
              />
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={20}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64 bg-gray-100/50">
              <Loading />
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow flex-1">
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
              />
            </div>
          )}
        </div>
      </div>
      <Footer />

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="myModal"
        overlayClassName="myOverlay"
      >
        <div className="bg-white rounded-lg shadow-xl w-full max-w-xl mx-auto">
          {/* Modal Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">
                {selectedEvent?._id ? "Edit Schedule" : "Add New Schedule"}{" "}
                {/* Changed from .id to ._id */}
              </h2>
              <button
                onClick={closeModal}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6">
            {selectedEvent && (
              <div className="space-y-5">
                {/* Title Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={selectedEvent.title}
                    onChange={(e) =>
                      setSelectedEvent({
                        ...selectedEvent,
                        title: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter schedule title"
                  />
                </div>

                {/* Description Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={selectedEvent.desc}
                    onChange={(e) =>
                      setSelectedEvent({
                        ...selectedEvent,
                        desc: e.target.value,
                      })
                    }
                    rows="4"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                    placeholder="Enter schedule description"
                  />
                </div>

                {/* Date and Time Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Time <span className="text-red-500">*</span>
                    </label>
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
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Time <span className="text-red-500">*</span>
                    </label>
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
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
            {selectedEvent?._id && (
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-white border border-red-500 text-red-500 rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                Delete Schedule
              </button>
            )}
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              {selectedEvent?._id ? "Update Schedule" : "Add Schedule"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ConsultationSchedule;
