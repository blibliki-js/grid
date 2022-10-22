import { ReactNode, useEffect, useState } from "react";
import { Provider, useDispatch } from "react-redux";
import styled from "@emotion/styled";
import { StyledEngineProvider } from "@mui/material/styles";

import "App.scss";

import { store } from "./store";
import { initialize } from "./globalSlice";
import Grid from "./Grid";
import Routes from "Routes";
import { Box, Tabs, Tab, Link } from "@mui/material";
import EngineInitializer from "EngineInitializer";
import Patches from "Patches";

const Main = styled.div``;

export default function ProviderApp() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function App() {
  const dispatch = useDispatch();
  const [currentTab, setCurrentTab] = useState(0);

  useEffect(() => {
    dispatch(initialize());
  }, [dispatch]);

  const onChangeTab = (_: any, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <StyledEngineProvider injectFirst>
      <Main>
        <EngineInitializer />

        <Container>
          <Link href="https://github.com/blibliki-js/grid">Github</Link>
        </Container>

        <Container>
          <Patches />
        </Container>

        <Container>
          <Tabs value={currentTab} onChange={onChangeTab}>
            <Tab label="Grid" {...a11yProps(0)} />
            <Tab label="Routes" {...a11yProps(1)} />
          </Tabs>
        </Container>

        <TabPanel value={currentTab} index={0}>
          <Grid />
        </TabPanel>
        <TabPanel value={currentTab} index={1}>
          <Routes />
        </TabPanel>
      </Main>
    </StyledEngineProvider>
  );
}

function Container(props: { children: ReactNode }) {
  const { children } = props;
  return (
    <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>{children}</Box>
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
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}
