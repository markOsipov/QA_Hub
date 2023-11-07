import LogRow from "./LogRow";

export default function AppLogsArea({ appLogs, ...props }) {
  if (!appLogs) {
    return <div style={{...props.style}}>{ "Can't find app logs for current retry" }</div>
  }

  return <div
    style={{
      display: 'grid',
      padding: '15px 5px',
      borderRadius: '5px',
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
      overflowY: 'auto',
      width: '100%',
      ...props.style
    }}
  >
    {
      appLogs.log.split("\n").map((line, index) => {
        return <LogRow key={index} line={line} index={index} />
      })
    }
  </div>
}