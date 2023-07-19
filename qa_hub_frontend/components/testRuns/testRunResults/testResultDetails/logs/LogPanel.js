import {useEffect, useRef, useState} from "react";
import {getTestLogs} from "../../../../../requests/testResults/TestLogsRequests";
import LogRow from "./LogRow";

export default function LogsPanel({ retry, selectedStep, setSelectedStep, ...props }) {
  const [logs, setLogs] = useState(null)
  const [selectedLogRow, setSelectedLogRow] = useState(null)

  useEffect(() => {
    if (logs) {
      const stepLine = logs.log.split("\n").findIndex((line) => {
        return line.includes(`Starting step ${selectedStep}`)
      })
      setSelectedLogRow(stepLine)
    }
  }, [selectedStep])

  useEffect(() => {
    if (selectedLogRow >= 0) {

    }
  }, [selectedLogRow])

  useEffect(() => {
    getTestLogs(retry.testRunId, retry.fullName, retry.retry).then((data) => {
      setLogs(data.data)
      setSelectedStep(null)
    })
  }, [retry.testRunId, retry.fullName, retry.retry])

  if (!logs) {
    return <div style={{...props.style}}>{ "Can't find test logs for current retry" }</div>
  }

  return <div style={{...props.style}}>
    <label>Test logs</label>
    <div style={{display: 'grid', marginTop: '10px', padding: '15px 5px', borderRadius: '5px', backgroundColor: 'rgba(0, 0, 0, 0.65)'}}>
      {
        logs.log.split("\n").map((line, index) => {
          return <LogRow key={index} line={line} index={index} selectedLogRow={selectedLogRow} />
        })
      }
    </div>
  </div>
}