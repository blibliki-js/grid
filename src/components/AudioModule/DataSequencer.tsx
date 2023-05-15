import { ChangeEvent, useEffect, useState } from "react";
import { Box } from "@mui/material";
import styled from "@emotion/styled";
import { chunk, groupBy } from "lodash";
import { IDataSequence } from "@blibliki/engine";

import Name from "./attributes/Name";

const Title = styled.div`
  text-align: center;
  margin-bottom: 5px;
`;

export interface SequenceProps extends IDataSequence {}

export default function DataSequencer(props: {
  id: string;
  name: string;
  props: { sequences: SequenceProps[] };
  updateProps: Function;
}) {
  const {
    id,
    updateProps,
    name: title,
    props: { sequences },
  } = props;
  const [textData, setTextData] = useState<string>(dataToText(sequences));

  useEffect(() => {
    updateProps(id, { sequences: textToData(textData) });
  }, [id, textData]);

  const onTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setTextData(event.target.value);
  };

  return (
    <Box sx={{ width: "250px", height: "400px" }}>
      <Title>
        <Name id={id} value={title} />
      </Title>

      <textarea
        style={{ position: "absolute", zIndex: "10" }}
        name="sequences"
        rows={20}
        cols={25}
        value={textData}
        onChange={onTextChange}
      />
    </Box>
  );
}

function textToData(text: string): SequenceProps[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.split(" ").map((num) => +num))
    .filter((line) => line.length % 3 === 0 && line.every((num) => !isNaN(num)))
    .map((values, i) => {
      return chunk(values, 3).map((data) => ({
        voiceNo: i,
        time: +data[0],
        frequency: +data[1],
        amplitude: +data[2],
      }));
    })
    .flat() as SequenceProps[];
}

function dataToText(data: SequenceProps[]) {
  return Object.values(groupBy(data, "voiceNo"))
    .map((sequences) =>
      sequences
        .map((sequence) =>
          [sequence.time, sequence.frequency, sequence.amplitude].join(" ")
        )
        .join(" ")
    )
    .join("\r\n");
}
