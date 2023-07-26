import StyledTooltip from "../../../primitives/StyledTooltip";
import ForkLeftIcon from "@mui/icons-material/ForkLeft";
import TextWithLabel from "../../../primitives/TextWithLabel";
import CommitIcon from "@mui/icons-material/Commit";
import PublicIcon from "@mui/icons-material/Public";
import ComputerIcon from "@mui/icons-material/Computer";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import SyncIcon from "@mui/icons-material/Sync";

export default function TestRunConfig({testRun, ...props}) {
  const marginBottom = '12px'

  return <div style={{display: 'flex', height: 'min-content', ...props.style}}>

    <div style={{marginLeft: '10px'}}>
      <StyledTooltip title={'Active runners'} placement="bottom-end" arrow>
        <div style={{display: 'flex', alignItems: 'center', marginBottom: marginBottom}}>
          <ComputerIcon style={{minWidth: '30px'}} />
          <label style={{marginLeft: '5px'}}>{testRun.runners.length}</label>
        </div>
      </StyledTooltip>

      <StyledTooltip title={'Parallel devices'} placement="bottom-end" arrow>
        <div style={{display: 'flex', alignItems: 'center', marginBottom: marginBottom}}>
          <PhoneIphoneIcon style={{minWidth: '30px'}}/>
          <label style={{marginLeft: '5px'}}>{testRun.config.parallelThreads}</label>
        </div>
      </StyledTooltip>

      <StyledTooltip title={'Retries'} placement="bottom-end" arrow>
        <div style={{display: 'flex', alignItems: 'center', marginBottom: marginBottom}}>
          <SyncIcon style={{transform: 'scaleX(-1)', minWidth: '30px'}} />
          <label style={{marginLeft: '5px'}}>{testRun.config.retries}</label>
        </div>
      </StyledTooltip>
    </div>

    <div style={{marginLeft: '40px'}}>
      <StyledTooltip title={'Branch'} placement="bottom-end" arrow>
        <div style={{display: 'flex', alignItems: 'center', marginBottom: marginBottom}}>
          <ForkLeftIcon/>
          <label>{testRun.config.branch}</label>
        </div>
      </StyledTooltip>

      <StyledTooltip title={'Commit'} placement="bottom-end" arrow>
        <div style={{display: 'flex', alignItems: 'center', marginBottom: marginBottom}}>
          <CommitIcon style={{transform: 'rotate(90deg)'}}></CommitIcon>
          <label>{testRun.config.commit}</label>
        </div>
      </StyledTooltip>

      <StyledTooltip title={'Environment'} placement="bottom-end" arrow>
        <div style={{display: 'flex', alignItems: 'center', marginBottom: marginBottom}}>
          <PublicIcon/>
          <label style={{marginLeft: '4px'}}>{testRun.config.environment}</label>
        </div>
      </StyledTooltip>
    </div>
  </div>
}