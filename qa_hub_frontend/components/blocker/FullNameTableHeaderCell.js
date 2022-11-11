import {StyledTableCell} from "../primitives/Table/StyledTableCell";
import {Switch} from "@mui/material";
import {useState, useEffect} from "react";

export default function FullNameTableHeaderCell({ showFullName, setShowFullName }) {
    const [title, setTitle] = useState(null)

    useEffect(() => {
        if (showFullName) {
            setTitle ("FullName")
        } else  {
            setTitle ("ShortName")
        }
    }, [showFullName])

    function handleSwitchShowFullName(event) {
        setShowFullName(event.target.checked)
    }

    return <StyledTableCell align='left'>
        <Switch checked={showFullName}
                onChange={handleSwitchShowFullName}
        />
        { title }
    </StyledTableCell>
}