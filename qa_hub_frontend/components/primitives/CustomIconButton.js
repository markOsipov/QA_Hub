import {customTheme} from "../../styles/CustomTheme";
import {useState} from "react";

export default function CustomIconButton({action, icon, color, ...props}) {
  const [hovered, setHovered] = useState(false)

  return <div
    {...props}
    onClick={action}
    onMouseOver={() => {setHovered(true)}}
    onMouseLeave={() => {setHovered(false)}}
    style={{
      backgroundColor: color || customTheme.palette.primary.main,
      height: '25px',
      width: '25px',
      marginLeft: '6px',
      ...customIconButtonBackgroundStyle,
      ...props.style
    }}
  >
    <div style={{
      ...customIconButtonHoverLayerStyle,
      backgroundColor: hovered ? 'rgba(255, 255, 255, 0.08)' : ''
    }}></div>
    {icon}
  </div>
}

const customIconButtonBackgroundStyle= {
  borderRadius: '5px',
  display: 'grid',
  alignContent: 'center',
  justifyContent: 'center',
  position: 'relative',
  cursor: 'pointer'
}

const customIconButtonHoverLayerStyle = {
  position: "absolute",
  width: '100%',
  height: '100%',
  borderRadius: '5px'
}