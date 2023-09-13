import styled from 'styled-components';
import { Dropdown, DropdownMenu, DropdownToggle } from '.';
import { StyledRegularText } from '../Text';
import dropdownIcon from '../../assets/icons/ic-dropdown.svg';
import { useMemo, useState } from 'react';

interface BasicDropdownItem<T> {
  value: T;
  title: string;
}

interface BasicDropdownProps<T> {
  title?: string;
  items: BasicDropdownItem<T>[];
  value: T;
  onChange: (value: BasicDropdownItem<T>) => unknown;
  inline?: boolean;
  dropDownMenuWidth?: string;
}

export const BasicDropdown = <T,>({
  value,
  onChange,
  items,
  title,
  inline,
  dropDownMenuWidth,
}: BasicDropdownProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const current = useMemo(() => items.find((c) => c.value === value), [items, value]);
  return (
    <div>
      {title && <StyledTitle color="#fff">{title}</StyledTitle>}
      <Dropdown onToggle={(value) => setIsOpen(value)}>
        <DropdownToggle>
          <StyledContainer isOpen={isOpen} isInline={inline}>
            <StyledRegularText fontSize={14}>{current?.title}</StyledRegularText>
            <StyledDropdownIcon src={dropdownIcon} />
          </StyledContainer>
        </DropdownToggle>
        <StyledDropdownMenu
          position={inline ? 'right' : 'left'}
          minWidth={dropDownMenuWidth || '100%'}
          isInline={inline}
        >
          {items.map((item, index) => (
            <StyledDropdownItem
              key={index}
              onClick={() => onChange(item)}
              fontSize={16}
              active={item.value === value}
            >
              {item.title}
            </StyledDropdownItem>
          ))}
        </StyledDropdownMenu>
      </Dropdown>
    </div>
  );
};

const StyledTitle = styled(StyledRegularText)`
  margin-bottom: 10px;
  font-size: 13px;
  display: block;
`;

const StyledDropdownIcon = styled.img`
  width: 8px;
  transition: transform 0.125s linear;
  margin-left: 8px;
`;

const StyledContainer = styled.div<{ isOpen?: boolean; isInline?: boolean }>`
  ${(p) => (p.isInline ? '' : 'border: 1px solid #363636;')}
  ${(p) => (p.isInline ? '' : 'padding: 10px 10px;')}
  ${(p) => (p.isInline ? '' : 'height: 45px;')}
  border-radius: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  * {
    cursor: pointer;
  }
  ${StyledRegularText} {
    ${(p) => (p.isInline ? '' : 'line-height: 24px;')}
  }
  ${StyledDropdownIcon} {
    ${(p) => p.isOpen && 'transform: rotate(180deg);'}
  }
`;

const StyledDropdownMenu = styled(DropdownMenu)<{ isInline?: boolean }>`
  ${(p) => (p.isInline ? '' : 'width: 100%;')}
  border-radius: 5px;
  padding: 0;
  box-shadow: 0 2px 44px 0 rgba(0, 0, 0, 0.5);
  ${StyledRegularText} {
    cursor: pointer;
    display: block;
    padding: 12px 0;
    margin: 0 12px;
    border-bottom: 1px solid #363636;
    &:last-child {
      border-bottom: none;
    }
  }
`;

const StyledDropdownItem = styled(StyledRegularText)<{ active?: boolean }>`
  opacity: ${(p) => (p.active ? 1 : 0.5)};
  font-size: 14px;
  transition: all 0.125s linear;
  &:hover {
    opacity: 1;
  }
`;
