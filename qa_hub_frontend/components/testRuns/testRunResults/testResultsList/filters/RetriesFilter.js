import BugReportIcon from '@mui/icons-material/BugReport';
import {customTheme} from "../../../../../styles/CustomTheme";
import StyledTooltip from "../../../../primitives/StyledTooltip";
import SyncIcon from "@mui/icons-material/Sync";
export default function RetriesFilter({filter, setFilter, setFilterChanged, ...props}) {
  const retriesStyle = {
    backgroundColor: customTheme.palette.error.main,
    color: customTheme.palette.text.white,
    borderRadius: '5px',
  }

  const noRetriesStyle = {
    backgroundColor: customTheme.palette.success.main,
    color: customTheme.palette.text.white,
    borderRadius: '5px',
  }

  const turnedOffStyle = {
    border: `1px solid ${customTheme.palette.text.white}`,
    opacity: '0.5'
  }

  const getStyle = () => {
    if (filter.retries === true) {
      return retriesStyle
    } else if (filter.retries === false) {
      return noRetriesStyle
    } else return turnedOffStyle
  }

  const getTooltipText = () => {
    if (filter.retries === true) {
      return "Only tests WITH RETRIES are shown"
    } else if (filter.retries === false) {
      return "Only tests WITHOUT RETRIES are shown"
    } else return "Shows only tests with or without retries if turned on"
  }

  const handleIconClick = () => {
    if (filter.retries === true) {
      setFilter({ ...filter, retries: false })
    } else if (filter.retries === false) {
      setFilter({ ...filter, retries: null })
    } else setFilter({ ...filter, retries: true })
    setFilterChanged(true)
  }

  return <StyledTooltip title={getTooltipText()} enterDelay={300}>
    <SyncIcon
      style={{
        transform: 'scaleX(-1)',
        borderRadius: '5px',
        cursor: 'pointer',
        height: '25px',
        width: '25px',
        ...getStyle(),
        ...props.style
      }}
      onClick={handleIconClick}
  /></StyledTooltip>
}

