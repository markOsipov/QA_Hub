import {Paper} from "@mui/material";
import TestRetriesTabs from "./retries/TestRetriesTabs";
import TextWithLabel from "../../../primitives/TextWithLabel";
import Typography from "@mui/material/Typography";
import TestStatusWithRetries from "../../../common/TestStatusWithRetries";
import QaResolutionPanel from "./retries/QaResolutionPanel";

export default function TestResultDetails({ testResult, testResults, setTestResults, ...props }) {
  const renderContent = () => {
    if (testResult == null) {
      return <div>Not selected</div>
    } else {
      return <div style={{padding: '2px 2px'}}>
        <div style={{display: 'flex', marginLeft: '8px'}}>
          <TextWithLabel
            style={{
              fontSize: "12px",
              width: "max-content",
              padding: "5px 6px",
              minHeight: 'unset',
              minWidth: '70px',
              display: 'grid',
              justifyItems: 'center',
              height: 'min-content',
              position: 'relative',
              top: '15px',
              marginRight: '7px'
            }}
            label={'TestcaseId'}
            value={testResult.testcaseId}
            labelStyle={{ justifySelf: 'center'}}
          />
          <div style={{maxWidth: 'min-content', overflowX: 'hidden', position: 'relative', marginLeft: '15px', top: '-1px'}}>
            <Typography variant={'h6'} style={{marginLeft: '15px', width: 'max-content'}}>{getShortName(testResult)}</Typography>
            <Typography variant={'h6'} style={{marginLeft: '15px', width: 'max-content', fontSize: '14px', opacity: '0.5'}}>{testResult.fullName}</Typography>
          </div>
          <TestStatusWithRetries
            status={testResult.status}
            retries={testResult.retries}
            style={{
              position: 'relative',
              top: '12px',
              marginLeft: '25px'
          }}/>
        </div>

        {/*{*/}
        {/*  testResult.status !== 'SUCCESS' &&*/}
        {/*  <QaResolutionPanel testResult={testResult} style={{marginTop: '35px', marginBottom: '25px'}}/>*/}
        {/*}*/}


        <TestRetriesTabs
          testResult={testResult}
          testResults={testResults}
          setTestResults={setTestResults}
        />
      </div>
    }
  }

  function getShortName(testResult) {
    return testResult.fullName.substring(testResult.fullName.lastIndexOf(".") + 1)
  }

  return <Paper style={{padding: '15px 10px', ...props.style}}>
    {
      renderContent()
    }
  </Paper>
}