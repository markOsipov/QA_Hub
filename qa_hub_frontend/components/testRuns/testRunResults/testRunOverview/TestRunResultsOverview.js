import {Paper} from "@mui/material";
import TextWithLabel from "../../../primitives/TextWithLabel";
import StatusBadge from "../../../primitives/StatusBadge";
import TestResultsPlate from "../../testRunList/testRun/elements/TestResultsPlate";
import TimingsPlate from "../../testRunList/testRun/elements/timings/TimingsPlate";
import TestRunConfig from "./TestRunConfig";
import TestRunActionsOnPage from "./TestRunActionsOnPage";
import {observer} from "mobx-react-lite";


const TestRunResultsOverview = observer(({testRun, filterAndLoad, updateTestRunInfo, ...props}) => {
  const opacity = '0.8'

  if (testRun == null) {
    return <Paper style={{padding: '15px', ...props.style}}>Loading testrun</Paper>
  }

  return <div style={{display: 'flex', flexGrow: '1.1'}}>
    <Paper style={{ padding: '15px', width: '100%', position: 'relative', ...props.style }}>
      <div style={{ display: "flex", width: '100%'}}>
        <div style={{display: "flex", height: 'min-content'}}>
          <div style={{display: 'grid', minWidth: '311px'}}>
            <div
              style={{
                marginTop: "10px",
                display: "flex",
                alignItems: 'center',
                width: 'min-content'
              }}
            >
              <TextWithLabel
                value={testRun.testRunId}
                label={'testRunId'}
                labelStyle={{ justifySelf: 'center', cursor: 'pointer'}}
                valueStyle={{cursor: 'pointer'}}
                style={{
                  fontSize: "15px",
                  width: "max-content",
                  padding: "5px 6px",
                  minHeight: 'unset',
                  cursor: 'pointer'
                }}
              />
              <StatusBadge label={testRun.status} style={{ marginLeft: "10px"}}/>
            </div>

            <TimingsPlate testRun={testRun}
                          style={{
                            display: 'grid',
                            alignItems: 'end',
                            justifyItems: 'start',
                            position: 'relative',
                            marginTop: '28px',
                            opacity: opacity
                          }}
            />
          </div>


            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'end', alignItems: 'center', marginLeft: '50px'}}>
              <TestResultsPlate testRun={testRun} style={{minWidth: '300px', marginTop: '20px', position: 'relative', top: '-9px'}}/>

              {
                testRun.config !== null &&
                <TestRunConfig testRun={testRun} style={{marginLeft: '50px', position: 'relative', top: '8px'}}/>
              }
            </div>

          <div style={{position: 'absolute', right: '12px', bottom: '12px'}} >
            <TestRunActionsOnPage
              testRun={testRun}
              updateTestRunInfo={updateTestRunInfo}
            />
          </div>
        </div>
      </div>
    </Paper>
  </div>
})

export default TestRunResultsOverview