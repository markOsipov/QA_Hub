import {StyledTableCell} from "../primitives/Table/StyledTableCell";
import {useState, useEffect} from "react";

export default function FullNameTableCell({ showFullName, blockedTest }) {
    const [content, setContent] = useState(null)

    useEffect(() => {
        if (showFullName) {
            setContent(blockedTest.fullName)
        } else {
            setContent(blockedTest.shortName)
        }
    }, [blockedTest.fullName, blockedTest.shortName, showFullName])

    return <StyledTableCell align="left">
        <label style={{padding: "5px 9px"}}>{content}</label>
    </StyledTableCell>
}