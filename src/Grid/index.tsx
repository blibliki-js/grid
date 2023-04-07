import GridLayout, { Layout } from "react-grid-layout";
import styled from "@emotion/styled";

import GridItem from "./GridItem";
import { useAppDispatch, useAppSelector } from "hooks";
import { layoutsSelector, updateLayout } from "./layoutsSlice";

const draggableHandle = "draggable-item";

const Root = styled.div`
  padding: 16px;
`;

export default function Grid() {
  const dispatch = useAppDispatch();
  const layouts = useAppSelector((state) => layoutsSelector.selectAll(state));

  const onLayoutChange = (layouts: Layout[]) => {
    layouts.forEach((layout) => {
      dispatch(updateLayout({ id: layout.i, changes: { ...layout } }));
    });
  };

  return (
    <Root>
      <GridLayout
        layout={layouts}
        onLayoutChange={onLayoutChange}
        cols={200}
        autoSize
        isDroppable
        isResizable={false}
        width={2000}
        rowHeight={10}
        margin={[0, 0]}
        preventCollision
        draggableHandle={`.${draggableHandle}`}
        compactType={null}
      >
        {layouts.map((layout) => (
          <GridItem
            key={layout.i}
            layout={layout}
            draggableHandle={draggableHandle}
          />
        ))}
      </GridLayout>
    </Root>
  );
}
