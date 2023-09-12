import {observer} from "mobx-react-lite";
import {useEffect, useRef, useState} from "react";
import OpenWithIcon from '@mui/icons-material/OpenWith';
import {customTheme} from "../../styles/CustomTheme";
import StyledTooltip from "../primitives/StyledTooltip";

const DragAndDropView = observer(({initialX, initialY, ...props}) => {
  const dragRef = useRef()
  const [isDragging, setIsDragging] = useState(false)

  const [mouseCoordinates, setMouseCoordinates] = useState({x:0, y:0});
  const [elementCoords, setElementCoords] = useState({
    x: initialX || 50,
    y:initialY || 50
  })
  const startDragging = () => {
    setIsDragging(true)
  }

  const stopDragging = () => {
    setIsDragging(false)
  }

  const mouseMoveHandler = (event) => {
    setMouseCoordinates({
      x:event.clientX,
      y:event.clientY
    });
  }

  useEffect(() => {
    if (isDragging) {
      setElementCoords({
        x: mouseCoordinates.x,
        y: mouseCoordinates.y
      })
    }
  }, [mouseCoordinates.x, mouseCoordinates.y])

  useEffect(()=>{
    window.addEventListener('mousemove', mouseMoveHandler);
    return(()=>{
      window.removeEventListener('mousemove', mouseMoveHandler);
    })
  }, [])

  return <div
    ref={dragRef}

    style={{
      position: 'absolute',
      left: elementCoords.x && elementCoords.x + 'px',
      top: elementCoords.y && elementCoords.y + 'px',
    }}
  >
    <div
      style={{ position: 'relative', ...props.style }}
    >
      {
        props.children
      }

      <DragIcon
        onMouseDown={startDragging}
        onMouseUp={stopDragging}
        style={{opacity: '0.7'}}
      />
    </div>
  </div>
})

const DragIcon = ({onMouseDown, onMouseUp, ...props}) => {
  const [hovered, setHovered] = useState(false)

  return  <StyledTooltip title={"Move"}>
      <div
        style={{
          position: 'absolute',
          top: '-7px',
          left: '-10px',
          borderRadius: '15px',
          backgroundColor: customTheme.palette.text.white,
          boxShadow: hovered && '0 0 10px rgba(255, 255, 255, 0.6)',
          placeItems: 'center',
          display: 'grid',
          cursor: "pointer",
          ...props.style
        }}
        onMouseOver={() => {setHovered(true)}}
        onMouseLeave={() => {setHovered(false)}}
        onBlur={() => {setHovered(false)}}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
      >
      <OpenWithIcon style={{color: 'black'}}/>
    </div>
  </StyledTooltip>
}

export default DragAndDropView