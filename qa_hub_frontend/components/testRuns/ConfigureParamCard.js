import {Card, FormControl, Input, InputLabel, TextField} from "@mui/material";
import {useEffect, useState} from "react";

function ConfigureParamCard({param, index, params, setParams, paramTypes}) {
    const editParamField = (field, value) => {
        const newParams = params.slice()
        newParams[index] = {
            ...param,
            [field]: value
        }

        setParams(newParams)
    }

    return <Card style={{padding: "15px"}}>
        <div style={{display: "flex"}}>
            <FormControl>
                <InputLabel style={{color: "var(--faded-text-color)", left: "-5px", top: "3px"}}>Name</InputLabel>
                <Input style={{backgroundColor: "rgba(255, 255, 255, 0.10)", paddingLeft:"5px"}}
                       defaultValue={param.name}
                       onBlur={(event) => {editParamField("name", event.target.value)}}
                />
            </FormControl>
        </div>

    </Card>
}

export default ConfigureParamCard