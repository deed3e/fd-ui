import { apiDeleteCall, apiGetCall, apiPostCall, apiPutCall } from '..';

export const getHistories = async (wallet: string) => {
    const response = await apiGetCall(`/api/Position/GetHitories?Wallet=${wallet}`);
    return response.data;
};