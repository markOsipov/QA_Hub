import {StyledTableRow} from "../primitives/Table/StyledTableRow";
import {StyledTableCell} from "../primitives/Table/StyledTableCell";
import IconButton from "@mui/material/IconButton";
import {customTheme} from "../../styles/CustomTheme";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import {Switch} from "@mui/material";
import EditableTableCell from "../primitives/Table/EditableTableCell";
import FullNameTableCell from "./FullNameTableCell";
import {useState} from "react";
import {observer} from "mobx-react-lite";
import blockerState from "../../state/BlockerState";
import TaskStatusCell from "./TaskStatusCell";
import TestcaseIdCell from "./TestcaseIdCell";

const BlockedTestTableRow = observer(({ index, blockedTestForRow, showFullName, setShowFullName }) => {
    const [blockedTest, setBlockedTest] = useState(blockedTestForRow)

    function handleUnblockButtonClick() {
        blockerState.unblockTest(blockedTest)
    }

    function handleSwitchTrial(event) {
        const editedTest = {
            ...blockedTest,
            allowTrialRuns: event.target.checked
        }
        setBlockedTest(editedTest)
        blockerState.editBlockedTest(editedTest)
    }

    function handleTestcaseFieldChange(field, event) {
        setBlockedTest(
            {
                ...blockedTest,
                [field]: event.target.value
            }
        )
    }

    function handleTestcaseIdChange(event) {
        handleTestcaseFieldChange("testcaseId", event)
    }

    function handleTeamChange(event) {
        handleTestcaseFieldChange("team", event)
    }

    function handleCommentChange(event) {
        handleTestcaseFieldChange("comment", event)
    }

    function handleJiraIssueChange(event) {
        handleTestcaseFieldChange("jiraIssue", event)
    }

    function handleTestcaseEditFinish() {
        blockerState.editBlockedTest(blockedTest)
    }

    return <StyledTableRow>
        <StyledTableCell align="left">
            <label style={{ padding: "5px 9px"}}>{index + 1}</label>
        </StyledTableCell>

        <StyledTableCell align="left">
            <IconButton className="hover-highlight"
                        style={{color: customTheme.palette.text.primary, borderRadius: "2px"}}
                        onClick={handleUnblockButtonClick}
            >
                <LockOpenIcon/>
            </IconButton>
        </StyledTableCell>

        <StyledTableCell align="center">
            <Switch
                checked={blockedTest.allowTrialRuns}
                onChange={ handleSwitchTrial }
            />
        </StyledTableCell>

        <TestcaseIdCell
          blockedTest={blockedTest}
          onChangeCallback={ handleTestcaseIdChange }
          onBlurCallback={ handleTestcaseEditFinish }
        />

        <StyledTableCell style={{color: "var(--faded-text-color)"}}> {
          blockedTest.team && <label style={{border: "1px solid darkgray", borderRadius: "5px", padding: "5px"}}>{blockedTest.team}</label>
        }

        </StyledTableCell>

        <FullNameTableCell style={{paddingLeft: "40px"}}
                           blockedTest={blockedTest}
                           setBlockedTest={setBlockedTest}
                           showFullName={showFullName}
                           setShowFullName={setShowFullName}
                           handleTestcaseEditFinish={ handleTestcaseEditFinish }
                           textArea
        />

        <EditableTableCell align="left"
                           content={blockedTest.comment}
                           onChangeCallback={ handleCommentChange }
                           onBlurCallback={handleTestcaseEditFinish}
                           textArea

        />

        <TaskStatusCell blockedTest={blockedTest}
                        onChangeCallback={ handleJiraIssueChange }
                        onBlurCallback={ handleTestcaseEditFinish }/>


        <StyledTableCell align="center">{blockedTest.blockDate}</StyledTableCell>
    </StyledTableRow>
})

export default BlockedTestTableRow