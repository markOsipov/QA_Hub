import {FormControl, Input, InputLabel, MenuItem, Select} from "@mui/material";
import {customTheme} from "../../../../styles/CustomTheme";
import TextParam from "./TextParam";

function CheckboxParam({style, param, index, setParamValue}) {
    if (param.readOnly) {
        return <TextParam style={style} param={param} index={index} setParamValue={setParamValue} />
    }

    return <FormControl style={style}>
        <InputLabel style={{color: customTheme.palette.text.faded, position: "relative", top: "10px",}}>{param.name}</InputLabel>
        <Select
            value={param.value}
            style={{backgroundColor: customTheme.palette.background.input}}
            onChange={(event) => {setParamValue(index, event.target.value)}}
            size="small"
        >
            {
                (["true", "false"]).map(option => (
                    <MenuItem key={"option_" + option} value={option}>{option}</MenuItem>
                ))
            }
        </Select>
    </FormControl>
}

export default CheckboxParam