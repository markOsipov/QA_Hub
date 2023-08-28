import RefreshIcon from "@mui/icons-material/Refresh";
import {customTheme} from "../../styles/CustomTheme";

const Loader = ({...props}) => {

  return <RefreshIcon style={{
    animation: "rotation 1.2s linear infinite",
    fontSize: '25px',
    color: customTheme.palette.text.faded,
    ...props.style

  }}></RefreshIcon>
}
export default Loader