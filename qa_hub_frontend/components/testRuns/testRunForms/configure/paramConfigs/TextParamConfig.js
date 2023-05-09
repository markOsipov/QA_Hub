import {FormControl, Input, InputLabel} from "@mui/material";
import {customTheme} from "../../../../../styles/CustomTheme";

function TextParamConfig({editParamField, param}) {
    return <FormControl style={{width: "483px", marginTop: "10px"}}>
        <InputLabel style={{color: customTheme.palette.text.faded, left: "-5px", top: "7px"}}>Default value</InputLabel>
        <Input style={{backgroundColor: customTheme.palette.background.input, paddingLeft:"5px", height: "36px"}}
               value={param.defaultValue}
               onChange={(event) => {editParamField("defaultValue", event.target.value)}}
        />
    </FormControl>
}

export default TextParamConfig