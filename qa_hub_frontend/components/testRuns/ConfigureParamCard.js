import {Card, FormControl, Input, InputLabel, MenuItem, Select, TextareaAutosize, TextField} from "@mui/material";


function ConfigureParamCard({param, index, params, setParams, paramTypes}) {
    const editParamField = (field, value) => {
        const newParams = params.slice()
        newParams[index] = {
            ...param,
            [field]: value
        }

        setParams(newParams)
    }

    return <Card style={{marginBottom: "20px", border: "1px solid gray", padding: "10px 10px 50px 20px"}}>
        <div style={{display: "flex", alignItems: "end", width: "max-content"}}>
            <FormControl style={{width: "300px"}}>
                <InputLabel style={{color: "var(--faded-text-color)", left: "-5px", top: "3px"}}>Name</InputLabel>
                <Input style={{backgroundColor: "rgba(255, 255, 255, 0.10)", paddingLeft:"5px", height: "34px"}}
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
        </div>

        {
            (param.type === "textArea") ?
                <div style={{marginTop: "15px"}}>
                    <label style={{fontSize: "11px", position: "relative", left: "8px", top: "-6px", color: "var(--faded-text-color)"}}>Value</label>

                    <TextareaAutosize
                        style={{
                            padding: "10px",
                            resize: "vertical", width: "100%", height: "100px", maxHeight: "max-content", minHeight: "100px", overflow: "hidden",
                            color: "var(--primary-text-color)",
                            backgroundColor: "rgba(255, 255, 255, 0.07)",
                            fontFamily:"sans-serif", fontSize: "15px", lineHeight: "1.6",
                        }}
                        label={"Value"}
                        defaultValue={param.value}
                        multiline
                        onBlur={(event) => {editParamField("value", event.target.value)}}
                    />
                </div>
             : (param.type === "text") ?
                    <FormControl style={{width: "100%", marginTop: "10px"}}>
                        <InputLabel style={{color: "var(--faded-text-color)", left: "-5px", top: "5px"}}>Value</InputLabel>
                        <Input style={{backgroundColor: "rgba(255, 255, 255, 0.10)", paddingLeft:"5px", height: "34px"}}
                               defaultValue={param.value}
                               onBlur={(event) => {editParamField("value", event.target.value)}}
                        />
                    </FormControl> : null
        }


    </Card>
}

export default ConfigureParamCard