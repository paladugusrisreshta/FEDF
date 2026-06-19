// AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getLocal, setLocal } from '../services/storage';

const AuthContext = createContext();

const DEFAULT_USERS = [
  {
    name: 'Lady Genevieve Sterling',
    email: 'guest@luxury.com',
    phone: '+1 (555) 728-9321',
    address: '742 Premium Avenue, Belgravia, London',
    password: 'guest123',
    roomNumber: '702-M (Grand Terrace Suite)',
    loyaltyStatus: 'Platinum',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80'
  }
];

export const AuthProvider = ({ children }) => {
  const [users, setUsers] = useState(() => getLocal('guest-portal-users', DEFAULT_USERS));
  const [currentUser, setCurrentUser] = useState(() => getLocal('guest-portal-current-user', null));

  useEffect(() => {
    setLocal('guest-portal-users', users);
  }, [users]);

  useEffect(() => {
    setLocal('guest-portal-current-user', currentUser);
  }, [currentUser]);

  const registerUser = (userData) => {
    // Check if user already exists
    const exists = users.some(u => u.email.toLowerCase() === userData.email.toLowerCase());
    if (exists) {
      return { success: false, message: 'Email is already registered.' };
    }

    const newUser = {
      ...userData,
      roomNumber: `Suite ${Math.floor(100 + Math.random() * 800)}`,
      loyaltyStatus: 'Silver', // Defaults to Silver
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80'
    };

    setUsers(prev => [...prev, newUser]);
    return { success: true, message: 'Registration successful!' };
  };

  const loginUser = (email, password) => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    
    if (user) {
      setCurrentUser(user);
      return { success: true, user };
    }
    
    return { success: false, message: 'Invalid email or password.' };
  };

  const logoutUser = () => {
    setCurrentUser(null);
  };

  const updateUserProfile = (updatedProfile) => {
    if (!currentUser) return;
    
    // Update users array
    setUsers(prev => prev.map(u => u.email.toLowerCase() === currentUser.email.toLowerCase() ? { ...u, ...updatedProfile } : u));
    
    // Update active session
    setCurrentUser(prev => ({
      ...prev,
      ...updatedProfile
    }));
  };

  return (
    <AuthContext.Provider value={{
      users,
      currentUser,
      registerUser,
      loginUser,
      logoutUser,
      updateUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
