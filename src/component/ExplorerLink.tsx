import React, { ReactNode, useMemo } from 'react';
import { config } from '../config';

export type ExplorerLinkProps = {
  address: string | number;
  children: ReactNode;
  type?: 'address' | 'token' | 'tx' | 'blocks';
};

export const ExplorerLink: React.FC<ExplorerLinkProps> = ({ address, children, type }) => {
  const url = useMemo(() => {
    return [config.explorerUrl, type || 'address', address].join('/');
    return '';
  }, [address, type]);

  return (
    <a target="_blank" href={url} rel="noreferrer">
      {children}
    </a>
  );
};
