import React, { createContext, ReactNode, useCallback, useState } from 'react';
import styled from 'styled-components';
import { screenUp } from '../../utils/styles';
import { useBodyClass } from '../../hooks/useBodyClass';

interface ModalsContext {
  onPresent: (content: React.ReactNode, backdropClick?: () => void, id?: string) => string;
  onDismiss: (id: string) => void;
}

export const Context = createContext<ModalsContext>({
  onPresent: () => '',
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onDismiss: () => {},
});

interface ModalInfo {
  id: string;
  content?: React.ReactNode;
  backdropClick?: () => void;
}

const modalSetter =
  (info: ModalInfo) =>
  (state: ModalInfo[]): ModalInfo[] => {
    const existed = info.id && state.some((x) => x.id === info.id);
    if (!existed) {
      return [...state, info];
    }

    return state.map((item) => (item.id !== info.id ? item : info));
  };

const Modals: React.FC<{ children?: ReactNode }> = ({ children }) => {
  const [modals, setModals] = useState<ModalInfo[]>([]);
  useBodyClass(modals.length > 0, 'no-scroll');

  const handlePresent = useCallback(
    (modalContent: React.ReactNode, backdropClick?: () => void, id?: string) => {
      id = id || `modal_${modals.length}`;
      setModals(modalSetter({ id, content: modalContent, backdropClick }));
      return id;
    },
    [modals.length],
  );

  const handleDismiss = useCallback((id: string) => {
    setModals((data) => data.filter((t) => t.id !== id));
  }, []);

  const backdropClick = useCallback(() => {
    if (modals.length === 0) {
      return;
    }
    const removedModal = modals[modals.length - 1];
    Array.from(document.querySelectorAll(`#${removedModal.id} .modal`)).forEach((x) =>
      x.classList.add('closing'),
    );
    setTimeout(() => {
      handleDismiss(removedModal.id);
    }, 200);
  }, [handleDismiss, modals]);

  return (
    <Context.Provider
      value={{
        onPresent: handlePresent,
        onDismiss: handleDismiss,
      }}
    >
      {children}
      {modals?.map((modal) => (
        <StyledModalWrapper key={modal.id} id={modal.id}>
          <StyledBackdrop
            className="modal"
            onClick={() => {
              if (modal.backdropClick) {
                modal.backdropClick();
              } else {
                backdropClick();
              }
            }}
          />
          <ModalContent className="modal">
            {React.isValidElement(modal.content) &&
              React.cloneElement(modal.content, {
                onDismiss: () => {
                  Array.from(document.querySelectorAll(`#${modal.id} .modal`)).forEach((x) =>
                    x.classList.add('closing'),
                  );
                  setTimeout(() => {
                    handleDismiss(modal.id);
                  }, 200);
                },
              })}
          </ModalContent>
        </StyledModalWrapper>
      ))}
    </Context.Provider>
  );
};

const StyledModalWrapper = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1001;
  overflow-y: auto;
`;

const ModalContent = styled.div<{ isClose?: boolean }>`
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: center;
  width: 100%;
  align-items: flex-end;
  padding: 0px 0;
  position: relative;
  animation: swipe-up 200ms ease-out;
  height: 100%;
  pointer-events: none;
  &.closing {
    animation: swipe-down 100ms ease-in forwards !important;
  }
  ${screenUp('lg')`
    padding: 20px 20px;
    align-items: center;
    animation: zoom-in 200ms ease-out;
    min-height: 100%;
    height: auto;
    &.closing {
      animation: zoom-in-out 100ms ease-in forwards !important;
    }
  `}
`;

const StyledBackdrop = styled.div<{ isClose?: boolean }>`
  /* backdrop-filter: blur(1px); */
  background-color: rgba(0, 0, 0, 0.45);
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  animation: fade-in 150ms ease-out;
  &.closing {
    animation: fade-out 150ms ease-in forwards !important;
  }
`;

export default Modals;
