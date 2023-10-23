import {getDateTime, secondsBetween} from "../../../../utils/DateTimeUtils";
import StyledTooltip from "../../../primitives/StyledTooltip";
import {customTheme} from "../../../../styles/CustomTheme";

const TimelineElement = ({ startDate, endDate, duration, result, hoveredTest, setHoveredTest, ...props }) => {
  const resultDuration = Number.parseInt(result.duration)
  const secondsBeforeEnd = secondsBetween(startDate, result.endDate)
  const secondsFromStart = (secondsBeforeEnd - resultDuration)

  const relativeStart = (secondsBeforeEnd - resultDuration) / duration * 100
  const relativeWidth = resultDuration / duration * 100

  const TimelineElementTooltip = () => {
    return <div style={{display: 'grid'}}>
      <label style={{fontWeight: 'bold'}}>{result.fullName}</label>

      <div style={{display: 'grid', marginTop: '10px'}}>
        <div style={{display: 'flex'}}>
          <label>Started: {secondsFromStart}s</label>
          <label style={{marginLeft: '15px', color: 'rgba(255, 255, 255, 0.5)'}}>{getDateTime(result.startDate)}</label>

        </div>

        <div style={{display: 'flex'}}>
          <label style={{marginLeft: '5px'}}>Ended: {secondsBeforeEnd}s</label>
          <label style={{marginLeft: '15px', color: 'rgba(255, 255, 255, 0.5)'}}>{getDateTime(result.endDate)}</label>
        </div>

        <label style={{marginTop: '5px'}}>Duration: {resultDuration}s</label>
      </div>

      <label style={{marginTop: '10px'}}>Retry: {result.retry}</label>
    </div>
  }

  return <StyledTooltip
    maxWidth={'800px'}
    title={<TimelineElementTooltip />}
  >
    <div
      style={{
        position: 'absolute',
        left: relativeStart + '%',
        backgroundColor: result.status === 'SUCCESS' ? customTheme.palette.success.main : customTheme.palette.error.main,
        height: '100%',
        width: relativeWidth + '%',
        ...props.style
      }}
      onMouseOver={() => setHoveredTest(result.fullName)}
      onMouseLeave={() => setHoveredTest(null)}
      onBlur={() => setHoveredTest(null)}
    >
      {
        hoveredTest === result.fullName &&
        <div style={{ width: '100%', height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.5)' }}/>
      }
    </div>
  </StyledTooltip>
}

export default TimelineElement