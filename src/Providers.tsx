"use client";

import { Provider } from "react-redux";
import { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";

import { store } from "@/store";
import EngineInitializer from "@/EngineInitializer";
import Header from "@/components/layout/Header";
import { ThemeProvider } from "./components/ThemeProvider";

export default function Providers(props: { children: ReactNode }) {
  const { children } = props;

  return (
    <Provider store={store}>
      <ClerkProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <EngineInitializer />
          {children}
        </ThemeProvider>
      </ClerkProvider>
    </Provider>
  );
}
