import StatusBadge from "../../../../primitives/StatusBadge";
import TextWithLabel from "../../../../primitives/TextWithLabel";
import {getTimeSeconds} from "../../../../../utils/DateTimeUtils";
import ComputerIcon from "@mui/icons-material/Computer";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import {useState} from "react";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import RotatingArrowRight from "../../../../primitives/RotatingArrowRight";

export default function StatusHistory({ retry, ...props}) {
  const [showStatusHistory, setShowStatusHistory] = useState(false)

  let lastResult = retry.statusHistory[retry.statusHistory.length - 1]

  return <div style={{ ...props.style }}>
    <div style={{display: 'flex', alignItems: 'center'}}>
      <StatusBadge label={lastResult.status} />
      <RotatingArrowRight value={showStatusHistory} setValue={setShowStatusHistory} />
    </div>
    {
      showStatusHistory &&
      <div style={{display: 'grid', marginLeft: '30px', opacity: '0.65', marginBottom: '30px' }}>
        {
          retry?.statusHistory.map((item, index) => {
            return <div key={index} style={{marginTop: '15px', display: 'flex', alignItems: 'center' }}>
              <div style={{display: 'flex', marginLeft: '10px', minWidth: '120px'}}>
                <StatusBadge label={item.status} key={index} />
              </div>

              <div style={{display: 'flex', marginLeft: '10px', alignItems: 'center'}}>
                <ComputerIcon />
                <TextWithLabel value={item.runner || 'unknown'} style={{marginLeft: '5px', width: 'max-content'}}></TextWithLabel>
              </div>

              <div style={{display: 'flex', marginLeft: '17px', alignItems: 'center'}}>
                <PhoneIphoneIcon />
                <TextWithLabel value={item.deviceId || 'unknown'} style={{marginLeft: '5px', width: 'max-content'}}></TextWithLabel>
              </div>

              <TextWithLabel
                label={'Time'} value={getTimeSeconds(item.date)}
                labelStyle={{ justifySelf: 'center'}}
                style={{padding: '3px', alignItems: 'center', minHeight: 'unset', marginLeft: '20px', width: 'max-content'}}
              />
            </div>
          })
        }
      </div>
    }
  </div>
}