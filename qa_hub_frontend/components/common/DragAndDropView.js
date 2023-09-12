import {observer} from "mobx-react-lite";
import {useEffect, useRef, useState} from "react";
import OpenWithIcon from '@mui/icons-material/OpenWith';
import {customTheme} from "../../styles/CustomTheme";
import StyledTooltip from "../primitives/StyledTooltip";

const DragAndDropView = observer(({initialX, initialY, ...props}) => {
  const dragRef = useRef()
  const contentRef = useRef()
  const [isDragging, setIsDragging] = useState(false)

  const [mouseCoordinates, setMouseCoordinates] = useState({x:0, y:0});
  const [elementCoords, setElementCoords] = useState({
    x: initialX || 50,
    y:initialY || 50
  })

  const [elementHeight, setElementHeight] = useState(0)
  const [elementWidth, setElementWidth] = useState(0)
  const startDragging = () => {
    setIsDragging(true)
    window.addEventListener('mousemove', mouseMoveHandler);
  }

  const stopDragging = () => {
    setIsDragging(false)
    window.removeEventListener('mousemove', mouseMoveHandler);
  }

  const mouseMoveHandler = (event) => {
    setMouseCoordinates({
      x:event.clientX,
      y:event.clientY
    });
  }

  useEffect(() => {
    if (contentRef?.current?.clientWidth) {
      setElementWidth(contentRef.current.clientWidth)
    }
    if (contentRef?.current?.clientHeight) {
      setElementHeight(contentRef.current.clientHeight)
    }
  }, [contentRef?.current?.clientWidth, contentRef?.current?.clientHeight])

  useEffect(() => {
    const minX = 5
    const minY = 5
    const maxX = window.innerWidth - elementWidth - 10
    const maxY = window.innerHeight - elementHeight - 10
    const mouseX =  mouseCoordinates.x
    const mouseY =  mouseCoordinates.y

    if (isDragging) {
      setElementCoords({
        x: Math.max(Math.min(mouseX, maxX), minX),
        y: Math.max(Math.min(mouseY, maxY), minY)
      })
    }
  }, [mouseCoordinates.x, mouseCoordinates.y])

  // useEffect(()=>{
  //   window.addEventListener('mousemove', mouseMoveHandler);
  //   return(()=>{
  //     window.removeEventListener('mousemove', mouseMoveHandler);
  //   })
  // }, [])

  return <div
    ref={dragRef}
    style={{
      position: 'absolute',
      left: elementCoords.x && elementCoords.x + 'px',
      top: elementCoords.y && elementCoords.y + 'px',
    }}
    onMouseUp={stopDragging}
    onBlur={stopDragging}
  >
    <div
      ref={contentRef}
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