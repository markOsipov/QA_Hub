import {daysBetween, getDate} from "../../../utils/DateTimeUtils";
import {customTheme} from "../../../styles/CustomTheme";

export default function DateWithDayDiff({date, ...props}) {
  return <div style={{display: 'flex', justifyContent: 'center', ...props.style}}>
    <div style={{display: 'flex'}}>
      <label>{ getDate(date)}</label>
      <label style={{marginLeft: '10px', color: customTheme.palette.text.disabled}}>{ daysBetween(date) } days</label>
    </div>
  </div>
}