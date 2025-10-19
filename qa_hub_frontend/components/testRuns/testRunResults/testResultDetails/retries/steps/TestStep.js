import {useState} from "react";
import {customTheme} from "../../../../../../styles/CustomTheme";
import CheckIcon from "@mui/icons-material/Check";
import TestSteps from "./TestSteps";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import ClearIcon from '@mui/icons-material/Clear';
export default function TestStep({step, margin, setSelectedStep, ...props}) {
  const iconSize = '18px'
  const [expanded, setExpanded] = useState( step.result === 'failure')
  const [hovered, setHovered] = useState(false)

  const selectStep = () => {
    setSelectedStep({
      id: step.id,
      timestamp: Date.now()
    })
  }

  return <div style={{ ...props.style }}>
    <div style={{display: "flex", alignItems: 'center'}}>
      {
        step.steps.length > 0 &&
        <div
          style={{
            cursor: 'pointer',
            backgroundColor: step.result === 'success' ? customTheme.palette.success.main : customTheme.palette.error.main,
            height: iconSize,
            width: iconSize,
          }}
          onClick={ () => { setExpanded(!expanded)}}
        >
          <PlayArrowIcon style={{
            height: iconSize,
            width: iconSize,
            color: 'white',
            transform: expanded && 'rotate(90deg)',
            transition: 'all 0.1s linear',
            position: 'relative',
          }}/>
      </div>
      }
      {
        step.steps.length == 0 && step.result === 'success' &&
        <CheckIcon style={{
          height: iconSize,
          width: iconSize,
          borderRadius: iconSize,
          color: 'white',
          backgroundColor: customTheme.palette.success.main
        }}/>
      }
      {
        step.steps.length == 0 && step.result !== 'success' &&
        <ClearIcon style={{
          height: iconSize,
          width: iconSize,
          borderRadius: iconSize,
          color: 'white',
          backgroundColor: customTheme.palette.error.main
        }}/>
      }
      <label style={{marginLeft: '15px', opacity: '0.3'}}>{ step.id }</label>
      <div
        style={{
          marginLeft: '10px',
          backgroundColor: hovered ? 'rgba(255, 255, 255, 0.03)' : 'unset',
          padding: '6px',
          width: '100%',
          display: 'flex',
          cursor: 'pointer'
        }}
        onClick={() => { selectStep(step.id) }}
        onMouseEnter={() => {setHovered(true)}}
        onMouseLeave={() => {setHovered(false)}}
      >
        <label style={{cursor: 'pointer'}}>{ step.name }</label>

        <div style={{flexGrow: "1.1"}}></div>
        {
          step.duration !== null &&
          <div style={{display: "flex", alignItems: "center", marginLeft: "29px", opacity: step.duration == 0 ? "0.15" : "0.7", cursor: 'pointer'}}>
            <AccessTimeFilledIcon />
            <label style={{marginLeft: "3px", cursor: 'pointer', minWidth: '37px'}}>{step.duration}s</label>
          </div>
        }
      </div>

    </div>

    {
      expanded &&
      <TestSteps steps={step.steps} setSelectedStep={setSelectedStep} margin={margin + 1} />
    }
  </div>
}