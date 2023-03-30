import { ReactNode } from "react";
import { Box, Link, Tab, Tabs } from "@mui/material";
import styled from "@emotion/styled";

import { useAppDispatch, useAppSelector } from "hooks";
import { setActiveTab } from "globalSlice";
import { TriggerModal } from "components/Modal";
import Patch from "./Patch";

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
  const { activeTab } = useAppSelector((state) => state.global);

  const onChangeTab = (_: any, newValue: number) => {
    dispatch(setActiveTab(newValue));
  };

  return (
    <HeaderContainer sx={{ px: 1, borderBottom: 1, borderColor: "divider" }}>
      <Group>
        <HeaderItem>
          <Patch />
        </HeaderItem>
        <HeaderItem>
          <TriggerModal modalName="addAudioModule" type="open">
            Add module
          </TriggerModal>
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
