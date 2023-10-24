import { useMemo } from 'react';
import styled from 'styled-components';
import { LEVERAGES, LEVERAGES_STEP, MAX_LEVERAGE } from '../../../../../utils/constant';
import { Slider } from '../../../../../component/Slider';

export interface LeverageProps {
  value: number;
  onChange: (leverage: number) => unknown;
}

export const Leverage = ({ value, onChange }: LeverageProps) => {
  const leverage = useMemo(() => value || MAX_LEVERAGE, [value]);

  return (
    <StyledContainer>
      <StyledTitleContainer>
        <StyledText color="#adabab">Leverage</StyledText>
        <StyledText color="#fff">{leverage}x</StyledText>
      </StyledTitleContainer>
      <Slider
        step={LEVERAGES_STEP}
        checkPoints={LEVERAGES}
        value={leverage}
        onChange={({ value }) => {
          onChange(value);
        }}
      />
    </StyledContainer>
  );
};

const StyledContainer = styled.div``;

const StyledText = styled.div`
line-height: 18px;
color: rgba(255, 255, 255, 0.80);
`;

const StyledTitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 14px;
`;
