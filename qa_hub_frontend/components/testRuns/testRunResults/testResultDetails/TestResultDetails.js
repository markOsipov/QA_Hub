import {Paper} from "@mui/material";
import TestRetriesTabs from "./retries/TestRetriesTabs";
import TextWithLabel from "../../../primitives/TextWithLabel";
import Typography from "@mui/material/Typography";
import TestStatusWithRetries from "../../../common/TestStatusWithRetries";
import {observer} from "mobx-react-lite";
import testResultsFilterState from "../../../../state/testResults/TestResultsFilterState";
import testResultsState from "../../../../state/testResults/TestResultsState";

const TestResultDetails = observer(({ ...props }) => {
  const {  selectedTest } = testResultsState
  const renderContent = () => {
    if (selectedTest == null) {
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
            value={selectedTest.testcaseId}
            labelStyle={{ justifySelf: 'center'}}
          />
          <div style={{maxWidth: 'min-content', overflowX: 'hidden', position: 'relative', marginLeft: '15px', top: '-1px'}}>
            <Typography variant={'h6'} style={{marginLeft: '15px', width: 'max-content'}}>{getShortName(selectedTest)}</Typography>
            <Typography variant={'h6'} style={{marginLeft: '15px', width: 'max-content', fontSize: '14px', opacity: '0.5'}}>{selectedTest.fullName}</Typography>
          </div>
          <TestStatusWithRetries
            status={selectedTest.status}
            retries={selectedTest.retries}
            style={{
              position: 'relative',
              top: '12px',
              marginLeft: '25px'
          }}/>
        </div>

        <TestRetriesTabs style={{marginTop: '30px'}}/>
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
})
export default TestResultDetails