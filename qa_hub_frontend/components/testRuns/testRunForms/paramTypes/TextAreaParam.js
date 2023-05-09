import {FormControl, Input, InputLabel, TextareaAutosize} from "@mui/material";
import {customTheme} from "../../../../styles/CustomTheme";
import {textAreaStyle} from "../../../../styles/TextAreaStyle";

function TextAreaParam({style, param, index, setParamValue}) {
    return <div style={{display: "grid", ...style}}>
        <label style={{fontSize: "11px", position: "relative", left: "8px", top: "-6px", color: customTheme.palette.text.faded}}>{param.name}</label>

        <TextareaAutosize
            style={{...textAreaStyle, width: "100%"}}
            label={"Value"}
            value={param.value}
            onChange={(event) => {setParamValue(index, event.target.value)}}
        />
    </div>
}

export default TextAreaParam