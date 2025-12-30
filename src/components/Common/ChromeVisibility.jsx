"use client";

import { usePathname } from "next/navigation";

const HIDE_PREFIXES = ["/profile/student"];

const ChromeVisibility = ({ children }) => {
  const pathname = usePathname() || "";
  const shouldHide = HIDE_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (shouldHide) return null;
  return children;
};

export default ChromeVisibility;
