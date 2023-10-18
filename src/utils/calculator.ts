export const liqPrice = (
    entryPrice: bigint,
    isLong: boolean,
    collateralValue?: bigint,
    size?: bigint,
) => {
    if (!collateralValue || !size || !entryPrice || size <= 0) {
        return undefined;
    }
    const liqPrice = isLong
        ? entryPrice - (collateralValue * entryPrice) / size //todo sub liquidationfee
        : entryPrice + (collateralValue * entryPrice) / size;
    return liqPrice >= 0 ? liqPrice : undefined;
};
