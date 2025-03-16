import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import Sidebar from "@/components/sidebar";

import { Toaster } from 'react-hot-toast';

import NextAuthProvider from "./context/nextAuthProvider";
import { options } from "./api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import AuthProvider from "./context/AuthProvider";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  let session;
  async () => {
    session = await getServerSession(options);
  };

  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen font-sans antialiased",
          fontSans.variable,
        )}
      >
        <NextAuthProvider session={session}>
          <AuthProvider>
            <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
              <div className="relative flex flex-row h-screen">
                <Sidebar />
                <main className="flex-grow container mx-auto max-w-8xl pt-16 px-12">
                  <Toaster position="top-right" />
                  {children}
                </main>
              </div>
            </Providers>
          </AuthProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
