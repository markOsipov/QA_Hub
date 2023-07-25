import BugReportIcon from '@mui/icons-material/BugReport';
import {customTheme} from "../../../../../styles/CustomTheme";
import StyledTooltip from "../../../../primitives/StyledTooltip";
export default function UnreviewedFilter({filter, setFilter, ...props}) {
  const turnedOnUnrevieweStyle = {
    backgroundColor: customTheme.palette.error.main,
    color: customTheme.palette.text.white,
    borderRadius: '5px',
  }

  const turnedOnRevieweStyle = {
    backgroundColor: customTheme.palette.success.main,
    color: customTheme.palette.text.white,
    borderRadius: '5px',
  }

  const turnedOffStyle = {
    border: `1px solid ${customTheme.palette.text.white}`,
    opacity: '0.5'
  }

  const getStyle = () => {
    if (filter.unreviewed === true) {
      return turnedOnUnrevieweStyle
    } else if (filter.unreviewed === false) {
      return turnedOnRevieweStyle
    } else  return turnedOffStyle
  }

  const getTooltipText = () => {
      if (filter.unreviewed === true) {
        return "Only UNREVIEWED tests are shown"
      } else if (filter.unreviewed === false) {
        return "Only REVIEWED tests are shown"
      } else return "Shows only reviewe/unreviewed tests if turned on"
  }

  const handleIconClick = () => {
    if (filter.unreviewed === null) {
      setFilter({ ...filter, unreviewed: true })
    } else if (filter.unreviewed === true) {
      setFilter({ ...filter, unreviewed: false })
    } else setFilter({ ...filter, unreviewed: null })
  }

  return <StyledTooltip title={getTooltipText()} enterDelay={500}><BugReportIcon
    style={{
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

