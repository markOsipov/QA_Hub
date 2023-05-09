import {FormControl, Input, InputLabel, MenuItem, Select} from "@mui/material";
import {customTheme} from "../../../../styles/CustomTheme";
import TextParam from "./TextParam";

function SelectParam({style, param, index, setParamValue}) {
    if (param.readOnly) {
        return <TextParam style={style} param={param} index={index} setParamValue={setParamValue} />
    }

    return <FormControl style={style}>
        <InputLabel style={{color: customTheme.palette.text.faded, position: "relative", top: "10px", left: "-5px"}}>{param.name}</InputLabel>
        <Select
            value={param.value}
            style={{backgroundColor: customTheme.palette.background.input}}
            onChange={(event) => {setParamValue(index, event.target.value)}}
            size="small"

        >
            {
                (param.options).map(option => (
                    <MenuItem key={option} value={option}>{option}</MenuItem>
                ))
            }
        </Select>
    </FormControl>
}

export default SelectParam