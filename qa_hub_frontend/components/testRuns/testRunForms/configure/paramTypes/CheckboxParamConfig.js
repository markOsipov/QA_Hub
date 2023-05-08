import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import {customTheme} from "../../../../../styles/CustomTheme";

function CheckboxParamConfig({ editParamField, param }) {

    return <div>
        <FormControl style={{width: "483px", marginTop: "15px"}}>
            <InputLabel style={{color: customTheme.palette.text.faded, position: "relative", top: "10px"}}>Value</InputLabel>
            <Select
                value={param.value}
                style={{backgroundColor: customTheme.palette.background.input}}
                onChange={(event) => editParamField("value", event.target.value)}
                size="small"
            >
                {
                    (["true", "false"]).map(option => (
                        <MenuItem key={"option_" + option} value={option}>{option}</MenuItem>
                    ))
                }
            </Select>
        </FormControl>
    </div>
}

export default CheckboxParamConfig