import {Paper} from "@mui/material";
import TestStatSuccessRate from "../cells/TestStatSuccessRate";
import Stack from "@mui/material/Stack";
import DateWithDayDiff from "../cells/DateWithDayDiff";
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import StyledTooltip from "../../primitives/StyledTooltip";
import TodayIcon from '@mui/icons-material/Today';
import TimerIcon from '@mui/icons-material/Timer';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import {customTheme} from "../../../styles/CustomTheme";
export default function TestHistoryStats({testHistory, innerRef, ...props}) {
  return <div style={{padding: "5px", ...props.style}} ref={innerRef}>
    <Stack  direction="row" spacing={2}>
      <StyledTooltip title={'Success rate'}>
        <div style={{display: 'flex' }}>
          <TestStatSuccessRate testStat={testHistory} width={'100px'}/>
        </div>
      </StyledTooltip>

      <StyledTooltip title={'Avg retries'}>
        <div style={{display: 'flex', alignItems: 'center', marginLeft: '25px'}}>
          <AutorenewIcon />
          <label style={{marginLeft: '3px'}}>{Number.parseInt(testHistory.avgRetries * 100) / 100}</label>
        </div>
      </StyledTooltip>

      <StyledTooltip title={'Avg duration'}>
        <div style={{display: 'flex', alignItems: 'center', marginLeft: '25px'}}>
          <TimerIcon />
          <label style={{marginLeft: '3px'}}>{testHistory.avgDuration}s</label>
        </div>
      </StyledTooltip>

      {/*<div style={{flexGrow: '2'}}></div>*/}

      <StyledTooltip title={'Last success'}>
        <div style={{display: 'flex', alignItems: 'center', marginLeft: '40px'}}>
          <EventAvailableIcon />
          {
            testHistory.lastSuccess &&
            <DateWithDayDiff style={{marginLeft: '7px'}} date={testHistory.lastSuccess}/>
          }
          {
            !testHistory.lastSuccess &&
            <div style={{marginLeft: '7px', color: customTheme.palette.text.disabled, minWidth: 'max-content'}}>-------------</div>
          }
        </div>
      </StyledTooltip>

      <StyledTooltip title={'Last run'}>
        <div style={{display: 'flex', alignItems: 'center', marginLeft: '15px'}}>
          <TodayIcon />
          {
            testHistory.lastRun &&
            <DateWithDayDiff style={{marginLeft: '7px'}} date={testHistory.lastRun}/>
          }
          {
            !testHistory.lastRun &&
            <div style={{marginLeft: '7px', color: customTheme.palette.text.disabled, minWidth: 'max-content'}}>-------------</div>
          }
        </div>
      </StyledTooltip>
    </Stack>
  </div>
}