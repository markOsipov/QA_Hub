import {useState} from "react";
import {customTheme} from "../../../../styles/CustomTheme";
import imagePopupState from "../../../../state/testRuns/ImagePopupState";
import process from "../../../../next.config";
import ImageIcon from "@mui/icons-material/Image";
import ArticleIcon from "@mui/icons-material/Article";

const AttachmentElement = ({attachment, ...props}) => {
  const [hovered, setHovered] = useState(false)

  const handleHover = () => {
    setHovered(true)    
  }

  const handleBlur = () => {
    setHovered(false)
  }

  if (attachment.type != 'image') {
    return <></>
  }

  return <>
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        marginLeft: '20px',
        padding: '5px 10px',
        borderRadius: '5px',
        backgroundColor: hovered && customTheme.palette.background.hoverHighlight,
        cursor: 'pointer',
        ...props.style
      }}
      onClick={() => {imagePopupState.open(`${process.env.NEXT_PUBLIC_QA_HUB_BACKEND}/${attachment.path}`)}}
      onMouseOver={handleHover}
      onMouseLeave={handleBlur}
      onBlur={handleBlur}
      rel="noreferrer">
      {
        attachment.type === 'image' ? <ImageIcon /> : <ArticleIcon />
      }
      <label style={{marginLeft: '5px'}}>{attachment.type === 'image' ? 'Screenshot' : 'Attachment'}</label>
    </div>
  </>
}

export default AttachmentElement