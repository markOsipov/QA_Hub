import {Paper} from "@mui/material";
import TextWithLabel from "../../../primitives/TextWithLabel";
import StatusBadge from "../../../primitives/StatusBadge";
import TestResultsPlate from "../../testRunList/testRun/elements/TestResultsPlate";
import TimingsPlate from "../../testRunList/testRun/elements/TimingsPlate";
import TestRunConfig from "./TestRunConfig";
import RunnersDetailsPlate from "./RunnersDetailsPlate";


export default function TestRunResultsOverview({testRun, ...props}) {
  const opacity = '0.8'

  if (testRun == null) {
    return <Paper style={{padding: '15px', ...props.style}}>Loading testrun</Paper>
  }

  return <div style={{display: 'flex', flexGrow: '1.1'}}>
    <Paper style={{ padding: '15px', ...props.style, width: '100%' }}>
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
                  width: "min-content",
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
                            marginTop: '45px',
                            opacity: opacity
                          }}
            />
          </div>

          <div style={{display: 'grid', marginLeft: '50px', alignItems: 'center', alignSelf: 'center'}}>
            <div style={{display: 'flex', justifyContent: 'end'}}>
              <TestResultsPlate testRun={testRun} style={{minWidth: '300px', marginTop: '20px'}}/>
            </div>

            {
              testRun.config !== null &&
              <TestRunConfig testRun={testRun} style={{marginTop: '23px'}}/>
            }
          </div>
        </div>
        {
          testRun.runners.length > 0 &&
          <RunnersDetailsPlate testRun={testRun} style={{marginLeft: '50px', flexGrow: '1.1', justifyContent: 'end'}} />
        }
      </div>
    </Paper>
  </div>
}