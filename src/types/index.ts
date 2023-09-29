import { z } from "zod";
import { swapSchema } from "./schema";

export type SwapType = z.infer<typeof swapSchema>