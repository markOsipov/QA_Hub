import TextWithLabel from "../../../../../primitives/TextWithLabel";
import {getDate, getTime, getTimeMinutes} from "../../../../../../utils/DateTimeUtils";
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import StartedElement from "./DateView";
import DateView from "./DateView";
import DurationElement from "./DurationElement";
export default function TimingsPlate ({testRun, ...props}) {
  function renderComponent() {
    if (testRun.timeMetrics.started != null) {
      return <div style={{display: "flex", alignItems: 'center'}}>
        <DateView
          style={{marginLeft: '15px'}}
          value={getDate(testRun.timeMetrics.started)}
          label={"Date"}
        />
        <DateView
          style={{marginLeft: '15px'}}
          value={getTimeMinutes(testRun.timeMetrics.started)}
          label={"Started"}
        />

        { testRun.timeMetrics.ended &&
          <DateView
            style={{marginLeft: '15px'}}
            value={getTimeMinutes(testRun.timeMetrics.ended)}
            label={"Ended"}
          />
        }
        { testRun.timeMetrics.duration !== null &&
          <DurationElement
            style={{ marginLeft: '15px', minWidth: 'max-content' }}
            duration={ testRun.timeMetrics.duration || 0}
          />
        }
      </div>
    } else {
      return <div style={{display: "flex", alignItems: 'center'}}>
        <DateView
          style={{marginLeft: '15px'}}
          value={getDate(testRun.timeMetrics.created)}
          label={"Date"}
        />
        <DateView
          style={{marginLeft: '15px'}}
          value={getTimeMinutes(testRun.timeMetrics.created)}
          label={"Created"}
        />
      </div>
    }
  }


    return <div style={{...props.style}}>
      {renderComponent()}
    </div>
}

