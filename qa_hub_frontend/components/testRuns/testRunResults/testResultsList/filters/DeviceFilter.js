import {customTheme} from "../../../../../styles/CustomTheme";
import StyledTooltip from "../../../../primitives/StyledTooltip";
import {useState} from "react";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
export default function DeviceFilter({filter, setFilter, setFilterChanged, ...props}) {
  const errorFilterStyle = {
    color: customTheme.palette.text.white,
    border: `1px solid ${customTheme.palette.text.white}`,
    borderRadius: '5px',
    opacity: '0.95'
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

  return <StyledTooltip title={getTooltipText()} enterDelay={200}>
    <div
      style={{
        borderRadius: '5px',
        cursor: 'pointer',
        height: '25px',
        width: '25px',
        display: 'grid',
        alignContent: 'center',
        justifyContent: 'center',
        ...errorFilterStyle,
        ...props.style
      }}
      onClick={handleIconClick}
      onMouseOver={() => { setHovered(true)}}
      onMouseLeave={() => { setHovered(false)}}
    >
      {
        !hovered &&
        <PhoneIphoneIcon style={{height: '21px', width: '22px'}}/>}
      {
        hovered &&
        <DeleteForeverIcon
          style={{
            height: '21px',
            width: '21px',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'rgba(255, 255, 255, 1)'
          }}
        />
      }
    </div>
  </StyledTooltip>
}