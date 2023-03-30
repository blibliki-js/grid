import { ReactNode } from "react";
import styled from "@emotion/styled";
import Header from "./Header";

const Main = styled.main``;
const LayoutContainer = styled.div``;

export default function Layout(props: { children: ReactNode }) {
  const { children } = props;

  return (
    <LayoutContainer>
      <Header />
      <Main>{children}</Main>
    </LayoutContainer>
  );
}
