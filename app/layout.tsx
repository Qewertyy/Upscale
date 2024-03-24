import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ThemeProvider } from "@/components/themeProvider";
import { Toaster } from "@/components/ui/toast/toaster";
import "./globals.css";

const font = Poppins({ subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: "Average Upscaler",
  description: "Upscale Images, Powered By LexicaAPI https://lexica.qewertyy.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en" suppressHydrationWarning>
        <body className={`${font.className}`} suppressHydrationWarning>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <main className="sm:px-10 px-5">{children}</main>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
  );
}
