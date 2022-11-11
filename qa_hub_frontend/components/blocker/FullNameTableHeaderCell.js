import {StyledTableCell} from "../primitives/Table/StyledTableCell";
import {Switch} from "@mui/material";
import {useState, useEffect} from "react";

export default function FullNameTableHeaderCell({ showFullName, setShowFullName }) {
    const getTitle = () => {
        if (showFullName) {
            return "FullName"
        }
        return "ShortName"
    }

    function handleSwitchShowFullName(event) {
        setShowFullName(event.target.checked)
    }

    const [title, setTitle] = useState(getTitle())

    useEffect(() => {
        setTitle(getTitle())

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showFullName])

    return <StyledTableCell align='left'>
        <Switch checked={showFullName}
                onChange={handleSwitchShowFullName}
        />
        { title }
    </StyledTableCell>
}