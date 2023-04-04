import {styled} from "@mui/material/styles";
import {TextField} from "@mui/material";

const StyledTextField = styled((props) => (
    <TextField
        {...props}
    />
))(({ theme }) => ({
    '& .MuiInputLabel-root': {
        color: "var(--faded-text-color)"
    }
}));

export default StyledTextField