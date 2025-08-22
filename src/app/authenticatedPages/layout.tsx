import React from "react";
import AuthenticatedLayoutClient from "./AuthenticatedLayoutClient";

const AuthenticatedLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <AuthenticatedLayoutClient>{children}</AuthenticatedLayoutClient>;
};

export default AuthenticatedLayout;