import {getDateTime} from "../../../../../utils/DateTimeUtils";
import StyledTooltip from "../../../../primitives/StyledTooltip";
import {customTheme} from "../../../../../styles/CustomTheme";

const DurationChartElement = ({durationElement, hoveredTest, setHoveredTest, maxDuration, filter, index, ...props}) => {
  let isDisplayed = durationElement.fullName.toLowerCase().includes(filter.toLowerCase()) || String(durationElement.testcaseId.toLowerCase()).includes(filter.toLowerCase())
  const DurationElementTooltip = () => {
    return <div style={{display: 'grid' }}>
      <div style={{display: 'flex', alignItems: 'center'}}>
        <label style={{fontWeight: 'bold'}}>{durationElement.fullName}</label>
        <div style={{flexGrow: '1'}}></div>
        <label style={{marginLeft: '35px', color: 'rgba(255, 255, 255, 0.5)'}}>#{index}</label>
      </div>

      <div style={{display: 'grid', marginTop: '10px'}}>
        <div style={{display: 'flex'}}>
          <label>Runner:</label>
          <label style={{marginLeft: '10px', color: 'rgba(255, 255, 255, 0.5)'}}>{durationElement.runner}</label>
        </div>

        <div style={{display: 'flex'}}>
          <label style={{marginLeft: '3px'}}>Device:</label>
          <label style={{marginLeft: '10px', color: 'rgba(255, 255, 255, 0.5)'}}>{durationElement.deviceId}</label>
        </div>

        <div style={{display: 'flex', marginTop: '10px'}}>
          <label style={{marginLeft: '1px'}}>Started:</label>
          <label style={{marginLeft: '10px', color: 'rgba(255, 255, 255, 0.5)'}}>{getDateTime(durationElement.startDate)}</label>
        </div>

        <div style={{display: 'flex'}}>
          <label style={{marginLeft: '5px'}}>Ended:</label>
          <label style={{marginLeft: '10px', color: 'rgba(255, 255, 255, 0.5)'}}>{getDateTime(durationElement.endDate)}</label>
        </div>

        <label style={{marginTop: '10px'}}>Duration: {Number.parseInt(durationElement.duration)}s</label>
      </div>

      <label style={{marginTop: '10px'}}>Retry: {durationElement.retry}</label>
    </div>
  }

  if (!isDisplayed) {
    return <div style={{width: '10px', opacity: '0'}}></div>
  }

  return <StyledTooltip
    maxWidth={'800px'}
    title={<DurationElementTooltip />}
  >
    <div
      style={{
        width: '10px',
        height: (durationElement.duration / maxDuration * 100 ) + '%',
        backgroundColor: durationElement.status === 'SUCCESS' ? customTheme.palette.success.main : customTheme.palette.error.main,
        cursor: 'pointer',
        ...props.style
      }}
      onMouseOver={() => setHoveredTest(durationElement.fullName)}
      onMouseLeave={() => setHoveredTest(null)}
      onBlur={() => setHoveredTest(null)}
      onClick={() => {  window.open(window.location.href.split("/charts")[0] + `?test=${durationElement.testcaseId || durationElement.fullName}`, "_blank")}}
    >
      {
        hoveredTest === durationElement.fullName &&
        <div style={{ width: '100%', height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.5)' }}/>
      }
    </div>
  </StyledTooltip>
}

export default DurationChartElement