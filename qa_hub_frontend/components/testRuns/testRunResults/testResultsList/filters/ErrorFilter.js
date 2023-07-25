import {customTheme} from "../../../../../styles/CustomTheme";
import StyledTooltip from "../../../../primitives/StyledTooltip";
import ReportIcon from '@mui/icons-material/Report';
import {useState} from "react";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
export default function ErrorFilter({filter, setFilter, setFilterChanged, ...props}) {
  const filterStyle = {
    color: customTheme.palette.text.white,
    border: `1px solid ${customTheme.palette.text.white}`,
    borderRadius: '5px',
  }

  const [hovered, setHovered] = useState(false)

  const getTooltipText = () => {
    return `Only tests which contain next error message are shown: '${filter.message}'`
  }

  const handleIconClick = () => {
    setFilter({ ...filter, message: null})
    setFilterChanged(true)
  }
  if (!filter.message) return null

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
      <ReportIcon style={{height: '23px', width: '23px',}}/>
    </div>
  </StyledTooltip>
}