import {customTheme} from "../../../../../styles/CustomTheme";
import StyledTooltip from "../../../../primitives/StyledTooltip";
import ReportIcon from '@mui/icons-material/Report';
export default function ErrorFilter({filter, setFilter, setFilterChanged, ...props}) {
  const errorFilterStyle = {
    color: customTheme.palette.text.white,
    border: `1px solid ${customTheme.palette.text.white}`,
    borderRadius: '5px',
    opacity: '0.9'
  }


  const getTooltipText = () => {
    return `Only tests which contain next error message are shown: '${filter.message}'`
  }

  const handleIconClick = () => {
    setFilter({ ...filter, message: null})
  }
  if (!filter.message) return null

  return <StyledTooltip title={getTooltipText()} enterDelay={200}>
    <ReportIcon
      style={{
        borderRadius: '5px',
        cursor: 'pointer',
        height: '25px',
        width: '25px',
        ...errorFilterStyle,
        ...props.style
      }}
      onClick={handleIconClick}
    />
  </StyledTooltip>
}