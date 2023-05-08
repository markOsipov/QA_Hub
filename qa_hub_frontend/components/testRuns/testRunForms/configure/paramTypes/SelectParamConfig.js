import {FormControl, Input, InputLabel, MenuItem, Select} from "@mui/material";
import {customTheme} from "../../../../../styles/CustomTheme";
import IconButton from "@mui/material/IconButton";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

function SelectParamConfig({editParamField, param}) {
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
                    (param.options).map(option => (
                        <MenuItem key={option} value={option}>{option}</MenuItem>
                    ))
                }
            </Select>
        </FormControl>

        <div style={{marginTop: "15px", display: "flex", flexDirection: "column", maxWidth: "250px"}}>
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
                            }}
                                        onClick={(event)=> {editParamField("options", param.options.filter((option, optIndex) => optIndex != index))}}
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

export default SelectParamConfig