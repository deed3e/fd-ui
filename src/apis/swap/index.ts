import { apiDeleteCall, apiGetCall, apiPostCall, apiPutCall } from ".."
export const getSwapsByCondition = async (wallet: `0x${string}` | undefined, page: string) => {
    const response = await apiGetCall(`/api/Swap/${wallet}/${page}`)
    return response.data
}