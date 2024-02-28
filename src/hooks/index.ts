"use client";

import { Connection, EdgeChange, Node, NodeChange } from "reactflow";
import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { getAuth, signInWithCustomToken } from "firebase/auth";

import type { RootState, AppDispatch } from "@/store";
import {
  onNodesChange as _onNodesChange,
  onEdgesChange as _onEdgesChange,
  onConnect as _onConnect,
  addNode as _addNode,
} from "@/components/Grid/gridNodesSlice";
import { modulesSelector } from "@/components/AudioModule/modulesSlice";
import Patch, { IPatch } from "@/models/Patch";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export function useFirebase() {
  const { user } = useUser();
  const { getToken } = useAuth();

  useEffect(() => {
    if (!user?.id) return;

    const signInWithClerk = async () => {
      const auth = getAuth();
      const token = await getToken({ template: "integration_firebase" });
      if (!token) throw Error("Token is empty");
      await signInWithCustomToken(auth, token);
    };

    signInWithClerk();
  }, [getToken, user?.id]);
}

export function usePatches(): IPatch[] {
  const [patches, setPatches] = useState<IPatch[]>([]);

  useEffect(() => {
    Patch.all().then((data) => {
      setPatches(data.map((patch) => patch.serialize()));
    });
  }, []);

  return patches;
}

export function usePatch() {
  const { patch } = useAppSelector((state) => state.patch);
  const { isSignedIn, user } = useUser();

  const canCreate = isSignedIn && !patch.id;
  const canUpdate = patch && user && patch.userId === user.id;
  const canDelete = canUpdate;

  return { patch, canCreate, canUpdate, canDelete };
}

export const useAudioModule = (id: string) => {
  const audioModule = useAppSelector((state) =>
    modulesSelector.selectById(state, id),
  );

  if (!audioModule) return;

  return audioModule;
};

export function useGridNodes() {
  const dispatch = useAppDispatch();
  const { nodes, edges, viewport } = useAppSelector((state) => state.gridNodes);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => dispatch(_onNodesChange(changes)),
    [dispatch],
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => dispatch(_onEdgesChange(changes)),
    [dispatch],
  );

  const onConnect = useCallback(
    (connection: Connection) => dispatch(_onConnect(connection)),
    [dispatch],
  );

  const addNode = useCallback(
    (node: Node) => dispatch(_addNode(node)),
    [dispatch],
  );

  return {
    nodes,
    edges,
    viewport,
    addNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
  };
}

export enum ColorScheme {
  Light = "light",
  Dark = "dark",
}

export function useColorScheme() {
  const [color, setColor] = useState<ColorScheme>(ColorScheme.Light);

  useEffect(() => {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setColor(isDark ? ColorScheme.Dark : ColorScheme.Light);

    const onColorSchemeUpdate = (event: MediaQueryListEvent) => {
      setColor(event.matches ? ColorScheme.Dark : ColorScheme.Light);
    };

    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", onColorSchemeUpdate);

    return () => {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .removeEventListener("change", onColorSchemeUpdate);
    };
  }, []);

  return color;
}
