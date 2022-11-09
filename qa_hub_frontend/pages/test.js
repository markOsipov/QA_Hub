import { ThemeProvider } from '@mui/material/styles';
import {customTheme} from "../styles/CustomTheme";
import QaHubAppBar from "../components/common/QaHubAppBar";


function Test() {
    return (
        <ThemeProvider theme={customTheme}>
            <QaHubAppBar></QaHubAppBar>
        </ThemeProvider>
    );
}

export default Test;