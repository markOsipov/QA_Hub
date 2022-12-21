import {Card} from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {useRouter} from "next/router";

function GoToSettingsStub() {
    let router = useRouter()

    function navigateToSettings() {
        router.push("/settings")
    }

    return                     <Card style={{padding: "20px", display: "flex"}}>
        <Typography variant="h5" style={{ marginRight: "20px"}}>Projects are empty. Please go to settings page and configure projects.</Typography>
        <Button style={{position: "relative", top: "-3px"}} variant="contained"  onClick={navigateToSettings}>Go to settings</Button>
    </Card>
}

export default GoToSettingsStub