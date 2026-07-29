import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../shared/firebase/firebase';

export function loginWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}
