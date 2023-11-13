import {useEffect, useRef, useState} from "react";
import {getAppLogs, getTestLogs} from "../../../../../../requests/testResults/TestLogsRequests";
import LogRow from "./LogRow";
import TestLogsArea from "./TestLogsArea";
import AppLogsArea from "./AppLogsArea";
import {customTheme} from "../../../../../../styles/CustomTheme";

export default function LogsPanel({ retry, selectedStep, setSelectedStep, ...props }) {
  const [testLogs, setTestLogs] = useState(null)
  const [appLogs, setAppLogs] = useState(null)
  const [selectedLogRow, setSelectedLogRow] = useState(null)

  const currentLogsOptions = {
    testLogs: "TestLogs",
    appLogs: "AppLogs"
  }
  const [currentLogs, setCurrentLogs] = useState(currentLogsOptions.testLogs)
  const [testLogsHovered, setTestLogsHovered] = useState(false)
  const [appLogsHovered, setAppLogsHovered] = useState(false)

  useEffect(() => {
    if (testLogs) {
      const stepLine = testLogs.log.split("\n").findIndex((line) => {
        return line.includes(`Starting step ${selectedStep}`)
      })
      setSelectedLogRow(stepLine)
    }
  }, [selectedStep])



  useEffect(() => {
    getTestLogs(retry.testRunId, retry.fullName, retry.retry).then((data) => {
      setTestLogs(data.data)
      setSelectedStep(null)
    })
    getAppLogs(retry.testRunId, retry.fullName, retry.retry).then((data) => {
      setAppLogs(data.data)
    })
  }, [retry.testRunId, retry.fullName, retry.retry])

  if (!testLogs) {
    return <div style={{...props.style}}>{ "Can't find test logs for current retry" }</div>
  }

  return <div style={{...props.style}}>
    <div style={{display: 'flex'}}>
      <label
        style={{
          cursor: 'pointer',
          padding: '5px 10px',
          color: currentLogs === currentLogsOptions.testLogs ? 'white' : customTheme.palette.text.disabled,
          backgroundColor: testLogsHovered ? 'rgba(255, 255, 255, 0.07)' : 'unset'
        }}
        onClick={() => { setCurrentLogs(currentLogsOptions.testLogs) }}
        onMouseOver={() => { setTestLogsHovered(true) }}
        onMouseLeave={() => { setTestLogsHovered(false) }}
      >Test logs</label>
      <label
        style={{
          marginLeft: '5px',
          cursor: 'pointer',
          padding: '5px 10px',
          color: currentLogs === currentLogsOptions.appLogs ? 'white' : customTheme.palette.text.disabled,
          backgroundColor: appLogsHovered ? 'rgba(255, 255, 255, 0.07)' : 'unset'
        }}
        onClick={() => {
          setCurrentLogs(currentLogsOptions.appLogs)
          setSelectedStep(null)
        }}
        onMouseOver={() => { setAppLogsHovered(true) }}
        onMouseLeave={() => { setAppLogsHovered(false) }}
      >App logs</label>
    </div>
    {
      currentLogs === currentLogsOptions.testLogs &&
      <TestLogsArea testLogs={testLogs} selectedLogRow={selectedLogRow} style={{marginTop: '10px', maxHeight: '85vh',}} />
    }
    {
      currentLogs === currentLogsOptions.appLogs &&
      <AppLogsArea appLogs={appLogs} style={{marginTop: '10px', maxHeight: '85vh',}} />
    }

  </div>
}