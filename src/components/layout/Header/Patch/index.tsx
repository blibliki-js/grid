"use client";

import { ReactNode } from "react";

import { TriggerModal } from "@/components/Modal";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { destroy, save } from "@/patchSlice";
import Export from "./Export";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  Button,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuSeparator,
} from "@/components/ui";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";

export default function Patch() {
  const { patch } = useAppSelector((state) => state.patch);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Patch</Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56 p-3">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Save asNew={false}>Save</Save>
          </DropdownMenuItem>
          {patch.id && (
            <DropdownMenuItem>
              <Save asNew={true}>Copy</Save>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem>
            <TriggerModal modalName="patch" type="open">
              <span>Load</span>
            </TriggerModal>
          </DropdownMenuItem>

          {patch.id && (
            <DropdownMenuItem>
              <Destroy disabled={!patch.id}>Delete</Destroy>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Export />
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem>
            <TriggerModal modalName="addAudioModule" type="open">
              Add module
            </TriggerModal>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Save(props: { asNew: boolean; children: ReactNode }) {
  const dispatch = useAppDispatch();
  const { asNew, children } = props;

  const onSave = () => {
    dispatch(save(asNew));
  };

  return <button onClick={onSave}>{children}</button>;
}

function Destroy(props: { disabled: boolean; children: ReactNode }) {
  const dispatch = useAppDispatch();
  const { disabled, children } = props;

  const onDestroy = () => {
    dispatch(destroy());
  };

  return (
    <button onClick={onDestroy} disabled={disabled}>
      {children}
    </button>
  );
}
