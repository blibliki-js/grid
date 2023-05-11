import { ReactNode } from "react";
import { Box, Button, Link, Tab, Tabs, TextField } from "@mui/material";
import styled from "@emotion/styled";

import { useAppDispatch, useAppSelector } from "hooks";
import { setActiveTab, start, stop } from "globalSlice";
import Patch from "./Patch";
import { setName as setPatchName } from "patchSlice";

const HeaderContainer = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  box-sizing: border-box;
`;

const Item = styled.div`
  margin: 10px;
`;

const Group = styled.div`
  display: flex;
  align-items: center;
`;

export default function Header() {
  const dispatch = useAppDispatch();
  const { activeTab, isStarted } = useAppSelector((state) => state.global);
  const {
    patch: { name: patchName },
  } = useAppSelector((state) => state.patch);

  const onChangeTab = (_: any, newValue: number) => {
    dispatch(setActiveTab(newValue));
  };

  const togglePlay = () => {
    const toggle = isStarted ? stop : start;
    dispatch(toggle());
  };

  return (
    <HeaderContainer sx={{ px: 1, borderBottom: 1, borderColor: "divider" }}>
      <Group>
        <HeaderItem>
          <Patch />
        </HeaderItem>
        <HeaderItem>
          <TextField
            id="patchName"
            variant="standard"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              dispatch(setPatchName(event.target.value))
            }
            value={patchName}
          />
        </HeaderItem>
        <HeaderItem>
          <Button variant="outlined" onClick={togglePlay}>
            {isStarted ? "Stop" : "Start"}
          </Button>
        </HeaderItem>
      </Group>
      <Group>
        <Tabs value={activeTab} onChange={onChangeTab}>
          <Tab label="Grid" {...a11yProps(0)} />
          <Tab label="Routes" {...a11yProps(1)} />
        </Tabs>
      </Group>
      <Group>
        <HeaderItem>
          <Link href="https://github.com/blibliki-js/grid" target="_blank">
            Github
          </Link>
        </HeaderItem>
      </Group>
    </HeaderContainer>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function HeaderItem(props: { children: ReactNode }) {
  const { children } = props;

  return <Item>{children}</Item>;
}
