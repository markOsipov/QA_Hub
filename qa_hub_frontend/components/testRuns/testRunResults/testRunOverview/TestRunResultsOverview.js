import {Paper} from "@mui/material";
import TextWithLabel from "../../../primitives/TextWithLabel";
import StatusBadge from "../../../primitives/StatusBadge";
import TestResultsPlate from "../../testRunList/testRun/elements/TestResultsPlate";
import TimingsPlate from "../../testRunList/testRun/elements/TimingsPlate";
import ComputerIcon from "@mui/icons-material/Computer";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import SyncIcon from "@mui/icons-material/Sync";
import ForkLeftIcon from "@mui/icons-material/ForkLeft";
import CommitIcon from "@mui/icons-material/Commit";
import PublicIcon from "@mui/icons-material/Public";
import Tooltip from "@mui/material/Tooltip";
import StyledTooltip from "../../../primitives/StyledTooltip";


export default function TestRunResultsOverview({testRun, ...props}) {
  const opacity = '0.8'
  if (testRun == null) {
    return <Paper style={{padding: '15px', ...props.style}}>Loading testrun</Paper>
  }
  return <div style={{display: 'flex', flexGrow: '1.1'}}>
    <Paper style={{ padding: '15px', ...props.style, width: '100%' }}

    >
      <div style={{ display: "flex", width: '100%'}}>
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

        <div style={{display: 'grid', marginLeft: '60px', alignItems: 'center', alignSelf: 'center'}}>
          <div style={{display: 'flex', justifyContent: 'end'}}>
            <TestResultsPlate testRun={testRun} style={{minWidth: '300px', opacity: opacity, marginTop: '10px'}}/>
          </div>

          {
            testRun.config !== null &&
            <div style={{display: 'flex', justifyContent: 'end', marginTop: '20px'}}>
              <StyledTooltip title={'Branch'} placement="bottom-end" arrow>
                <div style={{display: 'flex', alignItems: 'center'}}>
                  <ForkLeftIcon/>
                  <TextWithLabel value={testRun.config.branch} style={{...configItemStyle, marginLeft: '0'}} />
                </div>
              </StyledTooltip>

              <StyledTooltip title={'Commit'} placement="bottom-end" arrow>
                <div style={{display: 'flex', alignItems: 'center', marginLeft: '3px'}}>
                  <CommitIcon style={{transform: 'rotate(90deg)'}}></CommitIcon>
                  <TextWithLabel value={testRun.config.commit} style={{...configItemStyle, marginLeft: '0'}} />
                </div>
              </StyledTooltip>

              <StyledTooltip title={'Environment'} placement="bottom-end" arrow>
                <div style={{display: 'flex', alignItems: 'center', marginLeft: '7px'}}>
                  <PublicIcon/>
                  <TextWithLabel value={testRun.config.environment} style={{...configItemStyle}} />
                </div>
              </StyledTooltip>

              <StyledTooltip title={'Active runners'} placement="bottom-end" arrow>
                <div style={{display: 'flex', alignItems: 'center', marginLeft: '20px'}}>
                  <ComputerIcon />
                  <TextWithLabel value={testRun.runners.length} style={{...configItemStyle}} />
                </div>
              </StyledTooltip>

              <StyledTooltip title={'Parallel devices'} placement="bottom-end" arrow>
                <div style={{display: 'flex', alignItems: 'center', marginLeft: '8px'}}>
                  <PhoneIphoneIcon />
                  <TextWithLabel value={testRun.config.parallelThreads} style={{...configItemStyle}} />
                </div>
              </StyledTooltip>

              <StyledTooltip title={'Retries'} placement="bottom-end" arrow>
                <div style={{display: 'flex', alignItems: 'center', marginLeft: '5px'}}>
                  <SyncIcon style={{transform: 'scaleX(-1)'}} />
                  <TextWithLabel value={testRun.config.retries} style={{...configItemStyle}} />
                </div>
              </StyledTooltip>
            </div>
          }
        </div>
      </div>
    </Paper>
  </div>
}

const configItemStyle = {
  padding: '0px 10px',
  maxHeight: '15px',
  marginLeft: '5px',
  width: '100%',
  opacity: '0.8'
}