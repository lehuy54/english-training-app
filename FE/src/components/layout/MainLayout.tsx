// components/layout/MainLayout.tsx
import { createContext, useContext } from 'react';
import Header from './Header';
import Footer from './Footer';
import AuthModal from '../ui/AuthModal';
import { useAuthModal } from '../../hooks/useAuthModal';

// Tạo context cho AuthModal
export const AuthModalContext = createContext<ReturnType<typeof useAuthModal> | undefined>(undefined);

// Hook để sử dụng AuthModal từ bất kỳ component nào
export const useGlobalAuthModal = () => {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error('useGlobalAuthModal must be used within a MainLayout');
  }
  return context;
};

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const authModalControl = useAuthModal();
  
  return (
    <AuthModalContext.Provider value={authModalControl}>
      <div className="d-flex flex-column min-vh-100">
        <Header />
        <main className="flex-grow-1 container" style={{ paddingTop: "6rem", paddingBottom: "2rem" }}>
          {children}
        </main>
        <Footer />
        <AuthModal 
          show={authModalControl.authModalProps.show} 
          mode={authModalControl.authModalProps.mode}
          onHide={authModalControl.authModalProps.onHide} 
        />
      </div>
    </AuthModalContext.Provider>
  );
};

export default MainLayout;
