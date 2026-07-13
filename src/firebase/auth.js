import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth'
import { auth } from './config'
import { initUserDoc } from './db'

export async function signUpWithEmail(email, password, displayName) {
  const cred = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(cred.user, { displayName })
  await initUserDoc(cred.user.uid, displayName)
  return cred.user
}

export async function signInWithEmail(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password)
  return cred.user
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider()
  const result = await signInWithPopup(auth, provider)
  await initUserDoc(result.user.uid, result.user.displayName || 'Sprout User')
  return result.user
}

export async function signOutUser() {
  await signOut(auth)
}
