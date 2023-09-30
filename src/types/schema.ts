import { z } from "zod";

export const swapSchema = z.object({
    tokenIn: z.string(),
    tokenOut: z.string(),
    amountIn: z.bigint(),
    amountOut: z.bigint(),
    time: z.date()
})

export const dashboardItemDataSchema = z.object({
    totalUserCount: z.string(),
    totalUserCountChange: z.string(),
    accuredFees: z.string(),
    accuredFeesChange: z.string(),
    totalTradingVolumn: z.string(),
    totalTradingVolumnChange: z.string(),
    assetsUnderManagement: z.string(),
    assetsUnderManagementChange: z.string()
})