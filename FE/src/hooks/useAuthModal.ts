import { useState } from 'react';

export interface AuthModalProps {
  show: boolean;
  mode: 'login' | 'register';
  onHide: () => void;
}

export const useAuthModal = () => {
  const [authModalProps, setAuthModalProps] = useState<AuthModalProps>({
    show: false,
    mode: 'login',
    onHide: () => setAuthModalProps(prev => ({ ...prev, show: false }))
  });

  const openLoginModal = () => {
    setAuthModalProps({
      show: true,
      mode: 'login',
      onHide: () => setAuthModalProps(prev => ({ ...prev, show: false }))
    });
  };

  const openRegisterModal = () => {
    setAuthModalProps({
      show: true,
      mode: 'register',
      onHide: () => setAuthModalProps(prev => ({ ...prev, show: false }))
    });
  };

  return {
    authModalProps,
    openLoginModal,
    openRegisterModal
  };
};
