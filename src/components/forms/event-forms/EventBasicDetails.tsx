import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function EventBasicDetails({ form }: any) {
  return (
    <div className="bg-white p-6 rounded-xl border">
      <h2 className="text-xl font-semibold mb-4">Event Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="font-medium">Event Title *</label>
          <Input placeholder="Enter event title" {...form.register("title")} />
        </div>

        <div>
          <label className="font-medium">Event Date *</label>
          <Input type="date" {...form.register("date")} />
        </div>

        <div className="md:col-span-2">
          <label className="font-medium">Description</label>
          <Textarea rows={4} {...form.register("description")} />
        </div>
      </div>
    </div>
  );
}
