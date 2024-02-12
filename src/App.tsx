import { ReactNode } from "react";
import { Provider } from "react-redux";

import "reactflow/dist/style.css";
import "App.scss";

import "models/db";
import { store } from "./store";
import Grid from "./Grid";
import Layout from "Layout";
import EngineInitializer from "EngineInitializer";

export default function ProviderApp() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

function App() {
  return (
    <Layout>
      <EngineInitializer />

      <Grid />
    </Layout>
  );
}
