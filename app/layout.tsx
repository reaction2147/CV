import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import type { ReactNode } from "react";

const font = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "ATS Resume Optimizer",
  description: "Parse, optimize, and export ATS-ready resumes with AI assist.",
  keywords: ["ATS", "resume", "cover letter", "job search", "AI resume", "CV parser"],
  openGraph: {
    title: "ATS Resume Optimizer",
    description: "Parse, optimize, and export ATS-ready resumes with AI assist.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ATS Resume Optimizer",
    description: "Upload your CV and get ATS-ready rewrites, JD matching, and cover letters.",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={font.variable}>
      <body>
        <Providers>
          <header className="border-b border-brand-border bg-white">
            <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4 text-sm text-gray-700">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-md bg-brand text-white shadow-card" />
                <div>
                  <p className="text-base font-semibold text-gray-900">ATS Resume Optimizer</p>
                  <p className="text-xs text-gray-500">AI + ATS scoring in one place</p>
                </div>
              </div>
              <a
                href="https://openai.com"
                className="rounded-md border border-brand-border px-3 py-1 text-xs font-medium text-gray-700 transition hover:bg-slate-100"
              >
                Powered by OpenAI + Supabase
              </a>
            </div>
          </header>
          <main className="mx-auto max-w-3xl px-6 py-12">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
