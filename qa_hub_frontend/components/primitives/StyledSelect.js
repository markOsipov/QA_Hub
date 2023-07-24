import {styled} from "@mui/material/styles";
import {Select, TextField} from "@mui/material";
import {customTheme} from "../../styles/CustomTheme";

const StyledSelect = styled((props) => (
  <Select {...props}/>
))(({ theme }) => ({
  '& .MuiInputLabel-root': {
    color: customTheme.palette.text.faded
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: `1px solid ${customTheme.palette.text.disabled}`
  },
  '& .MuiSelect-icon': {
    color: customTheme.palette.text.faded
  }
}));

export default StyledSelect