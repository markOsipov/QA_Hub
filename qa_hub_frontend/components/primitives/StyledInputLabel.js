import {styled} from "@mui/material/styles";
import {InputLabel, Select, TextField} from "@mui/material";
import {customTheme} from "../../styles/CustomTheme";

const StyledInputLabel = styled((props) => (
  <InputLabel {...props}/>
))(({ theme, ...props }) => ({
    '&.MuiFormLabel-root': {
        color: customTheme.palette.text.faded,
    },
}));

export default StyledInputLabel