import {
  confirmPasswordReset as firebaseConfirmPasswordReset,
  createUserWithEmailAndPassword,
  deleteUser,
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

// Compensating action for when a Firebase account was created but the
// paired backend registration failed — undoes the Firebase side effect
// so the email isn't stuck in "already in use" limbo.
export function deleteCurrentUser() {
  if (!auth.currentUser) {
    return Promise.resolve()
  }
  return deleteUser(auth.currentUser)
}
