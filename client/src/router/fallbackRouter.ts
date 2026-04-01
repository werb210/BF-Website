import type { ReactNode } from "react";

type BrowserRouterProps = {
  children: ReactNode;
};

export const BrowserRouter = ({ children }: BrowserRouterProps) => children;
