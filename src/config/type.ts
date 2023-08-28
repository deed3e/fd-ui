export type ConnectorName = 'network' | 'injected' | 'walletconnect';

export type ChainConfig = {
  testnet: boolean;
  chainId: number;
  chainName: string;
  etherscanName: string;
  rpcUrl: string;
  explorerUrl: string;
  multicall: string;
  oracle: string;
  nativeToken: string;
  wrapNativeToken: string;
  usdc:string;
};
