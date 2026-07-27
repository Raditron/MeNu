import {
  confirmPasswordReset as firebaseConfirmPasswordReset,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth'
import { auth } from '../shared/firebase/firebase'

export function registerWithEmail(email: string, password: string) {
  return createUserWithEmailAndPassword(auth, email, password)
}

export function loginWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password)
}

export function requestPasswordReset(email: string) {
  return sendPasswordResetEmail(auth, email)
}

export function confirmPasswordReset(oobCode: string, newPassword: string) {
  return firebaseConfirmPasswordReset(auth, oobCode, newPassword)
}

export function signOut() {
  return firebaseSignOut(auth)
}
