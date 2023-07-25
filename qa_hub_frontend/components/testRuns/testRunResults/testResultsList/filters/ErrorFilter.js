import {customTheme} from "../../../../../styles/CustomTheme";
import StyledTooltip from "../../../../primitives/StyledTooltip";
import ReportIcon from '@mui/icons-material/Report';
import {useState} from "react";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
export default function ErrorFilter({filter, setFilter, setFilterChanged, ...props}) {
  const errorFilterStyle = {
    color: customTheme.palette.text.white,
    border: `1px solid ${customTheme.palette.text.white}`,
    borderRadius: '5px',
    opacity: '0.95'
  }

  const [hovered, setHovered] = useState(false)

  const getTooltipText = () => {
    return `Only tests which contain next error message are shown: '${filter.message}'`
  }

  const handleIconClick = () => {
    setFilter({ ...filter, message: null})
  }
  if (!filter.message) return null

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
      {!hovered && <ReportIcon style={{height: '23px', width: '23px',}}/>}
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