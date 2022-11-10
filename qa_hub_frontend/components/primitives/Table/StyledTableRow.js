import {styled} from "@mui/material/styles";
import {TableRow} from "@mui/material";
import {customTheme} from "../../../styles/CustomTheme";

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(even)': {
        backgroundColor: customTheme.palette.table.evenRow,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));