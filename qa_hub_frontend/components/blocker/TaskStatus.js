import {customTheme} from "../../styles/CustomTheme";

export default function TaskStatus({status, color, ...props}) {
  const defaultStatus = "unknown"

  return <div style={{ ...props.style}}>
    <div
      style={{
        padding: '2px 6px',
        backgroundColor: color === 'green' ? statusColors.green : color === 'yellow' ? statusColors.yellow : status === defaultStatus ? statusColors.unknown : statusColors.other,
        marginLeft: '10px',
        borderRadius: '5px',
        display: 'grid',
        alignContent: 'center',
        width: 'max-content'
      }}
    >
      <label
        style={{
          fontWeight: 'bold',
          color: 'white',
          fontSize: '11px',
          position: 'relative'
        }}
      >{(status || defaultStatus).toUpperCase()}</label>
    </div>
  </div>
}

const statusColors = {
  green: customTheme.palette.success.main,
  yellow:  customTheme.palette.warning.main,
  other: '#0a2a57',
  unknown: customTheme.palette.text.disabledMore
}