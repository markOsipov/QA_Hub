import {StyledTableCell} from "./StyledTableCell";
import {useState, useEffect, useRef} from "react";
import {IconButton, TextField} from "@mui/material";
import {customTheme} from "../../../styles/CustomTheme";
import EditIcon from '@mui/icons-material/Edit';
import * as PropTypes from "prop-types";
import AutoFocusTextField from "../AutoFocusTextField";
import AutoFocusTextArea from "../AutoFocusTextArea";


AutoFocusTextField.propTypes = {
    id: PropTypes.string,
    style: PropTypes.shape({color: PropTypes.any}),
    size: PropTypes.string,
    variant: PropTypes.string,
    onBlur: PropTypes.func
};
export default function EditableTableCell({ content, value, afterContent, onChangeCallback, onBlurCallback, textArea, contentStyle,  ...props }) {
    const [showEditIcon, setShowEditIcon] = useState(false)
    const [editStarted, setEditStarted] = useState(false)

    const handleDoubleClick = () => {
        if (!editStarted) {
            setEditStarted(true)
        }
    }

    const readOnlyContent = <div style={{display: "flex", alignItems: "center", position: 'relative'}} onDoubleClick={handleDoubleClick}>
        <div style={{display: 'flex', alignItems: 'center', position: 'relative'}}>
            <div style={{display: 'flex', maxWidth: 'max-content', ...contentStyle}}>
                <label style={{}}>{ content }</label>
            </div>
            { afterContent }

            { showEditIcon &&
              <IconButton
                className="hover-highlight clickable"
                style={{ color: "white", padding: "5px", borderRadius: "2px", position: 'absolute', left: 'calc(100% + 15px)', top: 'calc(50% - 14px)' }}
                onClick={ () => { setEditStarted(true)}}
              >
                  <EditIcon style={{ width: "18px", height: "18px"}}/>
              </IconButton>
            }
        </div>
    </div>

    let editableContent

    if (textArea) {
        editableContent = <AutoFocusTextArea
            style={{resize: "vertical", width: "100%", padding: "10px", font: "inherit" }}
            value={value || content}
            onChange={onChangeCallback}
            onBlur={() => { setEditStarted(false); onBlurCallback()}}
        />
    } else {
        editableContent = <AutoFocusTextField
            id="standard-basic"
            size="small"
            variant="standard"
            value={value || content}
            style={{width: "100%"}}
            onChange={onChangeCallback}
            onBlur={() => { setEditStarted(false); onBlurCallback() }}
        />
    }

    return <StyledTableCell
      style={{...props.style}}
      onMouseEnter={ () => { setShowEditIcon(true)} }
      onMouseLeave={ () => { setShowEditIcon(false)} }
      {...props}
    >
            { editStarted ? editableContent : readOnlyContent }
    </StyledTableCell>
}