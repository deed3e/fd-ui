import { LabelHTMLAttributes } from 'react';
import styled from 'styled-components';

export interface StyledBaseTextProps extends LabelHTMLAttributes<HTMLLabelElement> {
  fontSize?: number;
}

export const StyledBaseText = styled.label<StyledBaseTextProps>`
  font-size: ${(p) => p.fontSize || 14}px;
  color: ${(props) => props.color};
`;

export const StyledSmallText = styled((props: StyledBaseTextProps) => (
  <StyledBaseText fontSize={13} {...props} />
))`
  font-weight: 400;
`;

export const StyledRegularText = styled((props: StyledBaseTextProps) => (
  <StyledBaseText fontSize={14} {...props} />
))`
  font-weight: 400;
`;

export const StyledMediumText = styled((props: StyledBaseTextProps) => (
  <StyledBaseText fontSize={16} {...props} />
))`
  font-weight: 600;
`;

export const StyledLargeText = styled((props: StyledBaseTextProps) => (
  <StyledBaseText fontSize={20} {...props} />
))`
  font-weight: 700;
`;
