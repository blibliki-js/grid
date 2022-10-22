import {
  FormControl,
  Select,
  SelectChangeEvent,
  MenuItem,
} from "@mui/material";
import Name from "../attributes/Name";

const VOICE_SELECTIONS = [1, 2, 3, 4, 5, 6];

export default function VoiceScheduler(props: {
  id: string;
  name: string;
  props: { polyNumber: number };
  updateProps: Function;
}) {
  const {
    id,
    name,
    updateProps,
    props: { polyNumber },
  } = props;
  const updateSelectedId = (event: SelectChangeEvent<string>) => {
    updateProps(id, { polyNumber: event.target.value });
  };

  return (
    <FormControl sx={{ width: 70 }} fullWidth>
      <Name id={id} value={name} />
      <Select
        labelId="voice-select"
        id="voice-select"
        value={polyNumber.toString()}
        label="select number of voices"
        onChange={updateSelectedId}
      >
        {VOICE_SELECTIONS.map((number) => (
          <MenuItem key={number} value={number}>
            {number}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
