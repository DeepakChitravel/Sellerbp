import EventsSearch from "./events-filter/search";
import EventsFilterOptions from "./events-filter/filter";
import EventsExport from "./events-filter/export";

const EventsFilter = ({ data }: { data: any[] }) => {
const categories = Array.from(
  new Set(data.map((e) => e.category).filter(Boolean))
);

  return (
    <div className="bg-white rounded-xl p-5 flex items-center justify-between flex-col sm:flex-row gap-x-6 gap-y-3">
      <div className="flex items-center flex-col sm:flex-row gap-x-6 gap-y-3 w-full sm:w-auto">
        <EventsSearch />
        <EventsFilterOptions categories={categories} />
      </div>

      <div className="flex items-center gap-x-6 gap-y-3 w-full sm:w-auto">
        <EventsExport data={data} />
      </div>
    </div>
  );
};

export default EventsFilter;
