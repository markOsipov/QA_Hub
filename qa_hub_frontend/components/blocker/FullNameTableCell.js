import {StyledTableCell} from "../primitives/Table/StyledTableCell";
import {useState, useEffect} from "react";
import EditableTableCell from "../primitives/Table/EditableTableCell";
import projectState from "../../state/ProjectState";
import "../../utils/Extensions";

export default function FullNameTableCell({ showFullName, setShowFullName, blockedTest, setBlockedTest, handleTestcaseEditFinish, ...props }) {
    const [content, setContent] = useState(null)

    function handleFieldChange(event) {
        let separator = projectState.getSeparator()
        let newFullName
        let newShortName

        if (!showFullName) {
            newShortName = event.target.value
            newFullName = blockedTest.fullName.replace(blockedTest.shortName, newShortName)
        } else {
            newFullName = event.target.value
            newShortName = newFullName.substringAfterLast(separator)
        }

        setBlockedTest(
            {
                ...blockedTest,
                fullName: newFullName,
                shortName: newShortName
            }
        )
    }

    useEffect(() => {
        if (showFullName) {
            setContent(blockedTest.fullName)
        } else {
            setContent(blockedTest.shortName)
        }
    }, [blockedTest.fullName, blockedTest.shortName, showFullName])

    return <EditableTableCell style={{padding: "5px 9px"}}
                              contentText={content}
                              onChangeCallback={handleFieldChange}
                              onBlurCallback={handleTestcaseEditFinish}
                              {...props}
        />
}