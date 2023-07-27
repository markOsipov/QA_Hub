import StyledTooltip from "../../../primitives/StyledTooltip";
import ForkLeftIcon from "@mui/icons-material/ForkLeft";
import CommitIcon from "@mui/icons-material/Commit";
import PublicIcon from "@mui/icons-material/Public";
import ComputerIcon from "@mui/icons-material/Computer";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import SyncIcon from "@mui/icons-material/Sync";

export default function TestRunConfig({testRun, ...props}) {
  const marginBottom = '10px'
  const iconWidth = '20px'

  return <div style={{display: 'flex', flexDirection: 'column', height: 'min-content', opacity: '0.8', ...props.style}}>

    <div style={{display: 'flex', marginBottom: marginBottom}}>
      <StyledTooltip title={'Commit'} placement="bottom-end" arrow>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <CommitIcon></CommitIcon>
          <label style={{marginLeft: '2px'}}>{testRun.config.commit}</label>
        </div>
      </StyledTooltip>

      <StyledTooltip title={'Branch'} placement="bottom-end" arrow>
        <div style={{display: 'flex', alignItems: 'center', marginLeft: '12px'}}>
          <ForkLeftIcon/>
          <label style={{marginLeft: '2px'}}>{testRun.config.branch}</label>
        </div>
      </StyledTooltip>
    </div>

    <div style={{display: 'flex', marginBottom: marginBottom}}>
      <StyledTooltip title={'Active runners'} placement="bottom-end" arrow>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <ComputerIcon style={{minWidth: iconWidth}} />
          <label style={{marginLeft: '5px'}}>{testRun.runners.length}</label>
        </div>
      </StyledTooltip>

      <StyledTooltip title={'Parallel devices'} placement="bottom-end" arrow>
        <div style={{display: 'flex', alignItems: 'center', marginLeft: '12px'}}>
          <PhoneIphoneIcon style={{minWidth: iconWidth}}/>
          <label style={{marginLeft: '5px'}}>{testRun.config.parallelThreads}</label>
        </div>
      </StyledTooltip>

      <StyledTooltip title={'Retries'} placement="bottom-end" arrow>
        <div style={{display: 'flex', alignItems: 'center', marginLeft: '12px'}}>
          <SyncIcon style={{transform: 'scaleX(-1)', minWidth: iconWidth}} />
          <label style={{marginLeft: '5px'}}>{testRun.config.retries}</label>
        </div>
      </StyledTooltip>
    </div>

    <div style={{width: "min-content"}}>
      <StyledTooltip title={'Environment'} placement="bottom-end" arrow>
        <div style={{display: 'flex', alignItems: 'center', marginBottom: marginBottom}}>
          <PublicIcon/>
          <label style={{marginLeft: '7px'}}>{testRun.config.environment}</label>
        </div>
      </StyledTooltip>
    </div>
  </div>
}