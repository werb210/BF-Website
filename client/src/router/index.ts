import type { ReactElement, ReactNode } from "react";
import { BrowserRouter as FallbackBrowserRouter } from "./fallbackRouter";

type RouteProps = {
  element?: ReactElement;
  children?: ReactNode;
};

type RoutesProps = {
  children?: ReactNode;
};

type RouterModule = {
  BrowserRouter?: ({ children }: { children: ReactNode }) => ReactNode;
  Route?: (props: RouteProps) => ReactNode;
  Routes?: (props: RoutesProps) => ReactNode;
  useParams?: () => Record<string, string | undefined>;
};

function loadRouterModule(): RouterModule | undefined {
  try {
    const req = (0, eval)("require") as (moduleId: string) => RouterModule;
    return req("react-router-dom");
  } catch {
    return undefined;
  }
}

const routerModule = loadRouterModule();

export const BrowserRouter = routerModule?.BrowserRouter ?? FallbackBrowserRouter;
export const Routes =
  routerModule?.Routes ??
  (({ children }: RoutesProps) => children ?? null);
export const Route =
  routerModule?.Route ??
  (({ element }: RouteProps) => element ?? null);
export const useParams =
  routerModule?.useParams ??
  (() => ({}));
