import TextWithLabel from "../../../../primitives/TextWithLabel";
import {getDate, getTime, getTimeMinutes} from "../../../../../utils/DateTimeUtils";
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
export default function TimingsPlate ({testRun, ...props}) {
  function renderComponent() {
    if (testRun.timeMetrics.started != null) {
      return <div style={{display: "flex", alignItems: 'center'}}>
        <TextWithLabel
          value={getDate(testRun.timeMetrics.started)}
          label={'Date'}
          style={dateBageStyle}
        />

        <TextWithLabel
          value={getTimeMinutes(testRun.timeMetrics.started)}
          label={'Started'}
          style={{...dateBageStyle, marginLeft: '10px'}}
        />
        {
          testRun.timeMetrics.ended &&
          <TextWithLabel
            value={ getTimeMinutes(testRun.timeMetrics.ended) }
            label={'Ended'}
            style={{...dateBageStyle, marginLeft: '10px'}}
          />
        }
        {
          testRun.timeMetrics.duration &&
          <div style={{display: 'flex', alignItems: "center", marginLeft: '15px'}}>
            <AccessTimeFilledIcon></AccessTimeFilledIcon>
            <label style={{marginLeft: '3px'}}>{testRun.timeMetrics.duration + ' min'}</label>
          </div>
        }
      </div>
    } else {
      return <div style={{display: "flex", alignItems: 'center'}}>
        <TextWithLabel
          value={getDate(testRun.timeMetrics.created)}
          label={'Date'}
          style={dateBageStyle}
        />
        <TextWithLabel
          value={getTimeMinutes(testRun.timeMetrics.created)}
          label={'Created'}
          style={{...dateBageStyle, marginLeft: '10px'}}
        />
      </div>
    }
  }


    return <div style={{...props.style}}>
      {renderComponent()}
    </div>
}

const dateBageStyle = {
  fontSize: "12px",
  width: "max-content",
  padding: "5px 6px",
  minHeight: 'unset',
  minWidth: '70px',
  display: 'grid',
  justifyItems: 'center'
}