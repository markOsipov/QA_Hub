import {StyledTableCell} from "./StyledTableCell";
import {useState, useEffect, useRef} from "react";
import {IconButton, TextField} from "@mui/material";
import {customTheme} from "../../../styles/CustomTheme";
import EditIcon from '@mui/icons-material/Edit';
import * as PropTypes from "prop-types";
import AutoFocusTextField from "../AutoFocusTextField";


AutoFocusTextField.propTypes = {
    id: PropTypes.string,
    style: PropTypes.shape({color: PropTypes.any}),
    size: PropTypes.string,
    variant: PropTypes.string,
    onBlur: PropTypes.func
};
export default function EditableTableCell({ contentText, onChangeCallback, onBlurCallback }) {
    const [showEditIcon, setShowEditIcon] = useState(false)
    const [editStarted, setEditStarted] = useState(false)

    const readOnlyContent = <div style={{display: "flex", alignItems: "center"}}>
        <label style={{ flexGrow: "1", width: "100%" }}>{ contentText }</label>
        { showEditIcon &&
            <IconButton
                className="hover-highlight clickable"
                style={{ color: "white", padding: "5px", borderRadius: "2px" }}
                onClick={ () => { setEditStarted(true)}}
            >
                <EditIcon style={{ width: "18px", height: "18px"}}/>
            </IconButton>
        }
        {
            !showEditIcon && <div style={{width: "50px"}}></div>
        }
    </div>


    const editableContent = <AutoFocusTextField
        id="standard-basic"
        size="small"
        variant="standard"
        value={contentText}
        style={{width: "100%"}}
        onChange={onChangeCallback}
        onBlur={() => { setEditStarted(false); onBlurCallback() }}
    />

    return <StyledTableCell onMouseEnter={ () => { setShowEditIcon(true)} }
                            onMouseLeave={ () => { setShowEditIcon(false)} }
    >
        { editStarted ? editableContent : readOnlyContent }
    </StyledTableCell>
}