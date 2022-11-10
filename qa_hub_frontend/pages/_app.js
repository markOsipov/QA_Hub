import '../styles/globals.css'
import QaHubAppBar from "../components/common/QaHubAppBar";
import {customTheme} from "../styles/CustomTheme";
import {ThemeProvider} from "@mui/material";

function MyApp({ Component, pageProps }) {
  return <div style={{ height: '100vh', overflow: 'hidden'}}>
    <ThemeProvider theme={customTheme}>
      <QaHubAppBar></QaHubAppBar>

      <div style={{height: '91vh', minHeight: '91vh', overflowY: 'auto'}}>
        <Component {...pageProps} />
      </div>
    </ThemeProvider>
  </div>
}

export default MyApp
