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
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Initial Consultation",
      desc: "Meeting with new student",
      start: new Date(2024, 4, 8, 9, 0),
      end: new Date(2024, 4, 8, 10, 0),
    },
    {
      id: 2,
      title: "Follow-up Meeting",
      desc: "Progress review",
      start: new Date(2024, 4, 8, 14, 0),
      end: new Date(2024, 4, 8, 15, 0),
    },
  ]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState("month");
  const [calendarHeight, setCalendarHeight] = useState(
    window.innerHeight - 250
  ); // subtract header & padding

  useEffect(() => {
    const handleResize = () => {
      setCalendarHeight(window.innerHeight - 250);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle creating new event
  const handleSelect = ({ start, end }) => {
    setSelectedEvent({
      title: "",
      start,
      end,
      desc: "",
    });
    setModalIsOpen(true);
  };

  // Handle editing existing event
  const handleEventSelect = (event) => {
    setSelectedEvent(event);
    setModalIsOpen(true);
  };

  // Handle save event
  const handleSave = () => {
    if (!selectedEvent.title) {
      Swal.fire("Error", "Title is required", "error");
      return;
    }

    if (selectedEvent.id) {
      // Update existing event
      setEvents(
        events.map((event) =>
          event.id === selectedEvent.id ? selectedEvent : event
        )
      );
    } else {
      // Create new event
      setEvents([
        ...events,
        {
          ...selectedEvent,
          id: Date.now(),
        },
      ]);
    }
    closeModal();
    Swal.fire("Success", "Schedule saved successfully", "success");
  };

  // Handle delete event
  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setEvents(events.filter((event) => event.id !== selectedEvent.id));
        closeModal();
        Swal.fire("Deleted!", "Schedule has been deleted.", "success");
      }
    });
  };

  const closeModal = () => {
    setSelectedEvent(null);
    setModalIsOpen(false);
  };

  // Filter events based on search query
  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <Navbar />
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 p-8 ml-30">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
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
                {selectedEvent?.id ? "Edit Schedule" : "Add New Schedule"}
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
                      value={format(selectedEvent.start, "yyyy-MM-dd'T'HH:mm")}
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
                      value={format(selectedEvent.end, "yyyy-MM-dd'T'HH:mm")}
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
            {selectedEvent?.id && (
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
              {selectedEvent?.id ? "Update Schedule" : "Add Schedule"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ConsultationSchedule;
