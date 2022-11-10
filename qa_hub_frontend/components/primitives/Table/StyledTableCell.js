import {styled} from "@mui/material/styles";
import {TableCell} from "@mui/material";
import {tableCellClasses} from "@mui/material/TableCell";
import {customTheme} from "../../../styles/CustomTheme";

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
    color: theme.palette.common.white,
    borderColor: customTheme.palette.table.header,

    [`&.${tableCellClasses.head}`]: {
        backgroundColor: customTheme.palette.table.header
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));