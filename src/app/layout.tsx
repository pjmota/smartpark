import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthProviderWrapper from "@/components/providers/AuthProviderWrapper";
import ReduxProvider from "@/components/providers/ReduxProvider";
import WebVitalsProvider from "@/components/providers/WebVitalsProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SmartPark - Sistema de Gestão",
  description: "Sistema de gestão de garagens e mensalistas",
};

type RootLayoutProps = {
  readonly children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <ReduxProvider>
          <AuthProviderWrapper>
            <WebVitalsProvider>
              {children}
            </WebVitalsProvider>
          </AuthProviderWrapper>
        </ReduxProvider>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </body>
    </html>
  );
}