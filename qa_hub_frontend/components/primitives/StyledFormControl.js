import {styled} from "@mui/material/styles";
import {FormControl, InputLabel, Select, TextField} from "@mui/material";
import {customTheme} from "../../styles/CustomTheme";

const StyledFormControl = styled((props) => (
  <FormControl {...props}/>
))(({ theme, ...props }) => ({

  '& .MuiFormLabel-root': {
    color: customTheme.palette.text.faded,
  },
  '& .MuiFormLabel-root:not(.Mui-focused):not(.MuiFormLabel-filled)': {
    top: props.size === 'tiny' && '-11px',
  },
  '& .MuiSelect-select, & .MuiInputBase-input': {
    padding: props.size === 'tiny' && '5px'
  },
  '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
    border: `1px solid ${customTheme.palette.text.white}`
  },
}));

export default StyledFormControl