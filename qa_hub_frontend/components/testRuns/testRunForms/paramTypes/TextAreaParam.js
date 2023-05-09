import {FormControl, Input, InputLabel, TextareaAutosize} from "@mui/material";
import {customTheme} from "../../../../styles/CustomTheme";
import {textAreaStyle} from "../../../../styles/TextAreaStyle";

function TextAreaParam({style, param, index, setParamValue}) {

    return <div style={{display: "grid", ...style}}>
        {/*<InputLabel style={{fontSize: "11px", position: "relative", left: "10px", top: "-6px", color: customTheme.palette.text.faded}}>{param.name}</InputLabel>*/}

        <TextareaAutosize
            style={{...textAreaStyle, width: "100%", color: param.readOnly ? customTheme.palette.text.disabled : customTheme.palette.text.primary }}
            label={"Value"}
            value={param.value}
            disabled={param.readOnly}
            onChange={(event) => {setParamValue(index, event.target.value)}}
        />
    </div>
}

export default TextAreaParam