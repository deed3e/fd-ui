import { useCallback } from 'react';
import { toast, ToastContent, TypeOptions } from 'react-toastify';
import { SimpleToast, TransactionToast } from '../component/Toast';

export const useShowToast = () => {

  return useCallback(
    (title: string, message: string, type?: TypeOptions, toastId?: number, hash?: string) => {
      const content: ToastContent = hash ? (
        <TransactionToast hash={hash} />
      ) : (
        <SimpleToast title={title} message={message} type={type} />
      );
      toast(content, {
        icon: false,
        type: type || 'warning',
        toastId: (hash ? hash : toastId) || undefined,
        position: 'bottom-right',
      });
    },
    [],
  );
};
