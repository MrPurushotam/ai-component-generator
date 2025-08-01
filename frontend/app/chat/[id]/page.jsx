import ChatUi from '../../../components/ChatUi'
import Head from 'next/head'

export default async function ChatDetailPage({ params }) {
    const id = await params.id;
    console.log(id);

    return (
        <>
            <Head>
                <title>Chat Session | AI Component Generator</title>
                <meta name="description" content="Continue your chat session with the AI to generate and customize React components instantly." />
                <meta name="keywords" content="AI, React, Chat, Component Generator, Code, Web Development" />
                <meta property="og:title" content="Chat Session | AI Component Generator" />
                <meta property="og:description" content="Continue your chat session with the AI to generate and customize React components instantly." />
                <meta property="og:type" content="website" />
                <meta property="og:image" content="/og-image.png" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Chat Session | AI Component Generator" />
                <meta name="twitter:description" content="Continue your chat session with the AI to generate and customize React components instantly." />
                <meta name="twitter:image" content="/og-image.png" />
            </Head>
            <ChatUi chatIdFromUrl={id} />
        </>
    )
}