import { createContext, useContext, useState, ReactNode } from 'react';

interface NavigationContextType {
  showDrawer: boolean;
  setShowDrawer: (show: boolean) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider = ({ children }: { children: ReactNode }) => {
  const [showDrawer, setShowDrawer] = useState(false);

  return (
    <NavigationContext.Provider value={{ showDrawer, setShowDrawer }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
};
