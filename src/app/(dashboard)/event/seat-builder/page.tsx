import dynamic from "next/dynamic";

const SeatDesignerRouter = dynamic(
  () => import("@/components/SeatDesigner/SeatDesignerRouter"),
  { ssr: false }
);

export default function Page({ searchParams }) {
  const layout = searchParams?.layout ?? "theatre";
  const eventId = Number(searchParams?.eventId);

  if (!eventId)
    return <div className="p-6 text-red-600">❌ Missing eventId in URL</div>;

  return (
    <div className="p-6">
      <SeatDesignerRouter eventId={eventId} layoutType={layout} />
    </div>
  );
}
