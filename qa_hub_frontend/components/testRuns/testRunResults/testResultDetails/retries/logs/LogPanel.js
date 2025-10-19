import {useEffect, useState} from "react";
import TestLogsArea from "./TestLogsArea";
import {customTheme} from "../../../../../../styles/CustomTheme";
import { getAttachment } from "../../../../../../requests/testResults/TestAttachmentsRequests";
import { Typography } from "@mui/material";

export default function LogsPanel({ retry, selectedStep, setSelectedStep, attachment, ...props }) {
  const [testLogs, setTestLogs] = useState(null)
  const [selectedLogRow, setSelectedLogRow] = useState(null)
  const [testLogsLoading, setTestLogsLoading] = useState(false)

  useEffect(() => {
    if (testLogs && selectedStep) {
      const stepLines = []
      testLogs.split("\n").forEach((line, index) => {
        if (line.includes(`Starting step ${selectedStep.id}:`)) {
          stepLines.push(index)
        }
      })

      const nextLine = stepLines.find((el) => el > selectedLogRow)

      if (nextLine) {
        setSelectedLogRow(nextLine)
      } else if (stepLines.length > 0) {
        setSelectedLogRow(stepLines[0])
      }
    }
  }, [selectedStep])



  useEffect(() => {
    setTestLogsLoading(true)

    const testRunId = retry.testRunId
    const fullName = retry.fullName 
    const currentRetry = retry.retry

    function currentTestHasNotChanged() {
      return testRunId == retry.testRunId && fullName == retry.fullName &&  currentRetry == retry.retry
    }

    getAttachment(attachment.path).then((data) => {
      if (currentTestHasNotChanged()) {
        if (data.data instanceof Object) {
          const json = JSON.stringify(data.data, null, 2)
          setTestLogs(json)
        } else {
           setTestLogs(String(data.data))
        }
       
        setSelectedStep(null)
        setTestLogsLoading(false)
      }      
    })
  }, [retry.testRunId, retry.fullName, retry.retry, attachment])

  return <div style={{...props.style}}>
    <div style={{display: 'flex'}}>

      { 
        testLogsLoading &&
         <div
                style={{
                    width: "100%",
                    height: "400px",
                    display: 'grid',
                    placeItems: 'center',              
                    backgroundColor: customTheme.palette.background.paper
                }}
            >
            <Typography variant="h5">Loading...</Typography>
          </div>
      }
    </div>
    {
      <TestLogsArea testLogs={testLogs} testLogsLoading={testLogsLoading} selectedLogRow={selectedLogRow} style={{marginTop: '10px', maxHeight: 'calc(100vh - 140px)',}} />
    }
  </div>
}