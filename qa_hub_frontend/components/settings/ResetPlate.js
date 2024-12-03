import Button from "@mui/material/Button";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import DeleteIcon from "@mui/icons-material/Delete";
import {Paper} from "@mui/material";
import {clearData, hardReset, createDebugTestrun} from "../../requests/ResetRequests";
import projectState from "../../state/ProjectState";

export default function ResetPlate() {
    function handleHardResetClick() {
        if (confirm("All current data will be erased.\nThen the default data set would be restored.\n\nContinue?")) {
            hardReset().then(() => {
                createDebugTestrun()
                projectState.updateProjects()
            })
        }
    }

    function handleClearDataClick() {
        if (confirm("All current data will be erased.\n\nContinue?")) {
            clearData().then(() => {
                projectState.updateProjects()
            })
        }
    }

    return <Paper style={{padding: "15px"}}>
        <Button variant="contained"
                color="error"
                startIcon={<AutorenewIcon />}
                onClick={handleHardResetClick}
        >Hard reset</Button>

        <Button variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleClearDataClick}
        >Clear data</Button>
    </Paper>
}