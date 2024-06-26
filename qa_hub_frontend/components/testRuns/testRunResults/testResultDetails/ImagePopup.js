import {observer} from "mobx-react-lite";
import imagePopupState from "../../../../state/testRuns/ImagePopupState";
import {useEffect, useRef, useState} from "react";
import CloseIcon from '@mui/icons-material/Close';
import {customTheme} from "../../../../styles/CustomTheme";
import DragAndDropView from "../../../common/DragAndDropView";
import StyledTooltip from "../../../primitives/StyledTooltip";

const ImagePopup = observer(() => {
  const ref = useRef(null)

  const stubHeight = 670
  const stubWidth = 300
  const [height, setHeight] = useState(0)
  const [width, setWidth] = useState(0)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (ref?.current?.clientHeight) {
      setHeight(ref?.current?.clientHeight)
    }
    if (ref?.current?.clientWidth) {
      setWidth(ref?.current?.clientWidth)
    }
  }, [ref?.current?.clientHeight, ref?.current?.clientWidth, imagePopupState.isOpen])

  const {imageSrc} = imagePopupState

  return <DragAndDropView
    initialX={window.innerWidth / 2} initialY={window.innerHeight / 2 - stubHeight / 2}
    style={{
      position: 'absolute',
      maxWidth: '350px',
      height: 'max-content',
      width: 'max-content'
      // bottom: `max(calc(50vh - ${(height || stubHeight) / 2}px), 0px)`,
      // left: `calc(50vw + ${(width || stubWidth) / 2}px`,
    }}
  >
    <div
      onClick={() => {imagePopupState.close()}}

    >
      <div style={{position: 'relative'}}>
        {
          <a
            href={imageSrc}
            target={"_blank"}
            rel="noreferrer"
            style={{display: ready ? 'block' : 'none'}}
          >
            <img
              ref={ref}
              src={imageSrc}
              style={{maxWidth: '100%', border: '1px solid', borderColor: customTheme.palette.text.disabled, borderRadius: '3px'}}
              onLoad={() => {setReady(true)}}
            ></img>
          </a>
        }
        {
          !ready &&
          <div
            style={{
              display: 'grid',
              placeItems: 'center',
              width: `${stubWidth}px`,
              height: `${stubHeight}px`,
              backgroundColor: customTheme.palette.background.paper
            }}
          >
            <label>Loading...</label>
          </div>
        }
        <ClosePopupIcon action={() => {imagePopupState.close()}} style={{opacity: '0.7'}}/>
      </div>
    </div>
  </DragAndDropView>
})

const ClosePopupIcon = ({action, ...props}) => {
  const [hovered, setHovered] = useState(false)

  return <StyledTooltip title={'Close'}>
    <div
      style={{
        position: 'absolute',
        top: '-7px',
        right: '-10px',
        borderRadius: '15px',
        backgroundColor: customTheme.palette.text.white,
        boxShadow: hovered && '0 0 10px rgba(255, 255, 255, 0.6)',
        placeItems: 'center',
        display: 'grid',
        cursor: "pointer",
        ...props.style
      }}
      onClick={action}
      onMouseOver={() => {setHovered(true)}}
      onMouseLeave={() => {setHovered(false)}}
      onBlur={() => {setHovered(false)}}
    >
      <CloseIcon style={{color: 'black'}}/>
    </div>
    </StyledTooltip>
}
export default ImagePopup