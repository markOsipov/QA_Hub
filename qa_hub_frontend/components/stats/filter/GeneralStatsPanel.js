import FunctionsIcon from '@mui/icons-material/Functions';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import TimerIcon from '@mui/icons-material/Timer';
import BarChartIcon from '@mui/icons-material/BarChart';
import {Tooltip, tooltipClasses} from "@mui/material";
import Typography from "@mui/material/Typography";
import StyledTooltip from "../../primitives/StyledTooltip";

export default function GeneralStatsPanel({generalStats, ...props}) {
 if (!generalStats) {
    return null
 }

 return <div style={{display: 'flex'}}>
    <StyledTooltip
      title={
        <div>
            <div>Unique tests count: {generalStats.totalTests}</div>
        </div>
      }
      maxWidth={'none'} style={{display: 'block'}}>
        <div style={{display: 'flex', marginLeft: '15px'}}>
            <FunctionsIcon />
            <Typography>{generalStats.totalTests}</Typography>
        </div>
    </StyledTooltip>

    <StyledTooltip
      title={
        <div>
          <div>Successful test results: {generalStats.successTestResults}</div>
          <div>Total test results: {generalStats.totalTestResults}</div>
          <br/>
          <div>Success test result rate: { Number.parseInt(generalStats.successTestResultRate * 100)}%</div>
          <div>Success test retry rate:  { Number.parseInt(generalStats.successTestRetryRate * 100)}%</div>
        </div>
      }
      maxWidth={'none'} style={{display: 'block'}}>
        <div style={{display: 'flex', marginLeft: '15px'}}>
            <BarChartIcon />
            <Typography>{Number.parseInt(generalStats.successTestResultRate * 100)}%</Typography>
        </div>
    </StyledTooltip>

    <StyledTooltip
      title={
        <div>
            <div>Avg retry duration: { generalStats.avgRetryDuration }s</div>
        </div>
      }
      maxWidth={'none'} style={{display: 'block'}}>
        <div style={{display: 'flex', marginLeft: '15px'}}>
            <TimerIcon />
            <Typography>{generalStats.avgRetryDuration}s</Typography>
        </div>
    </StyledTooltip>

    <StyledTooltip
      title={
        <div>
            <div>Avg retries count: { Number.parseInt(generalStats.avgTestRetries * 100) / 100 }</div>
        </div>
      }
      maxWidth={'none'} style={{display: 'block'}}>
        <div style={{display: 'flex', marginLeft: '15px', marginRight: '10px'}}>
            <AutorenewIcon />
            <Typography>{Number.parseInt(generalStats.avgTestRetries * 100) / 100}</Typography>
        </div>
    </StyledTooltip>
 </div>
}