import React, { useMemo, ChangeEvent } from 'react';
import styled from 'styled-components';

export interface SliderSizeConfig {
  trackHeight: number;
  thumbSize: number;
  pointSize: number;
  padding: number;
}

export interface SliderProps {
  checkPoints: number[];
  value: number;
  sizeConfig?: SliderSizeConfig;
  step?: number;
  onChange?: (props: { min: number; max: number; value: number }) => void | Promise<void>;
}

const DEFAULT_SIZE: SliderSizeConfig = {
  trackHeight: 6,
  thumbSize: 12,
  pointSize: 6,
  padding: 10,
};

export const Slider = ({ step = 1, sizeConfig = DEFAULT_SIZE, ...props }: SliderProps) => {
  const [min, max] = useMemo(
    () => [Math.min(...props.checkPoints), Math.max(...props.checkPoints)],
    [props.checkPoints],
  );
  const value = useMemo(() => {
    return Math.max(Math.min(props.value, max), min);
  }, [max, min, props.value]);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const value = target.value;
    const parsed = parseFloat(value);
    if (isNaN(parsed)) {
      return;
    }
    updateValue(parsed);
  };

  const updateValue = (target: number) => {
    if (target === value) {
      return;
    }
    props.onChange &&
      props.onChange({
        max: max,
        min: min,
        value: target,
      });
  };

  return (
    <StyledContainer config={sizeConfig}>
      <StyledBackdropContainer>
        <StyledInActiveBackdropContainer
          width={100 - ((value - min) / (max - min)) * 100}
        ></StyledInActiveBackdropContainer>
      </StyledBackdropContainer>
      <StyledCheckPointsContainer>
        {props.checkPoints.map((point) => (
          <StyledCheckPointContainer key={point}>
            {/* support for height of parent, not show */}
            <StyledCheckPoint passed={point < value} />
            <StyledCheckPointLabel>{point}x</StyledCheckPointLabel>
            {/* data show for user */}
            <StyledPositionSupporter x={((point - min) / (max - min)) * 100}>
              <StyledCheckPoint passed={point < value} />
              <StyledCheckPointLabel onClick={() => updateValue(point)}>
                {point}x
              </StyledCheckPointLabel>
            </StyledPositionSupporter>
          </StyledCheckPointContainer>
        ))}
      </StyledCheckPointsContainer>
      <StyledInputRange
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={onChange}
        step={step}
      />
    </StyledContainer>
  );
};

const StyledCheckPoint = styled.div<{ passed: boolean }>`
  margin-bottom: 8px;
  &::before,
  &::after {
    content: '';
    position: absolute;
    border-radius: 9999px;
  }
  &::before {
    left: -1px;
    background-color: ${(p) => (p.passed ? 'transparent' : '#29292c')};
  }
  &::after {
    left: 0;
    background-color: ${(p) => (p.passed ? '#5450c9' : '#4c4c54')};
  }
`;

const StyledCheckPointLabel = styled.div`
  font-size: 12px;
  cursor: pointer;
  transition: color 0.1s linear;
  color: #979595;
  &:hover {
    color: #fff;
  }
`;

const StyledCheckPointContainer = styled.div`
  > ${StyledCheckPoint}, > ${StyledCheckPointLabel} {
    visibility: hidden;
  }
`;

const StyledPositionSupporter = styled.div<{ x: number }>`
  position: absolute;
  left: ${(p) => p.x}%;
  top: 0;
`;

const StyledCheckPointsContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const StyledInputRange = styled.input.attrs({
  type: 'range',
})`
  position: absolute;
  background: transparent;
  padding: 0;
  margin: 0;
  -webkit-appearance: none;
  cursor: pointer;
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    background-color: #fff;
    border-radius: 9999px;
    border: 1px solid #29292c;
    cursor: pointer;
  }
  :focus {
    outline: none;
  }
  ::-ms-track {
    width: 100%;
    cursor: pointer;
    /* Hides the slider so custom styles can be added */
    background: transparent;
    border-color: transparent;
    color: transparent;
  }
`;

const StyledBackdropContainer = styled.div`
  position: absolute;
  width: 100%;
  left: 0;
  overflow: hidden;
  background-color: #6b67e6;
`;

const StyledInActiveBackdropContainer = styled.div<{ width: number }>`
  position: absolute;
  right: 0;
  height: 100%;
  width: calc(${(p) => p.width}% + ${(p) => (!p.width ? 0 : p.width > 50 ? -6 : 6)}px);
  background-color: #363636;
`;

const StyledContainer = styled.div<{ config: SliderSizeConfig }>`
  width: 100%;
  position: relative;
  padding: 0 ${(p) => p.config.padding}px;
  ${StyledBackdropContainer} {
    height: ${(p) => p.config.trackHeight}px;
    top: 0;
    border-radius: 9999px;
  }
  ${StyledInputRange} {
    width: calc(100% - ${(p) => p.config.padding * 2 - p.config.thumbSize}px);
    left: ${(p) => p.config.padding - p.config.thumbSize / 2}px;
    top: ${(p) => (p.config.trackHeight - p.config.thumbSize) / 2}px;
    &::-webkit-slider-thumb {
      height: ${(p) => p.config.thumbSize}px;
      width: ${(p) => p.config.thumbSize}px;
    }
  }
  ${StyledCheckPoint} {
    height: ${(p) => p.config.trackHeight}px;
    position: relative;
    &::before {
      top: calc(50% - ${(p) => p.config.pointSize / 2 + 1}px);
      height: ${(p) => p.config.pointSize + 2}px;
      width: ${(p) => p.config.pointSize + 2}px;
    }
    &::after {
      top: calc(50% - ${(p) => p.config.pointSize / 2}px);
      height: ${(p) => p.config.pointSize}px;
      width: ${(p) => p.config.pointSize}px;
    }
  }
  ${StyledCheckPointLabel} {
    transform: translateX(calc(-50% + ${(p) => p.config.pointSize / 2}px));
  }
  ${StyledPositionSupporter} {
    transform: translateX(-${(p) => p.config.pointSize / 2}px);
  }
`;
