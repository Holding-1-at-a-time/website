"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes";

/**
 * A wrapper around next-themes' ThemeProvider.
 * It allows passing of props to the underlying ThemeProvider.
 * @param {ThemeProviderProps} props - props to pass to the underlying ThemeProvider.
 * @returns {JSX.Element} - a ThemeProvider element with the passed props.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}