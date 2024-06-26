import BugReportIcon from '@mui/icons-material/BugReport';
import {customTheme} from "../../../../../styles/CustomTheme";
import StyledTooltip from "../../../../primitives/StyledTooltip";
import {useState} from "react";
import {observer} from "mobx-react-lite";
import testResultsFilterState from "../../../../../state/testResults/TestResultsFilterState";
const UnreviewedFilter = observer(({...props}) => {
  const {filter } = testResultsFilterState
  const [hovered, setHovered] = useState(false)

  const turnedOnUnreviewedStyle = {
    backgroundColor: customTheme.palette.error.main,
    color: customTheme.palette.text.white,
  }

  const turnedOnReviewedStyle = {
    backgroundColor: customTheme.palette.success.main,
    color: customTheme.palette.text.white,
  }

  const turnedOffStyle = {
    border: `1px solid ${customTheme.palette.text.white}`,
    opacity: '0.5',
    backgroundColor: hovered ? 'rgba(0, 0, 0, 0.9)' : '',
  }

  const getStyle = () => {
    if (filter.unreviewed === true) {
      return turnedOnUnreviewedStyle
    } else if (filter.unreviewed === false) {
      return turnedOnReviewedStyle
    } else return turnedOffStyle
  }

  const getTooltipText = () => {
      if (filter.unreviewed === true) {
        return "Only UNREVIEWED tests are shown"
      } else if (filter.unreviewed === false) {
        return "Only REVIEWED tests are shown"
      } else return "Shows only reviewed/unreviewed tests if turned on"
  }

  const handleIconClick = () => {
    if (filter.unreviewed === true) {
      testResultsFilterState.setFilter({ ...filter, unreviewed: false })
    } else if (filter.unreviewed === false) {
      testResultsFilterState.setFilter({ ...filter, unreviewed: null })
    } else testResultsFilterState.setFilter({ ...filter, unreviewed: true })
    testResultsFilterState.setFilterChanged(true)
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
      <BugReportIcon
        style={{
          height: '25px',
          width: '25px',
          borderRadius: '5px',
          cursor: 'pointer',

          color: customTheme.palette.text.white
        }}
      />
    </div>
  </StyledTooltip>
})

export default UnreviewedFilter