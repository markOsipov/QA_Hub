import {StyledTableRow} from "../primitives/Table/StyledTableRow";
import {StyledTableCell} from "../primitives/Table/StyledTableCell";
import IconButton from "@mui/material/IconButton";
import {customTheme} from "../../styles/CustomTheme";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import {Switch} from "@mui/material";
import EditableTableCell from "../primitives/Table/EditableTableCell";
import FullNameTableCell from "./FullNameTableCell";
import {editBlockedTest, getBlockedTests, unblockTest} from "../../requests/QAHubBackend";
import projectState from "../../state/ProjectState";
import {useState, useEffect} from "react";

export default function BlockedTestTableRow({ index, blockedTestForRow, showFullName, setShowFullName, updateBlockedTestsList }) {
    const [blockedTest, setBlockedTest] = useState(blockedTestForRow)

    function handleUnblockButtonClick(blockedTest) {
        unblockTest(blockedTest).then( response => {
            if (response.data.deletedCount > 0) {
                updateBlockedTestsList()
            }
        })
    }

    function handleSwitchTrial(blockedTest, event) {
        const editedTest = {
            ...blockedTest,
            allowTrialRuns: event.target.checked
        }
        setBlockedTest(editedTest)
        editBlockedTest(editedTest).then(response => {
            if (response.data.modifiedCount > 0) {
                updateBlockedTestsList()
            }
        })
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
        editBlockedTest(blockedTest).then(response => {
            if (response.data.modifiedCount > 0) {
                updateBlockedTestsList()
            }
        })
    }

    return <StyledTableRow>
        <StyledTableCell align="left">
            <label style={{ padding: "5px 9px"}}>{index + 1}</label>
        </StyledTableCell>

        <StyledTableCell align="left">
            <IconButton className="hover-highlight"
                        style={{color: customTheme.palette.text.primary, borderRadius: "2px"}}
                        onClick={() => { handleUnblockButtonClick(blockedTest) }}
            >
                <LockOpenIcon/>
            </IconButton>
        </StyledTableCell>

        <StyledTableCell align="center">
            <Switch
                checked={blockedTest.allowTrialRuns}
                onChange={ (event) => { handleSwitchTrial(blockedTest, event) } }
            />
        </StyledTableCell>

        <EditableTableCell contentText={blockedTest.testcaseId}
                           onChangeCallback={ handleTestcaseIdChange }
                           onBlurCallback={(event) => { handleTestcaseEditFinish() }}
        />

        <EditableTableCell contentText={blockedTest.team}
                           onChangeCallback={ handleTeamChange }
                           onBlurCallback={handleTestcaseEditFinish}
        />

        <FullNameTableCell style={{paddingLeft: "40px"}}
                           blockedTest={blockedTest}
                           setBlockedTest={setBlockedTest}
                           showFullName={showFullName}
                           setShowFullName={setShowFullName}
                           handleTestcaseEditFinish={ handleTestcaseEditFinish }
        />

        <EditableTableCell align="left"
                           contentText={blockedTest.comment}
                           onChangeCallback={ handleCommentChange }
                           onBlurCallback={handleTestcaseEditFinish}

        />

        <EditableTableCell contentText={blockedTest.jiraIssue}
                           onChangeCallback={ handleJiraIssueChange }
                           onBlurCallback={handleTestcaseEditFinish}
        />

        <StyledTableCell align="center">{blockedTest.blockDate}</StyledTableCell>
    </StyledTableRow>
}