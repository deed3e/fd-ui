import { z } from "zod";

export const swapSchema = z.object({
    tokenIn: z.string(),
    tokenOut: z.string(),
    amountIn: z.string(),
    amountOut: z.string(),
    time: z.date()
})