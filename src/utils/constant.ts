import { GraphQLClient } from 'graphql-request';
import { config } from '../config';

// DECIMALS
export const VALUE_DECIMALS = 30;
export const FEE_DECIMALS = 10;
export const PERCENTAGE_DECIMALS = 10;
export const SLIPPAGE_DECIMALS = 6;

// THRESHOLD
export const DefaultThreshold = 0.001;
export const CurrencyThreshold = 0.01;
export const PercentageThreshold = 0.0001;
export const FractionDigits2Threshold = 0.001;

export const DefaultFractionDigits = 3;

// LEVERAGE
export const LEVERAGES = [2, 5, 10, 15, 20, 25, 30];
export const LEVERAGES_STEP = 1;
export const MIN_LEVERAGE = Math.min(...LEVERAGES);
export const MAX_LEVERAGE = Math.max(...LEVERAGES);
export const MIN_CONTRACT_LEVERAGE = 1;

//graphql
export const graphClient = new GraphQLClient(config.graphql);

