import { forwardRef, useEffect, useState, createRef } from "react";
import styled from "@emotion/styled";
import AudioModule, { AudioModuleProps } from "components/AudioModule";

import { useAppDispatch, useAppSelector } from "hooks";
import { updateLayout, ExtendedLayout } from "./layoutsSlice";
import { selectModuleByLayoutId } from "components/AudioModule/modulesSlice";

const Item = styled.div`
  background: white;
  background: rgba(0, 0, 0, 0.2);
`;

const ComponentContainer = styled.div`
  padding: 0 20px;
  &.get-width {
    position: absolute;
    visibility: hidden;
  }
`;

const DraggableBackground = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  cursor: move;
`;

interface GridItemInterface {
  className?: string;
  draggableHandle: string;
  layout: ExtendedLayout;
}

export default forwardRef<HTMLDivElement, GridItemInterface>(
  (props, parentRef) => {
    const { className, draggableHandle, layout, ...rest } = props;

    const dispatch = useAppDispatch();
    const audioModule = useAppSelector((state) =>
      selectModuleByLayoutId(state, layout.i)
    );

    const [dimensions, setDimensions] = useState<[number, number]>();
    const [tempClassName, setTempClassName] = useState("get-width");
    const ref = createRef<HTMLDivElement>();

    useEffect(() => {
      if (!audioModule || !ref.current) return;

      setDimensions([ref.current.offsetWidth, ref.current.offsetHeight]);
    }, [audioModule]);

    useEffect(() => {
      if (!audioModule || !dimensions) return;

      const [width, height] = dimensions;

      const w = Math.ceil(width / 10);
      const h = Math.ceil(height / 10);

      dispatch(updateLayout({ id: layout.i, changes: { w, h } }));

      setTempClassName("");
    }, [audioModule, dimensions]);

    if (!audioModule) return null;

    return (
      <Item {...rest} className={className} ref={parentRef}>
        <DraggableBackground className={draggableHandle} />
        <ComponentContainer ref={ref} className={tempClassName}>
          <AudioModule audioModule={audioModule} />
        </ComponentContainer>
      </Item>
    );
  }
);
