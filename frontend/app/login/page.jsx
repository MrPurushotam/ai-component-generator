import LoginPage from "../../components/loginPage";
import Head from "next/head";

export default function Login() {
  return (
    <>
      <Head>
        <title>Login | AI Component Generator</title>
        <meta name="description" content="Login to your account to generate and manage AI-powered React components." />
        <meta name="keywords" content="AI, React, Login, Component Generator, Code, Web Development" />
        <meta property="og:title" content="Login | AI Component Generator" />
        <meta property="og:description" content="Login to your account to generate and manage AI-powered React components." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Login | AI Component Generator" />
        <meta name="twitter:description" content="Login to your account to generate and manage AI-powered React components." />
        <meta name="twitter:image" content="/og-image.png" />
      </Head>
      <LoginPage />
    </>
  )
};