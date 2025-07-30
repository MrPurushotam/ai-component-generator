import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <section className="max-w-2xl w-full text-center py-16">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Welcome to AI Component Generator
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Build, manage, and chat with your custom components. Effortlessly
            generate, edit, and track your chat history.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              href="/chat"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Start Chatting
            </Link>
            <Link
              href="/history"
              className="bg-gray-200 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              View History
            </Link>
          </div>
          {/* <Image
            src="/hero-image.svg"
            alt="Hero"
            width={320}
            height={180}
            className="mx-auto mb-8"
          /> */}
        </section>
        <section className="max-w-3xl w-full mx-auto py-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            Features
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-lg mb-2">
                Component Generation
              </h3>
              <p className="text-gray-600 text-sm">
                Quickly generate reusable components for your projects.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-lg mb-2">Chat & Collaboration</h3>
              <p className="text-gray-600 text-sm">
                Interact and collaborate in real-time with your team.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-lg mb-2">History Tracking</h3>
              <p className="text-gray-600 text-sm">
                Easily access and review your chat and component history.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
