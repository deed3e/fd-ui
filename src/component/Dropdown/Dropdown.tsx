import React, {
  createContext,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';
import useOutsideClick from '../../hooks/useOutsideClick';

type Context = {
  isOpen: boolean;
  toggle?: () => void;
};

const defaultContext = {
  isOpen: false,
};
export const DropdownContext = createContext<Context>(defaultContext);

export type DropdownProps = {
  children: ReactNode;
  onToggle?: (isOpen: boolean) => void;
};

export const Dropdown: React.FC<DropdownProps> = ({ children, onToggle }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useOutsideClick(ref, () => {
    setOpen(false);
  });

  useEffect(() => {
    if (onToggle) {
      onToggle(open);
    }
  }, [open, onToggle]);

  const value = useMemo(() => {
    return {
      isOpen: open,
      toggle: () => {
        setOpen((x) => !x);
      },
    };
  }, [open]);

  return (
    <DropdownContext.Provider value={value}>
      <StyledDropdownContainer ref={ref}>{children}</StyledDropdownContainer>
    </DropdownContext.Provider>
  );
};

const StyledDropdownContainer = styled.div`
  position: relative;
  display: block;
`;
