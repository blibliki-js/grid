import { ReactNode } from "react";
import Header from "./Header";

export default function Layout(props: { children: ReactNode }) {
  const { children } = props;

  return (
    <div>
      <Header />
      <div>{children}</div>
    </div>
  );
}
