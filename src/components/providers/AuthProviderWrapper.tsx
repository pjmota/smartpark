"use client";

import { AuthProvider } from "@/context/AuthContext/AuthContext";

type AuthProviderWrapperProps = {
  readonly children: React.ReactNode;
};

export default function AuthProviderWrapper({
  children,
}: AuthProviderWrapperProps) {
  return <AuthProvider>{children}</AuthProvider>;
}