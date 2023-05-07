import {
    Card,
    Checkbox,
    FormControl,
    FormControlLabel,
    Input,
    InputLabel,
    MenuItem,
    Select,
    TextareaAutosize
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";


function ConfigureParamCard({param, index, params, setParams, paramTypes}) {
    const textAreaStyle = {
        padding: "10px",
        resize: "vertical", width: "100%", height: "100px", maxHeight: "max-content", minHeight: "100px", overflowY: "scroll",
        color: "var(--primary-text-color)",
        backgroundColor: "rgba(255, 255, 255, 0.07)",
        fontFamily:"sans-serif", fontSize: "15px", lineHeight: "1.6"
    }
    const editParamField = (field, value) => {
        const newParams = params.slice()
        newParams[index] = {
            ...param,
            [field]: value
        }

        setParams(newParams)
    }

    const handleRemoveParameterClick = () => {
        const newParams = params.filter((param, paramIndex) => { return paramIndex !== index })

        setParams(newParams)
    }

    return <Card style={{marginBottom: "20px", border: "1px solid gray", padding: "20px 10px 25px 20px"}}>
        <div style={{display: "flex", alignItems: "end", width: "max-content"}}>
            <FormControl style={{width: "300px"}}>
                <InputLabel style={{color: "white", left: "-5px", top: "3px"}}>Name</InputLabel>
                <Input style={{backgroundColor: "rgba(255, 255, 255, 0.10)", paddingLeft:"5px", height: "36px", color: "white"}}
                       defaultValue={param.name}
                       onBlur={(event) => {editParamField("name", event.target.value)}}
                />
            </FormControl>

            <FormControl style={{marginLeft: "15px", width: "170px"}}>
                <InputLabel style={{color: "var(--faded-text-color)", position: "relative", top: "10px"}}>Type</InputLabel>
                <Select
                    value={param.type}
                    style={{backgroundColor: "rgba(255, 255, 255, 0.10)"}}
                    onChange={(event) => editParamField("type", event.target.value)}
                    size="small"
                >
                    {
                        (paramTypes).map(paramType => (
                            <MenuItem key={paramType} value={paramType}>{paramType}</MenuItem>
                        ))
                    }
                </Select>
            </FormControl>

            <IconButton style={{
                backgroundColor: "var(--error-red-color)",
                width: "32px", height: "32px",
                borderRadius: "6px",
                marginLeft: "13px",
                top: "-2px"
            }}
                        onClick={handleRemoveParameterClick}
            >
                <DeleteIcon style={{fontSize: "24px"}}/>
            </IconButton>
        </div>

        {
            (param.type === "textArea") ?
                <div style={{marginTop: "25px"}}>
                    <label style={{fontSize: "11px", position: "relative", left: "8px", top: "-6px", color: "var(--faded-text-color)"}}>Value</label>

                    <TextareaAutosize
                        style={textAreaStyle}
                        label={"Value"}
                        defaultValue={param.value}
                        multiline
                        onBlur={(event) => {editParamField("value", event.target.value)}}
                    />
                </div>
            : (param.type === "text") ?
                    <FormControl style={{width: "100%", marginTop: "10px"}}>
                        <InputLabel style={{color: "var(--faded-text-color)", left: "-5px", top: "5px"}}>Value</InputLabel>
                        <Input style={{backgroundColor: "rgba(255, 255, 255, 0.10)", paddingLeft:"5px", height: "36px"}}
                               defaultValue={param.value}
                               onBlur={(event) => {editParamField("value", event.target.value)}}
                        />
                    </FormControl>
            : null
        }
        <div style={{marginTop: "25px"}}>
            <label style={{fontSize: "11px", position: "relative", left: "8px", top: "-6px", color: "var(--faded-text-color)"}}>Description</label>
            <TextareaAutosize
                style={{...textAreaStyle, height: "45px", minHeight: "45px"}}
                label={"Value"}
                defaultValue={param.description}
                multiline
                onBlur={(event) => {editParamField("description", event.target.value)}}
            />
        </div>

        <FormControlLabel style={{marginTop: "10px"}}
                          control={
                              <Checkbox checked={param.readOnly}
                                        onChange={(event) => {editParamField("readOnly", event.target.checked)}}
                              />
                          }
                          label={
                              <InputLabel style={{color: "var(--faded-text-color)", left: "-6px"}}>ReadOnly</InputLabel>
                          }
        />
    </Card>
}

export default ConfigureParamCard