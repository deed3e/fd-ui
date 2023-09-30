import React from 'react';
import styled from 'styled-components';
import NO_NAME from '../assets/tokens/NO_NAME.png';
import WETH from '../assets/tokens/WETH2.png';
import WBTC from '../assets/tokens/WBTC.png';
import USDT from '../assets/tokens/USDT.png';
import USDC from '../assets/tokens/USDC.png';
import DOGE from '../assets/tokens/DOGE.png';
import ETH from '../assets/tokens/ETH.png';
import BTC from '../assets/tokens/BTC.png';
import BNB from '../assets/tokens/BNB.png';

export type TokenSymbolProps = {
  symbol: string;
  size?: string | number;
  autoHeight?: boolean;
};

const logosBySymbol: { [title: string]: string } = {
  DEFAULT: NO_NAME,
  WETH: WETH,
  ETH: ETH,
  WBTC: WBTC,
  BTC: BTC,
  USDT: USDT,
  USDC: USDC,
  DOGE: DOGE,
  BNB:BNB
};

export const TokenSymbol: React.FC<TokenSymbolProps> = ({ symbol, size = 32 }) => {
  return (
    <StyledImage
      className="token-symbol"
      src={logosBySymbol[symbol?.toUpperCase()] || logosBySymbol.DEFAULT}
      alt={`${symbol} Logo`}
      width={size}
    />
  );
};

const StyledImage = styled.img`
  display: inline-block;
`;
