import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import HomePage from './HomePage'

export default function Home() {

  return (
    <>
      <Head>
        <title>NextGPT</title>
        <meta name="description" content="by Imad" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css"></link>
      </Head>
      <main className={styles.main}>
          <HomePage />
      </main>
    </>
  )
}