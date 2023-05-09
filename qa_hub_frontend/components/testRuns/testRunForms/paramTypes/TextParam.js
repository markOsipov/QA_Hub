import {FormControl, Input, InputLabel} from "@mui/material";
import {customTheme} from "../../../../styles/CustomTheme";

function TextParam({style, param, index, setParamValue}) {
    return <FormControl style={style} disabled={param.readOnly}>
        {/*<InputLabel style={{color: customTheme.palette.text.faded, left: "-5px", top: "7px"}}>{param.name}</InputLabel>*/}
        <Input style={{backgroundColor: customTheme.palette.background.input, paddingLeft:"10px", height: "36px"}}
               value={param.value}
               onChange={(event) => {setParamValue(index, event.target.value)}}
        />
    </FormControl>
}

export default TextParam