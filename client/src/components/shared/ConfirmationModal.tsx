import type { FC } from 'react';
import { useEffect, useRef } from 'react';
import { FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import styled from 'styled-components';
import { useModal } from '../../context/ModalContext';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: string;
  icon?: React.ReactNode;
}

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease;
  
  ${(props: { $isOpen: boolean }) => props.$isOpen && `
    opacity: 1;
    visibility: visible;
  `}
`;

const ModalContent = styled.div<{ $isOpen: boolean }>`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  max-width: 500px;
  width: 90%;
  position: relative;
  z-index: 10000;
  margin-top: 100px;
  transform: ${(props: { $isOpen: boolean }) => props.$isOpen ? 'translateY(0)' : 'translateY(20px)'};
  transition: transform 0.3s ease, opacity 0.3s ease;
  opacity: ${(props: { $isOpen: boolean }) => props.$isOpen ? '1' : '0'};
  
  @media (max-width: 768px) {
    width: 95%;
    padding: 1.5rem;
    margin-top: 30px;
  }
`;

const ModalTitle = styled.h3`
  color: #e63946;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const Button = styled.button<{ $primary?: boolean; $color?: string }>`
  padding: 0.6rem 1.5rem;
  border: none;
  border-radius: 5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  
  ${(props: { $primary?: boolean; $color?: string }) => props.$primary 
    ? `background-color: ${props.$color || '#e63946'};
       color: white;
       &:hover {
         opacity: 0.9;
       }`
    : `background-color: #f8f9fa;
       color: #495057;
       border: 1px solid #dee2e6;
       &:hover {
         background-color: #e9ecef;
       }`
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #6c757d;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f1f1f1;
  }
`;

const ConfirmationModal: FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmColor = '#e63946',
  icon = <FaExclamationTriangle />
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const { closeModal } = useModal();

  // Handle close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const handleClose = () => {
    closeModal();
    onClose();
  };

  const handleConfirm = () => {
    closeModal();
    onConfirm();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay $isOpen={isOpen}>
      <ModalContent ref={modalRef} $isOpen={isOpen}>
        <CloseButton onClick={handleClose} aria-label="Close">
          <FaTimes />
        </CloseButton>
        <ModalTitle>
          {icon} {title}
        </ModalTitle>
        <p>{message}</p>
        <ButtonGroup>
          <Button onClick={handleClose}>
            <FaTimes /> {cancelText}
          </Button>
          <Button $primary $color={confirmColor} onClick={handleConfirm}>
            <FaExclamationTriangle /> {confirmText}
          </Button>
        </ButtonGroup>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ConfirmationModal;
