import styled from 'styled-components';
import { screenUp } from '../../utils/styles';
import icClose from '../../assets/icons/ic-x.svg';
import { StyledMediumText } from '../Text';

type ModalSize = 'sxs' | 'xs' | 'sm' | 'md' | 'lg';
export interface ModalProps {
  onDismiss?: () => void;
  size?: ModalSize;
}

const getModalSize = (size: ModalSize = 'sm') => {
  switch (size) {
    case 'sxs':
      return 360;
    case 'xs':
      return 420;
    case 'sm':
      return 500;
    case 'md':
      return 800;
    case 'lg':
      return 1140;
    default:
      return 500;
  }
};

export const Modal = styled.div<{ size?: ModalSize }>`
  position: relative;
  width: 100%;
  z-index: 1000;
  background-color: #29292c;
  max-height: calc(100% - 56px); // 56px is the height of header
  display: flex;
  flex-direction: column;
  ${(p) => screenUp('lg', p)`
    margin: 0 auto;
    max-width: ${(p) => getModalSize(p.size)}px;
    border-radius: 10px;
    max-height: 100%;
    display: block;
    flex-direction: row;
  `}
  pointer-events: auto;
`;

export const ModalContent = styled.div<{ hideDivider?: boolean }>`
  padding: ${(p) => (p.hideDivider ? '0 20px 20px' : '20px')};
  flex: 1;
  overflow: auto;
  ${screenUp('lg')`
    flex: 0 1 auto;
    overflow: visible;
  `}
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  font-size: var(--font-size-md);
  font-weight: 600;
`;

export const ModalFooter = styled.div``;

export const ModalTitle = styled.div`
  font-size: var(--font-size-md);
  font-weight: 600;
`;

export const ModalCloseButton = styled.div`
  background-image: url(${icClose});
  background-size: 12px 12px;
  background-repeat: no-repeat;
  background-position: center;
  height: 24px;
  width: 24px;
  margin-right: -6px;
  opacity: 0.75;
  cursor: pointer;
  &:hover {
    opacity: 1;
  }
`;

export const ModalDivider = styled.div`
  border-top: 1px dashed #404040;
  margin: 0 20px;
`;

export interface BasicModalProps extends ModalProps {
  title: string | React.ReactNode;
  children?: React.ReactNode;
  hideDivider?: boolean;
}

export const BasicModal = ({
  size,
  title,
  onDismiss,
  children,
  hideDivider,
}: BasicModalProps) => {
  return (
    <Modal size={size || 'xs'}>
      <ModalHeader>
        {typeof title === 'string' ? (
          <StyledMediumText>{title.toUpperCase()}</StyledMediumText>
        ) : (
          title
        )}
        {onDismiss && <ModalCloseButton onClick={onDismiss} />}
      </ModalHeader>
      {!hideDivider && <ModalDivider />}
      <ModalContent hideDivider={hideDivider}>{children}</ModalContent>
    </Modal>
  );
};

export default Modal;
