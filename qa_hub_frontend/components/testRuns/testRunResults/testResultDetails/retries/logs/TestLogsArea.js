import LogRow from "./LogRow";

export default function TestLogsArea({ testLogs, selectedLogRow, ...props }) {
  if (!testLogs) {
    return <div style={{...props.style}}>{ "Can't find test logs for current retry" }</div>
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
      testLogs.log.split("\n").map((line, index) => {
        return <LogRow key={index} line={line} index={index} selectedLogRow={selectedLogRow} />
      })
    }
  </div>
}