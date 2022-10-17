import { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import styled from "@emotion/styled";
import { StyledEngineProvider } from "@mui/material/styles";

import "App.scss";

import { store } from "./store";
import { initialize } from "./globalSlice";
import Grid from "./Grid";

const Main = styled.div``;

export default function ProviderApp() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initialize());
  }, [dispatch]);

  return (
    <StyledEngineProvider injectFirst>
      <Main>
        <Grid />
      </Main>
    </StyledEngineProvider>
  );
}
