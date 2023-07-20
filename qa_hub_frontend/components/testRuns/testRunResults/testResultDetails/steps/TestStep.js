import {useState} from "react";
import {customTheme} from "../../../../../styles/CustomTheme";
import CheckIcon from "@mui/icons-material/Check";
import TestSteps from "./TestSteps";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ClearIcon from '@mui/icons-material/Clear';
export default function TestStep({step, margin, setSelectedStep, ...props}) {
  const iconSize = '18px'
  const [expanded, setExpanded] = useState( step.result === 'failure')
  const [hovered, setHovered] = useState(false)

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
          padding: '6px'
        }}
        onClick={() => { setSelectedStep(step.id)} }
        onMouseEnter={() => {setHovered(true)}}
        onMouseLeave={() => {setHovered(false)}}
      >
        <label>{ step.name }</label>
      </div>

    </div>

    {
      expanded &&
      <TestSteps steps={step.steps} setSelectedStep={setSelectedStep} margin={margin + 1} />
    }
  </div>
}