import StyledTooltip from "../../../primitives/StyledTooltip";
import ForkLeftIcon from "@mui/icons-material/ForkLeft";
import TextWithLabel from "../../../primitives/TextWithLabel";
import CommitIcon from "@mui/icons-material/Commit";
import PublicIcon from "@mui/icons-material/Public";
import ComputerIcon from "@mui/icons-material/Computer";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import SyncIcon from "@mui/icons-material/Sync";

export default function TestRunConfig({testRun, ...props}) {
  const opacity = '0.8'

  const configItemStyle = {
    padding: '0px 10px',
    maxHeight: '15px',
    marginLeft: '5px',
    width: '100%',
    opacity: opacity
  }

  return <div style={{display: 'flex', justifyContent: 'end', ...props.style}}>
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