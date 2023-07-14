import {Paper} from "@mui/material";
import TextWithLabel from "../../../primitives/TextWithLabel";
import StatusBadge from "../../../primitives/StatusBadge";
import {getTime} from "../../../../utils/DateTimeUtils";
import TestRunTimings from "./TestRunTimings";
import ForkLeftIcon from '@mui/icons-material/ForkLeft';
import CommitIcon from '@mui/icons-material/Commit';
import PublicIcon from '@mui/icons-material/Public';
import ComputerIcon from '@mui/icons-material/Computer';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import SyncIcon from '@mui/icons-material/Sync';
export default function TestRunCard({testRun, ...props }) {
  return <Paper style={{ padding: '15px', ...props.style}}>
    <div style={{display: "flex", flexDirection: "column"}}>
      <div style={{marginTop: "10px", display: "flex", alignItems: 'center'}}>
        <TextWithLabel
          value={testRun.testRunId}
          label={'testRunId'}
          style={{fontSize: "17px", width: "min-content", padding: "5px 6px", minHeight: 'unset'}}
        />
        <StatusBadge label={testRun.status} style={{ marginLeft: "10px"}}/>
      </div>

      <div style={{display: 'flex',  marginTop: "30px"}}>
        <div style={{display: "flex", marginTop: "10px"}}>
          <div style={{display: "flex", alignItems: "center"}}>
            <ForkLeftIcon></ForkLeftIcon>
            <TextWithLabel
              value={testRun.branch}
              label={'Branch'}
              style={{minWidth: "70px", width: "min-content", padding: "5px 6px", minHeight: 'unset', }}
            />
          </div>

          <div style={{display: "flex", alignItems: "center", marginLeft: "12px"}}>
            <CommitIcon style={{transform: 'rotate(90deg)'}}></CommitIcon>
            <TextWithLabel
              value={testRun.commit}
              label={'Commit'}
              style={{minWidth: "70px", width: "min-content", padding: "5px 6px", minHeight: 'unset', }}
            />
          </div>

          <div style={{display: "flex", alignItems: "center", marginLeft: "12px"}}>
            <PublicIcon></PublicIcon>
            <TextWithLabel
              value={testRun.environment}
              label={'Environment'}
              style={{minWidth: "96px", width: "min-content", padding: "5px 6px", minHeight: 'unset', marginLeft: '4px', display: 'grid', justifyItems: 'center'}}
            />
          </div>
        </div>

        <div style={{display: "flex", marginTop: "10px", marginLeft: '70px'}}>
          { testRun.runners.length > 0 &&
            <div style={{display: "flex", alignItems: "center"}}>
              <ComputerIcon></ComputerIcon>
              <TextWithLabel
                value={testRun.runners.length}
                label={'Runners'}
                style={{minWidth: "70px", width: "min-content", padding: "5px 6px", minHeight: 'unset', marginLeft: '4px', display: 'grid', justifyItems: 'center'}}
              />
            </div>
          }

          { testRun.parallelThreads != null &&
            <div style={{display: "flex", alignItems: "center", marginLeft: "14px"}}>
              <PhoneIphoneIcon></PhoneIphoneIcon>
              <TextWithLabel
                value={testRun.parallelThreads}
                label={'Devices'}
                style={{minWidth: "70px", width: "min-content", padding: "5px 6px", minHeight: 'unset', marginLeft: '4px', display: 'grid', justifyItems: 'center'}}
              />
            </div>
          }

          { testRun.retries != null &&
            <div style={{display: "flex", alignItems: "center", marginLeft: "10px"}}>
              <SyncIcon style={{transform: 'scaleX(-1)'}}></SyncIcon>
              <TextWithLabel
                value={testRun.retries}
                label={'Retries'}
                style={{minWidth: "70px", width: "min-content", padding: "5px 6px", minHeight: 'unset', marginLeft: '4px', display: 'grid', justifyItems: 'center'}}
              />
            </div>
          }
        </div>
      </div>

      <TestRunTimings testRun={testRun} style={{marginTop: "50px"}} />
    </div>
  </Paper>
}