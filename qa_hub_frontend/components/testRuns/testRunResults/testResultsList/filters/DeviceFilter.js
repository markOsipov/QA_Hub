import {customTheme} from "../../../../../styles/CustomTheme";
import StyledTooltip from "../../../../primitives/StyledTooltip";
import {useState} from "react";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
export default function DeviceFilter({filter, setFilter, setFilterChanged, ...props}) {
  const filterStyle = {
    color: customTheme.palette.text.white,
    border: `1px solid ${customTheme.palette.text.white}`,
    borderRadius: '5px',
  }

  const [hovered, setHovered] = useState(false)

  const getTooltipText = () => {
    return `Only tests executed on next device are shown: '${filter.deviceId}'`
  }

  const handleIconClick = () => {
    setFilter({ ...filter, deviceId: null})
    setFilterChanged(true)
  }
  if (!filter.deviceId) return null

  return <StyledTooltip title={getTooltipText()} enterDelay={800}>
    <div
      style={{
        borderRadius: '5px',
        cursor: 'pointer',
        height: '25px',
        width: '25px',
        display: 'grid',
        alignContent: 'center',
        justifyContent: 'center',
        backgroundColor: hovered ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.7)',
        opacity: hovered ? '1' : '0.85',
        ...filterStyle,
        ...props.style
      }}
      onClick={handleIconClick}
      onMouseOver={() => { setHovered(true)}}
      onMouseLeave={() => { setHovered(false)}}
    >
      <PhoneIphoneIcon style={{height: '21px', width: '22px'}}/>
    </div>
  </StyledTooltip>
}