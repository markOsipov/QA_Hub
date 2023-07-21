import {Checkbox, FormControl, Input, InputLabel, ListItemText, MenuItem, Select} from "@mui/material";
import {customTheme} from "../../../../styles/CustomTheme";
import {useEffect, useState} from "react";
import TextParam from "./TextParam";
import StyledSelect from "../../../primitives/StyledSelect";

function MultiSelectParam({style, param, index, setParamValue}) {
    const separator = ", "

    function getInitialValue() {
        if (param.options.length == 0) {
            return []
        } else {
            return param.value
                .split(separator)
                .filter( el => param.options.includes(el))
        }
    }

    const [values, setValues] = useState(getInitialValue() )

    useEffect(() => {
        setParamValue(index, values.join(separator))
    }, [values])

    useEffect(() => {
        setValues(getInitialValue())
    }, [param])

    function handleValueChange(event) {
        const value = event.target.value
        const newParamValue =  typeof value === 'string' ? value.split(separator) : value

        setValues(newParamValue)
    }

    if (param.readOnly) {
        return <TextParam style={style} param={param} index={index} setParamValue={setParamValue} />
    }

    return <FormControl style={style}>
        {/*<InputLabel style={{color: customTheme.palette.text.faded, position: "relative", top: "10px", left: "-5px"}}>{param.name}</InputLabel>*/}
        <StyledSelect
            value={values}
            style={{backgroundColor: customTheme.palette.background.input}}
            onChange={handleValueChange}
            renderValue={(selected) => selected.join(separator)}
            multiple
            size="small"
        >
            {
                (param.options).map(option => (

                    <MenuItem key={option} value={option}>
                        <Checkbox checked={param.value.indexOf(option) > -1} />
                        <ListItemText primary={option} />
                    </MenuItem>
                ))
            }
        </StyledSelect>
    </FormControl>
}

export default MultiSelectParam