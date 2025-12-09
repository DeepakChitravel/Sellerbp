"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import RichTextEditor from "./RichTextEditor";

export default function EventDetails() {
  const { register, setValue, watch } = useFormContext();

  const videos = watch("videos") || [];
  const things = watch("things_to_know") || [];

  const [videoLink, setVideoLink] = useState("");
  const [thingInput, setThingInput] = useState("");

  /* ------------------ VIDEO ------------------ */
  const addVideo = () => {
    if (!videoLink.trim()) return;
    setValue("videos", [...videos, videoLink]);
    setVideoLink("");
  };

  const removeVideo = (index: number) => {
    const updated = videos.filter((_, i) => i !== index);
    setValue("videos", updated);
  };

  /* ------------------ THINGS TO KNOW ------------------ */
  const addThing = () => {
    if (!thingInput.trim()) return;
    setValue("things_to_know", [...things, thingInput]);
    setThingInput("");
  };

  const removeThing = (index: number) => {
    const updated = things.filter((_, i) => i !== index);
    setValue("things_to_know", updated);
  };

  return (
    <div className="bg-white p-6 rounded-xl border">
      <h2 className="text-lg font-semibold mb-4">Event Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Title */}
        <div>
          <label className="font-medium">Event Title *</label>
          <Input {...register("title")} placeholder="Enter title" />
        </div>

        {/* Date */}
        <div>
          <label className="font-medium">Event Date *</label>
          <Input type="date" {...register("date")} />
        </div>

        {/* Organizer */}
        <div>
          <label className="font-medium">Organizer *</label>
          <Input {...register("organizer")} placeholder="Organizer name" />
        </div>

        {/* Category */}
        <div>
          <label className="font-medium">Category</label>
          <Input {...register("category")} placeholder="Category" />
        </div>

        {/* Info */}
        <div className="md:col-span-2">
          <label className="font-medium">Event Info</label>
          <Textarea rows={3} {...register("info")} />
        </div>

        {/* ⭐ Description → Rich Editor */}
        <div className="md:col-span-2">
          <RichTextEditor name="description" label="Description" />
        </div>
      </div>

      {/* Comfort */}
      <div className="mt-8">
        <h3 className="font-semibold mb-2">Comfort & Features</h3>
        <Textarea {...register("comfort")} placeholder="AC, Parking, Seating..." />
      </div>

      {/* Things To Know */}
      <div className="mt-8">
        <h3 className="font-semibold mb-2">Things To Know</h3>

        <div className="flex gap-3 mb-4">
          <Input
            placeholder="Add info"
            value={thingInput}
            onChange={(e) => setThingInput(e.target.value)}
          />
          <Button type="button" onClick={addThing}>Add</Button>
        </div>

        <div className="space-y-3">
          {things.map((item, i) => (
            <div key={i} className="flex justify-between p-3 border rounded bg-gray-50">
              <span>{item}</span>
              <Button variant="destructive" type="button" onClick={() => removeThing(i)}>
                Remove
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Videos */}
      <div className="mt-8">
        <h3 className="font-semibold mb-2">Event Videos</h3>

        <div className="flex gap-3 mb-4">
          <Input
            placeholder="Paste YouTube URL"
            value={videoLink}
            onChange={(e) => setVideoLink(e.target.value)}
          />
          <Button type="button" onClick={addVideo}>Add</Button>
        </div>

        <div className="space-y-3">
          {videos.map((v, i) => (
            <div key={i} className="flex justify-between p-3 bg-gray-50 border rounded">
              <a href={v} target="_blank" className="text-blue-600 underline">{v}</a>
              <Button variant="destructive" type="button" onClick={() => removeVideo(i)}>
                Remove
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
