import ChatUi from '../../../components/ChatUi'
import Head from 'next/head'

export const metadata = {
    title: "Chat Session | AI Component Generator",
    description: "Continue your chat session with the AI to generate and customize React components instantly.",
    keywords: ["AI", "React", "Chat", "Component Generator", "Code", "Web Development"],
    openGraph: {
        title: "Chat Session | AI Component Generator",
        description: "Continue your chat session with the AI to generate and customize React components instantly.",
        type: "website",
        images: ["/og-image.png"],
    },
    twitter: {
        card: "summary_large_image",
        title: "Chat Session | AI Component Generator",
        description: "Continue your chat session with the AI to generate and customize React components instantly.",
        images: ["/og-image.png"],
    },
};


export default async function ChatDetailPage({ params }) {
    const id = await params.id;
    console.log(id);

    return (
        <>
            <ChatUi chatIdFromUrl={id} />
        </>
    )
}