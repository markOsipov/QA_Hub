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
export default function EditableTableCell({ contentText, afterContent, onChangeCallback, onBlurCallback, textArea, contentStyle,  ...props }) {
    const [showEditIcon, setShowEditIcon] = useState(false)
    const [editStarted, setEditStarted] = useState(false)

    const readOnlyContent = <div style={{display: "flex", alignItems: "center", position: 'relative'}}>
        <div style={{display: 'flex', flexGrow: '1.1', alignItems: 'center'}}>
            <div style={{display: 'flex', ...contentStyle}}>
                <label>{ contentText }</label>
            </div>
            { afterContent }
        </div>
        { showEditIcon &&
            <IconButton
                className="hover-highlight clickable"
                style={{ color: "white", padding: "5px", borderRadius: "2px", marginLeft: '10px', position: 'absolute', right: '0', top: 'calc(50% - 14px)' }}
                onClick={ () => { setEditStarted(true)}}
            >
                <EditIcon style={{ width: "18px", height: "18px"}}/>
            </IconButton>
        }
    </div>

    let editableContent

    if (textArea) {
        editableContent = <AutoFocusTextArea
            style={{resize: "vertical", width: "100%", padding: "10px", font: "inherit" }}
            value={contentText}
            onChange={onChangeCallback}
            onBlur={() => { setEditStarted(false); onBlurCallback()}}
        />
    } else {
        editableContent = <AutoFocusTextField
            id="standard-basic"
            size="small"
            variant="standard"
            value={contentText}
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