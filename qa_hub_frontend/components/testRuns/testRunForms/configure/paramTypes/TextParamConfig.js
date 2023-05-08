import {FormControl, Input, InputLabel} from "@mui/material";
import {customTheme} from "../../../../../styles/CustomTheme";

function TextParamConfig({editParamField, param}) {
    return <FormControl style={{width: "483px", marginTop: "10px"}}>
        <InputLabel style={{color: customTheme.palette.text.faded, left: "-5px", top: "5px"}}>Value</InputLabel>
        <Input style={{backgroundColor: customTheme.palette.background.input, paddingLeft:"5px", height: "36px"}}
               defaultValue={param.value}
               onBlur={(event) => {editParamField("value", event.target.value)}}
        />
    </FormControl>
}

export default TextParamConfig