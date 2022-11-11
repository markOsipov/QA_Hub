import {StyledTableCell} from "../primitives/Table/StyledTableCell";
import {useState, useEffect} from "react";

export default function FullNameTableCell({ showFullName, blockedTest }) {
    function getContent() {
        if (showFullName) {
            return blockedTest.fullName
        }
        return blockedTest.shortName
    }

    const [content, setContent] = useState(getContent())
    useEffect(() => {
        setContent(getContent())

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showFullName])

    return <StyledTableCell align="left">
        <label style={{padding: "5px 9px"}}>{content}</label>
    </StyledTableCell>
}