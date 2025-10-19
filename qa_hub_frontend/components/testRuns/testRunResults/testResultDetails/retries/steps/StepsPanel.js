import {useEffect, useState} from "react";
import {getTestSteps} from "../../../../../../requests/testResults/TestStepsRequests";
import {Card} from "@mui/material";
import TestSteps from "./TestSteps";
import Loader from "../../../../../common/Loader";

export default function StepsPanel({ retry, setSelectedStep, ...props }) {
  const [steps, setSteps] = useState(null)
  const [stepsLoading, setStepsLoading] = useState(false)

  useEffect(() => {
    setStepsLoading(true)

    const testRunId = retry.testRunId
    const fullName = retry.fullName 
    const currentRetry = retry.retry

    function currentTestHasNotChanged() {
      return testRunId == retry.testRunId && fullName == retry.fullName &&  currentRetry == retry.retry
    }

    getTestSteps(retry.testRunId, retry.fullName, retry.retry).then((data) => {
      if (currentTestHasNotChanged) {
        setStepsLoading(false)
        setSteps(data.data)
      }
    })
  }, [retry])

  function StepsPanelContent({steps, stepsLoading}) {
    if (stepsLoading) {
      return <></>
    } else if (!steps) {
      return <div style={{...props.style,  padding: "5px 10px"}}>{ "Can't find test steps for current retry" }</div>
    }

    return <Card style={{height: 'min-content', marginTop: '15px', backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '15px', resize: 'horizontal', overflowX: 'auto'}}>
      { <TestSteps steps={steps.steps} setSelectedStep={setSelectedStep} margin={0} /> }
    </Card>
  }
  

  return <div style={{...props.style}}>
    <div style={{display: 'flex'}}>
      <label style={{padding:'5px 10px'}}>Test steps</label>
      <div style={{flexGrow: '1.1'}}></div>
      { 
        stepsLoading &&
        <div style={{display: 'flex', alignItems: 'center'}}>
        <Loader style={{marginRight: '5px', opacity: '0.4'}}/>
      </div>
      }
    </div>   
    <StepsPanelContent steps={steps} stepsLoading={stepsLoading} />
  </div>
}