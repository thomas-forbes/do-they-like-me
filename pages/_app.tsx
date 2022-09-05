import splitbee from '@splitbee/web'
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import '../styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  }
  const app = initializeApp(firebaseConfig)
  const db = getFirestore(app)

  useEffect(() => {
    splitbee.init({
      scriptUrl: '/bee.js',
      apiUrl: '/_hive',
    })
  }, [])

  return <Component {...pageProps} />
}

export default MyApp
