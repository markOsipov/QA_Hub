import BugReportIcon from '@mui/icons-material/BugReport';
import {customTheme} from "../../../../../styles/CustomTheme";
import StyledTooltip from "../../../../primitives/StyledTooltip";
import SyncIcon from "@mui/icons-material/Sync";
import {useState} from "react";
export default function RetriesFilter({filter, setFilter, setFilterChanged, ...props}) {
  const [hovered, setHovered] = useState(false)

  const retriesStyle = {
    backgroundColor: customTheme.palette.error.main,
    color: customTheme.palette.text.white,
  }

  const noRetriesStyle = {
    backgroundColor: customTheme.palette.success.main,
    color: customTheme.palette.text.white,
  }

  const turnedOffStyle = {
    border: `1px solid ${customTheme.palette.text.white}`,
    backgroundColor: hovered ? 'rgba(0, 0, 0, 0.9)' : '',
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

  return <StyledTooltip title={getTooltipText()} enterDelay={800}>
    <div
      onClick={handleIconClick}
      onMouseOver={() => { setHovered(true)}}
      onMouseLeave={() => { setHovered(false)}}

      style={{
        position: 'relative',
        height: '25px',
        width: '25px',
        display: 'grid',
        alignContent: 'center',
        justifyContent: 'center',
        borderRadius: '5px',
        cursor: 'pointer',
        ...getStyle(),
        ...props.style
      }}
    >
      <div style={{
        position: 'absolute',
        left: '-1',
        top: '-1',
        width: '25px',
        height: '25px',
        borderRadius: '5px',
        backgroundColor: hovered ? 'rgba(255, 255, 255, 0.08)' : ''}} />
      <SyncIcon
        style={{
          transform: 'scaleX(-1)',
          height: '25px',
          width: '25px',
          borderRadius: '5px',


          color: customTheme.palette.text.white
        }}
      />
    </div>
  </StyledTooltip>
}

