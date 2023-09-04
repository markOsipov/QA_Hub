import {StyledTableCell} from "../primitives/Table/StyledTableCell";
import {useState, useEffect} from "react";
import EditableTableCell from "../primitives/Table/EditableTableCell";
import projectState from "../../state/ProjectState";
import "../../utils/Extensions";

export default function FullNameTableCell({ showFullName, setShowFullName, blockedTest, setBlockedTest, handleTestcaseEditFinish, openTestHistoryModal, ...props }) {
    const [hovered, setHovered] = useState(false)
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

    return <EditableTableCell
      style={{padding: "5px 9px"}}
      value =  { showFullName ? blockedTest.fullName : blockedTest.shortName }
      content={
        <div
            onClick={() => openTestHistoryModal(blockedTest.fullName)}
            onMouseOver={() => {setHovered(true)}}
            onMouseLeave={() => {setHovered(false)}}
            onBlur={() => {setHovered(false)}}
            style={{
                cursor: 'pointer',
                padding: '3px 7px',
                backgroundColor: hovered && 'rgba(255, 255, 255, 0.07)'
            }}
        > {
            showFullName ? blockedTest.fullName : blockedTest.shortName
        }
        </div>
    }
      onChangeCallback={handleFieldChange}
      onBlurCallback={handleTestcaseEditFinish}
      {...props}
    />
}