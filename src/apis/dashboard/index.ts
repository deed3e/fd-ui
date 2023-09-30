import { apiDeleteCall, apiGetCall, apiPostCall, apiPutCall } from ".."

export const getDashboardItemData = async () => {
    const response = await apiGetCall('api/Dashboard/DashboardItemData')
    return response.data
}