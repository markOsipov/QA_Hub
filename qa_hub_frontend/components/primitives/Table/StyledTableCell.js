import {styled} from "@mui/material/styles";
import {TableCell} from "@mui/material";
import {tableCellClasses} from "@mui/material/TableCell";
import {customTheme} from "../../../styles/CustomTheme";

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
    color: theme.palette.text.light,
    borderColor: customTheme.palette.table.header,

    [`&.${tableCellClasses.head}`]: {
        color: theme.palette.text.white,
        backgroundColor: customTheme.palette.table.header
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));