import { createContext } from 'react';

// Crear contexto de autenticación
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  return (
    <AuthContext.Provider value={{}}>
      {children}
    </AuthContext.Provider>
  );
}
