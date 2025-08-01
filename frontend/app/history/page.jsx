import HistoryPage from '../../components/HistoryPage'

export const metadata = {
  title: "History | AI Component Generator",
  description: "View your history of AI-generated React components and previous chat sessions.",
  keywords: ["AI", "React", "History", "Component Generator", "Code", "Web Development"],
  openGraph: {
    title: "History | AI Component Generator",
    description: "View your history of AI-generated React components and previous chat sessions.",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "History | AI Component Generator",
    description: "View your history of AI-generated React components and previous chat sessions.",
    images: ["/og-image.png"],
  },
};


const History = () => {
  return (
    <>
      <HistoryPage />
    </>
  )
}

export default History;