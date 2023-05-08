import {customTheme} from "../../../../../styles/CustomTheme";
import {TextareaAutosize} from "@mui/material";

function TextAreaParamConfig({editParamField, textAreaStyle, param}) {
    return <div style={{marginTop: "25px"}}>
        <label style={{fontSize: "11px", position: "relative", left: "8px", top: "-6px", color: customTheme.palette.text.faded}}>Value</label>

        <TextareaAutosize
            style={textAreaStyle}
            label={"Value"}
            value={param.value}
            onChange={(event) => {editParamField("value", event.target.value)}}
        />
    </div>
}

export default TextAreaParamConfig