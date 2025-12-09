import { z } from "zod";

export const eventSchema = z.object({
  title: z.string().min(1, "Event title is required"),
  date: z.string().min(1, "Event date is required"),
  description: z.string().optional(),

  country: z.string().min(1, "Country is required"),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),

  organizer: z.string().min(1, "Organizer name required"),
  category: z.string().optional(),

  info: z.string().optional(),
  comfort: z.array(z.string()).default([]),
  map_link: z.string().optional(),
  things_to_know: z.array(z.string()).default([]),
  terms: z.array(z.string()).default([]),

  banner: z.string().optional(),
  videos: z.array(z.string()).default([]),
});

export type EventFormData = z.infer<typeof eventSchema>;
