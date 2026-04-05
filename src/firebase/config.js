import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, browserLocalPersistence, setPersistence } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDyjLVPEGhEeWxwqodCXaGGhcKhEh7GcG4",
  authDomain: "numiqube-a67f9.firebaseapp.com",
  projectId: "numiqube-a67f9",
  storageBucket: "numiqube-a67f9.firebasestorage.app",
  messagingSenderId: "91585910537",
  appId: "1:91585910537:web:1d1661c19c004570eea5d8"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const provider = new GoogleAuthProvider()
export const db = getFirestore(app)

setPersistence(auth, browserLocalPersistence)