import { ReactNode, useEffect } from "react";
import { Provider } from "react-redux";
import { StyledEngineProvider } from "@mui/material/styles";

import "App.scss";

import "models/db";
import { store } from "./store";
import { initialize } from "./globalSlice";
import Grid from "./Grid";
import Routes from "Routes";
import Layout from "Layout";
import { Box } from "@mui/material";
import EngineInitializer from "EngineInitializer";
import { useAppDispatch, useAppSelector } from "hooks";

export default function ProviderApp() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

function App() {
  const dispatch = useAppDispatch();
  const { activeTab } = useAppSelector((state) => state.global);

  useEffect(() => {
    dispatch(initialize());
  }, [dispatch]);

  return (
    <StyledEngineProvider injectFirst>
      <Layout>
        <EngineInitializer />

        <TabPanel value={activeTab} index={0}>
          <Grid />
        </TabPanel>
        <TabPanel value={activeTab} index={1}>
          <Routes />
        </TabPanel>
      </Layout>
    </StyledEngineProvider>
  );
}

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <Box sx={{ py: 3 }}>{children}</Box>
    </div>
  );
}
