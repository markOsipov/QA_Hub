import {customTheme} from "../../../../../styles/CustomTheme";
import {TextareaAutosize} from "@mui/material";
import {textAreaStyle} from "../../../../../styles/TextAreaStyle";

function TextAreaParamConfig({editParamField, param}) {
    return <div style={{marginTop: "25px"}}>
        <label style={{fontSize: "11px", position: "relative", left: "8px", top: "-6px", color: customTheme.palette.text.faded}}>Default value</label>

        <TextareaAutosize
            style={textAreaStyle}
            label={"Value"}
            value={param.defaultValue}
            onChange={(event) => {editParamField("defaultValue", event.target.value)}}
        />
    </div>
}

export default TextAreaParamConfig