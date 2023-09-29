import { z } from "zod";

export const swapSchema = z.object({
    tokenIn: z.string(),
    tokenOut: z.string(),
    amountIn: z.bigint(),
    amountOut: z.bigint(),
    time: z.date()
})