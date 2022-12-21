import Typography from "@mui/material/Typography";
import {Paper} from "@mui/material";
import Button from "@mui/material/Button";
import DeleteIcon from '@mui/icons-material/Delete';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import {clearData, hardReset} from "../requests/QAHubBackend";

function Settings() {
    function handleHardResetClick() {
        if (confirm("All current data will be erased.\nThen the default data set would be restored.\n\nContinue?")) {
            hardReset()
        }
    }

    function handleClearDataClick() {
        if (confirm("All current data will be erased.\n\nContinue?")) {
            clearData()
        }
    }

    return <div style={{padding: "20px"}}>
        <Typography variant="h4" gutterBottom>Settings page [WIP]</Typography>

        <Paper style={{padding: "15px"}}>
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
    </div>
}

export default Settings