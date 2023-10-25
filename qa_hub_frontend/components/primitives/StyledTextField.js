import {styled} from "@mui/material/styles";
import {TextField} from "@mui/material";
import {customTheme} from "../../styles/CustomTheme";

const StyledTextField = styled((props) => (
    <TextField {...props}/>
))(({ theme, ...props }) => ({
    '& .MuiInputLabel-root': {
        color: customTheme.palette.text.faded,
    },
    '& .MuiInputLabel-root:not(.Mui-focused):not(.MuiFormLabel-filled)': {
         top: props.size === 'tiny' && '-10px',
        color: customTheme.palette.text.faded
    },
    '& .MuiInputLabel-root:.Mui-focused)': {
        top: props.size === 'tiny' && '0',
        color: customTheme.palette.text.faded
    },
    '& .MuiOutlinedInput-notchedOutline': {
        border: `1px solid ${customTheme.palette.text.disabled}`
    },
    '& .MuiInputBase-input': {
        padding: props.size === 'tiny' && '5px'
    },
}));

export default StyledTextField