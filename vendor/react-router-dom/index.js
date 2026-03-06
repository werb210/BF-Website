import React from "react";
import { Switch, Route as WouterRoute, useParams as useWouterParams } from "wouter";

export function Routes({ children }) {
  return React.createElement(Switch, null, children);
}

export function Route({ path, element }) {
  return React.createElement(WouterRoute, { path }, element ?? null);
}

export function useParams() {
  return useWouterParams();
}
