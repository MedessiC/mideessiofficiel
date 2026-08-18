import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface NavigationContextType {
  showDrawer: boolean;
  setShowDrawer: (show: boolean) => void;
  bottomNavHidden: boolean;
  setBottomNavHidden: (hidden: boolean) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider = ({ children }: { children: ReactNode }) => {
  const [showDrawer, setShowDrawer] = useState(false);
  const [bottomNavHidden, setBottomNavHidden] = useState<boolean>(() => {
    try {
      if (typeof window === 'undefined') return false;
      const v = localStorage.getItem('mideessi:bottomNavHidden');
      return v === 'true';
    } catch (err) {
      return false;
    }
  });

  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      localStorage.setItem('mideessi:bottomNavHidden', bottomNavHidden ? 'true' : 'false');
    } catch (err) {
      // ignore
    }
  }, [bottomNavHidden]);

  return (
    <NavigationContext.Provider value={{ showDrawer, setShowDrawer, bottomNavHidden, setBottomNavHidden }}>
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
