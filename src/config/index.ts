import { get } from 'lodash';
import { Config } from './bnbtest';

export const config = Config;

export const getRpcUrl = () => {
  return get(config, ['rpcUrl']);
};

export const getAdreessUsdc = () => {
  return get(config, ['usdc']);
};

export const getExplorerUrl = () => {
  return get(config, ['explorerUrl']);
};
