import {useEffect, useState} from "react";
import {getTestSteps} from "../../../../../../requests/testResults/TestStepsRequests";
import {Card} from "@mui/material";
import TestSteps from "./TestSteps";
export default function StepsPanel({ retry, setSelectedStep, ...props }) {
  const [steps, setSteps] = useState(null)

  useEffect(() => {
    getTestSteps(retry.testRunId, retry.fullName, retry.retry).then((data) => {
      setSteps(data.data)
    })
  }, [retry])

  if (!steps) {
    return <div style={{...props.style}}>{ "Can't find test steps for current retry" }</div>
  }

  return <div style={{...props.style}}>
    <label>Test steps</label>
    <Card style={{height: 'min-content', marginTop: '15px', backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '15px', resize: 'horizontal', overflowX: 'auto'}}>
      { <TestSteps steps={steps.steps} setSelectedStep={setSelectedStep} margin={0} /> }
    </Card>
  </div>
}