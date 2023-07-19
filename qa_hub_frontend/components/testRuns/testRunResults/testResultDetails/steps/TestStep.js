import {useState} from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {customTheme} from "../../../../../styles/CustomTheme";
import CheckIcon from "@mui/icons-material/Check";
import TestSteps from "./TestSteps";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ClearIcon from '@mui/icons-material/Clear';
export default function TestStep({step, margin, setSelectedStep, ...props}) {
  const iconSize = '18px'
  const [expanded, setExpanded] = useState( step.result === 'failure')

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
      <label
        style={{marginLeft: '15px'}}
        onClick={() => { setSelectedStep(step.id)} }
      >
        { step.name }
      </label>
    </div>

    {
      expanded &&
      <TestSteps steps={step.steps} setSelectedStep={setSelectedStep} margin={margin + 1} />
    }
  </div>
}