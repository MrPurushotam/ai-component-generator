import HistoryPage from '../../components/HistoryPage'
import React from 'react'
import Head from 'next/head'

const History = () => {
  return (
    <>
      <Head>
        <title>History | AI Component Generator</title>
        <meta name="description" content="View your history of AI-generated React components and previous chat sessions." />
        <meta name="keywords" content="AI, React, History, Component Generator, Code, Web Development" />
        <meta property="og:title" content="History | AI Component Generator" />
        <meta property="og:description" content="View your history of AI-generated React components and previous chat sessions." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="History | AI Component Generator" />
        <meta name="twitter:description" content="View your history of AI-generated React components and previous chat sessions." />
        <meta name="twitter:image" content="/og-image.png" />
      </Head>
      <HistoryPage />
    </>
  )
}

export default History;