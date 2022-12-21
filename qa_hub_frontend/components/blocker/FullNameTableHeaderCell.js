import {StyledTableCell} from "../primitives/Table/StyledTableCell";
import {Switch} from "@mui/material";
import {useState, useEffect} from "react";

export default function FullNameTableHeaderCell({ showFullName, setShowFullName, ...props }) {
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

    return <StyledTableCell {...props}  align='left'>
        <div style={{display: "flex", alignItems: "center"}}>
            <div style={{width: "12px", minWidth: "12px"}}></div>
            <Switch checked={showFullName}
                    onChange={handleSwitchShowFullName}
            /> { title }
        </div>


    </StyledTableCell>
}