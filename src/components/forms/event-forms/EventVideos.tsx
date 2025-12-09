"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function EventVideos() {
  const { watch, setValue } = useFormContext();
  const videos = watch("videos") || [];
  const [videoLink, setVideoLink] = useState("");

  const addVideo = () => {
    if (!videoLink.trim()) return;

    setValue("videos", [...videos, videoLink]);
    setVideoLink("");
  };

  const removeVideo = (index: number) => {
    const updated = videos.filter((_: any, i: number) => i !== index);
    setValue("videos", updated);
  };

  return (
    <div className="bg-white p-6 rounded-xl border">
      <h2 className="font-semibold mb-3">Event Videos</h2>

      {/* Add New Video URL */}
      <div className="flex gap-3 mb-5">
        <Input
          placeholder="Paste YouTube/video URL"
          value={videoLink}
          onChange={(e) => setVideoLink(e.target.value)}
        />
        <Button type="button" onClick={addVideo}>
          Add
        </Button>
      </div>

      {/* Show List of Videos */}
      <div className="space-y-3">
        {videos.length === 0 && (
          <p className="text-gray-500 text-sm">No videos added yet.</p>
        )}

        {videos.map((v: string, index: number) => (
          <div
            key={index}
            className="flex justify-between items-center p-3 border rounded-md bg-gray-50"
          >
            <a href={v} target="_blank" className="text-blue-600 underline">
              {v}
            </a>

            <Button
              variant="destructive"
              type="button"
              onClick={() => removeVideo(index)}
            >
              Remove
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
