import React from 'react';
import { UserTypeProvider } from '../components/UserTypeContext';

export default function Root({ children }) {
  return <UserTypeProvider>{children}</UserTypeProvider>;
}