import React, { useCallback, useContext, useMemo, useRef } from 'react';

import { Context } from './Modals';

export const useModal = (modal: React.ReactNode, id?: string, backdropClick?: () => void) => {
  const { onDismiss, onPresent } = useContext(Context);
  const ref = useRef<string>(id || '');

  const handlePresent = useCallback(() => {
    ref.current = onPresent(modal, backdropClick, ref.current);
  }, [backdropClick, modal, onPresent]);

  const handleDismiss = useCallback(() => {
    onDismiss(ref.current);
  }, [onDismiss]);

  return useMemo(() => [handlePresent, handleDismiss], [handlePresent, handleDismiss]);
};

export const useModalFactory = <T>(
  createModal: React.FC<T>,
  id?: string,
  backdropClick?: () => void,
) => {
  const { onDismiss, onPresent } = useContext(Context);
  const ref = useRef<string>(id || '');
  const open = useCallback(
    (params: T) => {
      ref.current = onPresent(createModal(params), backdropClick, ref.current);
    },
    [backdropClick, createModal, onPresent],
  );

  const dismiss = useCallback(() => {
    onDismiss(ref.current);
  }, [onDismiss]);

  return [open, dismiss];
};

export * from './ModalComponent';
