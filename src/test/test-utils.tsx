import { ReactElement, ReactNode } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { AuthProvider } from "@/context/AuthContext";

function AllProviders({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) {
  return render(ui, { wrapper: AllProviders, ...options });
}

export * from "@testing-library/react";
export { renderWithProviders as render };
