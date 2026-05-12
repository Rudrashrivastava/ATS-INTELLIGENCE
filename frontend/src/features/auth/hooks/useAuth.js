import { useContext } from 'react';
// We redirect to the centralized context to ensure singleton state
import { useAuth as useAuthContext } from '../../../context/AuthContext';

export const useAuth = () => {
  return useAuthContext();
};
