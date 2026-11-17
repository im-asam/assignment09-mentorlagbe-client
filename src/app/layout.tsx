import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MentorLagbe | Find Your Ideal Tutor or Mentorship Batch",
  description:
    "MentorLagbe connects students with qualified tutors for subject-wise tuition and 1-on-1 mentorship — online or offline, across Bangladesh and beyond.",
};

// Routes block on request-time data (live tuitions, sessions) —
// opt out of instant-navigation validation for the whole app.
export const instant = false;

// Runs before first paint: applies the saved theme (or system preference)
// so the page never flashes the wrong theme.
const themeScript = `(function(){try{var t=localStorage.getItem('mentorlagbe-theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark');}}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col font-sans">
        <Toaster
          position="top-center"
          toastOptions={{
            style: { fontFamily: "inherit" },
            success: { iconTheme: { primary: "#4f46e5", secondary: "#fff" } },
          }}
        />
        <Navbar />
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 pt-6 sm:px-6">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
