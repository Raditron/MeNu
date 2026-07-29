import { createContext } from 'react';
import type { User } from 'firebase/auth';

export interface Session {
  user: User | null;
  loading: boolean;
}

export const SessionContext = createContext<Session | undefined>(undefined);
