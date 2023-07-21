import {styled} from "@mui/material/styles";
import {TextField} from "@mui/material";
import {customTheme} from "../../styles/CustomTheme";

const StyledTextField = styled((props) => (
    <TextField {...props}/>
))(({ theme }) => ({
    '& .MuiInputLabel-root': {
        color:  customTheme.palette.text.faded
    },
    '& .MuiOutlinedInput-notchedOutline': {
        border: `1px solid ${customTheme.palette.text.disabled}`
    }
}));

export default StyledTextField