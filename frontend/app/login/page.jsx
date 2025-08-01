import LoginPage from "../../components/loginPage";

export const metadata = {
  title: "Login | AI Component Generator",
  description: "Login to your account to generate and manage AI-powered React components.",
  keywords: ["AI", "React", "Login", "Component Generator", "Code", "Web Development"],
  openGraph: {
    title: "Login | AI Component Generator",
    description: "Login to your account to generate and manage AI-powered React components.",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Login | AI Component Generator",
    description: "Login to your account to generate and manage AI-powered React components.",
    images: ["/og-image.png"],
  },
};

export default function Login() {
  return (
    <>
      <LoginPage />
    </>
  )
};