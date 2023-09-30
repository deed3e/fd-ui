import { z } from "zod";
import { swapSchema, dashboardItemDataSchema } from "./schema";

export type SwapType = z.infer<typeof swapSchema>

export type DashboardItemDataType = z.infer<typeof dashboardItemDataSchema>