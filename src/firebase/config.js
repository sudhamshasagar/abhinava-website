import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyDv188DpZJHuCVzUKRB3Khvrld96tnChlM',
  authDomain: 'abhinava-site.firebaseapp.com',
  projectId: 'abhinava-site',
  storageBucket: 'abhinava-site.firebasestorage.app',
  messagingSenderId: '823665643557',
  appId: '1:823665643557:web:ef60cdf2d7c98c5a43efcc',
}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app)

export default app