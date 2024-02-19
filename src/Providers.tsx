"use client";

import { Provider } from "react-redux";
import { ReactNode } from "react";

import { store } from "@/store";
import EngineInitializer from "@/EngineInitializer";
import Header from "@/components/layout/Header";

export default function Providers(props: { children: ReactNode }) {
  const { children } = props;

  return (
    <Provider store={store}>
      <Header />
      <EngineInitializer />
      {children}
    </Provider>
  );
}
