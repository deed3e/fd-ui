import { apiDeleteCall, apiGetCall, apiPostCall, apiPutCall } from ".."

export const getAccountStatus = async (wallet: string) => {
    const response = await apiGetCall(`/api/User/GetAccountStatus?wallet=${wallet}`)
    return response.data
}

export const postReferralUser = async (referringUser: string, referralUser: string) => {
    const response = await apiPostCall(`/api/User/PostReferredUser`, { referringUser, referralUser })
    return response.data
}