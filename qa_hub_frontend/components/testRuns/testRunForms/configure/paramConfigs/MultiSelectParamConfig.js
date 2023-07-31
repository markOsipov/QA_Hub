import {Checkbox, FormControl, Input, InputLabel, ListItemText, MenuItem, Select} from "@mui/material";
import {customTheme} from "../../../../../styles/CustomTheme";
import IconButton from "@mui/material/IconButton";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import {useEffect, useState} from "react";
import StyledSelect from "../../../../primitives/StyledSelect";

function MultiSelectParamConfig({editParamField, param}) {
    const separator = ", "

    function getInitialValue() {
        if (param.options.length == 0) {
            return []
        } else {
            return param.defaultValue
                .split(separator)
                .filter( el => param.options.includes(el))
        }
    }

    const [values, setValues] = useState(getInitialValue() )

    useEffect(() => {
        editParamField("defaultValue", values.join(separator))
    }, [values])

    function handleValueChange(event) {
        const value = event.target.value
        const newParamValue =  typeof value === 'string' ? value.split(separator) : value

        setValues(newParamValue)
    }

    return <div>
        <FormControl style={{width: "483px", minWidth: "250px", marginTop: "15px"}}>
            <InputLabel style={{color: customTheme.palette.text.faded, position: "relative", top: "10px"}}>Default value</InputLabel>
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
                            <Checkbox checked={param.defaultValue.indexOf(option) > -1} />
                            <ListItemText primary={option} />
                        </MenuItem>
                    ))
                }
            </StyledSelect>
        </FormControl>

        <div style={{marginTop: "15px", display: "flex", flexDirection: "column", minWidth: "275px"}}>
            <label>Options: </label>
            <div style={{marginLeft: "20px"}}>
                {
                    param.options.map((option, index) =>
                        <div style={{display: "flex", marginTop: "10px", alignItems: "center" }} key={"option_" + index}>
                            <FormControl style={{width: "250px"}}>
                                <InputLabel style={{color: customTheme.palette.text.faded, left: "-5px", top: "5px"}}>Option {index + 1}</InputLabel>
                                <Input style={{backgroundColor: customTheme.palette.background.input, paddingLeft:"5px", height: "36px"}}
                                       value={option}
                                       onChange={(event) => {
                                           let optionsCopy = param.options.slice()
                                           optionsCopy[index] = event.target.value
                                           editParamField("options", optionsCopy)
                                       }}
                                />
                            </FormControl>

                            <IconButton style={{
                                width: "32px", height: "32px",
                                borderRadius: "6px",
                                marginTop: "10px",
                                marginLeft: "5px"
                            }}
                                        onClick={(event)=> {
                                            editParamField("options", param.options.filter((option, optIndex) => optIndex !== index))
                                        }}
                            >
                                <RemoveIcon style={{fontSize: "24px", color: customTheme.palette.error.main}}/>
                            </IconButton>
                        </div>
                    )
                }

                <IconButton style={{
                    backgroundColor: customTheme.palette.primary.main,
                    width: "32px", height: "32px",
                    borderRadius: "6px",
                    marginTop: "12px",
                }}
                            onClick={(event)=> {editParamField("options", [...param.options, `Option ${param.options.length + 1}` ])}}
                >
                    <AddIcon style={{fontSize: "24px"}}/>
                </IconButton>
            </div>
        </div>
    </div>
}

export default MultiSelectParamConfig