import { apiDeleteCall, apiGetCall, apiPostCall, apiPutCall } from '..';

export const GetLeaderboards = async (
    IsTradingVolumnAsc: any,
    IsAvgLeverageAsc: any,
    IsWinAsc: any,
    IsLossAsc: any,
    IsPNLwFeesAsc: any,
    TimeRange: any,
) => {
    var url = `/api/User/GetLeaderboard?TimeRange=${TimeRange}`;

    if (IsTradingVolumnAsc != null) {
        url = url + `&IsTradingVolumnAsc=${IsTradingVolumnAsc}`;
    } else if (IsAvgLeverageAsc != null) {
        url = url + `&IsAvgLeverageAsc=${IsAvgLeverageAsc}`;
    } else if (IsWinAsc != null) {
        url = url + `&IsWinAsc=${IsWinAsc}`;
    } else if (IsLossAsc != null) {
        url = url + `&IsLossAsc=${IsLossAsc}`;
    } else if (IsPNLwFeesAsc != null) {
        url = url + `&IsPNLwFeesAsc=${IsPNLwFeesAsc}`;
    }
    const response = await apiGetCall(url);
    return response.data;
};
