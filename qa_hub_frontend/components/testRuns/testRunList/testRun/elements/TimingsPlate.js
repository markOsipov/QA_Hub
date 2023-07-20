import TextWithLabel from "../../../../primitives/TextWithLabel";
import {getDate, getTime, getTimeMinutes} from "../../../../../utils/DateTimeUtils";
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
export default function TimingsPlate ({testRun, ...props}) {
  const DurationElement = function ({ ...props }) {
    return <div style={{display: 'flex', alignItems: "center", ...props.style}}>
      <AccessTimeFilledIcon></AccessTimeFilledIcon>
      <label style={{marginLeft: '3px'}}>{testRun.timeMetrics.duration + ' min'}</label>
    </div>
  }

  const StartedElement = function () {
    return <TextWithLabel
      value={getTimeMinutes(testRun.timeMetrics.started)}
      label={'Started'}
      labelStyle={{ justifySelf: 'center'}}
      style={{...dateBadgeStyle, marginLeft: '10px'}}
    />
  }

  const EndedElement = function ({ ...props }) {
    return <TextWithLabel
      value={ getTimeMinutes(testRun.timeMetrics.ended) }
      label={'Ended'}
      labelStyle={{ justifySelf: 'center'}}
      style={{...dateBadgeStyle, marginLeft: '10px', ...props.style}}
    />
  }

  const DateElement = function ({dateValue, ...props}) {
    return  <TextWithLabel
      value={getDate(dateValue)}
      label={'Date'}
      labelStyle={{ justifySelf: 'center'}}
      style={{...dateBadgeStyle, ...props.style}}
    />
  }

  const CreatedElement = function () {
    return <TextWithLabel
      value={getTimeMinutes(testRun.timeMetrics.created)}
      label={'Created'}
      labelStyle={{ justifySelf: 'center'}}
      style={{...dateBadgeStyle, marginLeft: '10px'}}
    />
  }

  function renderComponent() {
    if (testRun.timeMetrics.started != null) {
      return <div style={{display: "flex", alignItems: 'center'}}>
        <DateElement dateValue={testRun.timeMetrics.started}/>
        <StartedElement style={{marginLeft: '15px'}}/>
        {
          testRun.timeMetrics.ended && <EndedElement />
        }
        {
          testRun.timeMetrics.duration && <DurationElement style={{ marginLeft: '15px' }}/>
        }
      </div>
    } else {
      return <div style={{display: "flex", alignItems: 'center'}}>
        <DateElement dateValue={testRun.timeMetrics.created}/>
        <CreatedElement  style={{marginLeft: '15px'}} />
      </div>
    }
  }


    return <div style={{...props.style}}>
      {renderComponent()}
    </div>
}

const dateBadgeStyle = {
  fontSize: "12px",
  width: "max-content",
  padding: "5px 6px",
  minHeight: 'unset',
  minWidth: '70px',
  display: 'grid',
  justifyItems: 'center'
}