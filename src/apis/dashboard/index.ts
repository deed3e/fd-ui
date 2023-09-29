import { apiDeleteCall, apiGetCall, apiPostCall, apiPutCall } from ".."

export const getDashboardItems = async () => {
    const response = await apiGetCall('/api/DashboardItems')
    return response.data
}