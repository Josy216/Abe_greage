// Import React and the Hooks we need here
import React, { useState, useEffect, useContext, useMemo } from 'react';
// Import the Util function we created to handle the reading from the local storage
import getAuth from '../util/auth';

interface AuthContextType {
  isLogged: boolean;
  isAdmin: boolean;
  employee: any;
  setIsLogged: (value: boolean) => void;
  setIsAdmin: (value: boolean) => void;
  setEmployee: (value: any) => void;
}

// Create a context object with proper type
export const AuthContext = React.createContext<AuthContextType | null>(null);

// Create a custom hook to use the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Create a provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [employee, setEmployee] = useState<any>(null);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      isLogged,
      isAdmin,
      employee,
      setIsLogged,
      setIsAdmin,
      setEmployee,
    }),
    [isLogged, isAdmin, employee]
  );

  useEffect(() => {
    // Retrieve the logged in user from local storage
    const loggedInEmployee = getAuth();
    loggedInEmployee.then((response) => {
      if (response.employee_token) {
        setIsLogged(true);
        // 3 is the employee_role for admin
        if (response.employee_role === 3) {
          setIsAdmin(true);
        }
        setEmployee(response);
      }
    });
  }, []);
  return <AuthContext.Provider value={value}>
    {children}
  </AuthContext.Provider>;
};
