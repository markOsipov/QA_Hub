import StyledTooltip from "../../primitives/StyledTooltip";
import {customTheme} from "../../../styles/CustomTheme";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import {useState} from "react";

const SwitchTestListButton = ({switchShowTestList, showTestList, ...props}) => {
  const size = '20px'
  const title = showTestList ? 'Hide test results list' : 'Show test results list'

  const [hovered, setHovered] = useState(false)

  return <StyledTooltip title={title}>
    <div
      style={{
        cursor: 'pointer',
        height: size,
        width: size,
        borderRadius: size,
        backgroundColor: hovered ? 'white' : customTheme.palette.text.faded,
        position: 'absolute',
        opacity: '0.6',
        ...props.style
      }}
      onClick={() => {switchShowTestList()}}
      onMouseOver={() => {setHovered(true)}}
      onMouseLeave={() => {setHovered(false)}}
    >
      <KeyboardArrowRightIcon
        style={{
          color: customTheme.palette.background.default ,
          fontSize: size,
          transform: showTestList ? "rotate(180deg)" : ''
        }}/>
    </div>
  </StyledTooltip>
}

export default SwitchTestListButton