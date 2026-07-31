import { z } from "zod";

export const eventSchema = z.object({
  type: z.string().min(1, "typeRequired"),
  title: z.string().min(1, "titleRequired"),
  description: z.string().min(1, "descriptionRequired"),
  startDate: z.date({ required_error: "startDateRequired" }),
  startTime: z.object({ hour: z.number(), minute: z.number() }, { required_error: "startTimeRequired" }),
  endDate: z.date({ required_error: "endDateRequired" }),
  endTime: z.object({ hour: z.number(), minute: z.number() }, { required_error: "endTimeRequired" }),
  color: z.enum(["blue", "green", "red", "yellow", "purple", "orange", "gray"], { required_error: "colorRequired" }),
});

export type TEventFormData = z.infer<typeof eventSchema>;