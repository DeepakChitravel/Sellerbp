"use client";
import ReactFullCalendar from "@fullcalendar/react"; // import the FullCalendar component
import timeGridPlugin from "@fullcalendar/timegrid"; // import the TimeGrid plugin
import { EventInput } from "@fullcalendar/core"; // import the EventInput type
import listPlugin from "@fullcalendar/list";

interface Props {
  events: EventInput[];
}

const FullCalendar = ({ events }: Props) => {
  return (
    <>
      <div className="hidden lg:block">
        <ReactFullCalendar
          plugins={[timeGridPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "timeGridWeek,timeGridDay",
          }}
          events={events}
        />
      </div>

      {/* Mobile */}
      <div className="block lg:hidden [&_.fc-scroller]:!overflow-scroll [&_.fc-view-harness]:!h-[calc(100vh_-_265px)] [&_.fc-view-harness]:sm:!h-[calc(100vh_-_166px)] [&_.fc-header-toolbar]:flex-col [&_.fc-header-toolbar]:sm:flex-row [&_.fc-toolbar-title]:text-center [&_.fc-toolbar-title]:mt-2 [&_.fc-toolbar-title]:sm:mt-0">
        <ReactFullCalendar
          plugins={[listPlugin]}
          initialView="listWeek"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "",
          }}
          events={events}
        />
      </div>
    </>
  );
};

export default FullCalendar;
