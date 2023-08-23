import {
    Card,
    Checkbox,
    FormControl,
    FormControlLabel,
    Input,
    InputLabel,
    MenuItem,
    Select,
    TextareaAutosize,
    Radio
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import {customTheme} from "../../../../styles/CustomTheme";
import BooleanParamConfig from "./paramConfigs/BooleanParamConfig";
import TextParamConfig from "./paramConfigs/TextParamConfig";
import TextAreaParamConfig from "./paramConfigs/TextAreaParamConfig";
import SelectParamConfig from "./paramConfigs/SelectParamConfig";
import MultiSelectParamConfig from "./paramConfigs/MultiSelectParamConfig";
import MoreIconButton from "./MoreIconButton";
import {textAreaStyle} from "../../../../styles/TextAreaStyle";
import ParamTypes from "../ParamTypes";
import StyledSelect from "../../../primitives/StyledSelect";

function ConfigureParamCard({param, index, params, setParams, paramTypes}) {
    const paramRoles = ["testList", "skipTestList", "environment", "other"]
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

    return <Card style={{marginBottom: "20px", border: "1px solid gray", padding: "20px 20px 25px 20px", position: "relative"}}>

        <MoreIconButton params={params} setParams={setParams} index={index}/>

        <div style={{display: "flex", alignItems: "end", width: "max-content"}}>
            <FormControl style={{width: "300px"}}>
                <InputLabel style={{color: "white", left: "-5px", top: "7px"}}>Name</InputLabel>
                <Input style={{backgroundColor: customTheme.palette.background.input, paddingLeft:"5px", height: "36px", color: "white"}}
                       value={param.name}
                       onChange={(event) => {editParamField("name", event.target.value)}}
                />
            </FormControl>

            <FormControl style={{marginLeft: "15px", width: "170px"}}>
                <InputLabel style={{color: customTheme.palette.text.faded, position: "relative", top: "10px"}}>Type</InputLabel>
                <StyledSelect
                    value={paramTypes.find(type => type === param.type) || ''}
                    style={{backgroundColor: customTheme.palette.background.input}}
                    onChange={(event) => editParamField("type", event.target.value)}
                    size="small"
                >
                    {
                        (paramTypes).map(paramType => (
                            <MenuItem key={paramType} value={paramType}>{paramType}</MenuItem>
                        ))
                    }
                </StyledSelect>
            </FormControl>

            <FormControl style={{marginLeft: "15px", width: "170px"}}>
                <InputLabel style={{color: customTheme.palette.text.faded, position: "relative", top: "10px"}}>Role</InputLabel>
                <StyledSelect
                  value={paramRoles.find(role => role === param.role) || ''}
                  style={{backgroundColor: customTheme.palette.background.input}}
                  onChange={(event) => editParamField("role", event.target.value)}
                  size="small"
                >
                    {
                        (paramRoles).map(paramRole => (
                          <MenuItem key={paramRole} value={paramRole}>{paramRole}</MenuItem>
                        ))
                    }
                </StyledSelect>
            </FormControl>

            <IconButton style={{
                backgroundColor: customTheme.palette.error.main,
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
            (param.type === ParamTypes.TEXT) ?
                <TextParamConfig editParamField={editParamField} param={param}/>
            : (param.type === ParamTypes.TEXT_AREA) ?
                <TextAreaParamConfig editParamField={editParamField} param={param}/>
            : (param.type === ParamTypes.SELECT) ?
                <SelectParamConfig editParamField={editParamField} param={param}/>
            : (param.type === ParamTypes.MULTI_SELECT) ?
                <MultiSelectParamConfig editParamField={editParamField} param={param}/>
            : (param.type === ParamTypes.BOOLEAN) ?
                <BooleanParamConfig editParamField={editParamField} param={param}/>
            : null
        }
        <div style={{marginTop: "25px"}}>
            <label style={{fontSize: "11px", position: "relative", left: "8px", top: "-6px", color: customTheme.palette.text.faded}}>Description</label>
            <TextareaAutosize
                style={{...textAreaStyle, height: "46px", minHeight: "46px"}}
                label={"Value"}
                value={param.description}
                onChange={(event) => {editParamField("description", event.target.value)}}
            />
        </div>

        <div style={{display: "flex", marginTop: "10px"}}>
            <FormControlLabel control={
                                  <Checkbox checked={param.readOnly}
                                            onChange={(event) => {editParamField("readOnly", event.target.checked)}}
                                  />
                              }
                              label={
                                  <InputLabel style={{color: customTheme.palette.text.faded, left: "-5px", top: "1px"}}>ReadOnly</InputLabel>
                              }
            />
            <FormControlLabel control={
                                  <Checkbox checked={param.muted}
                                            onChange={(event) => {editParamField("muted", event.target.checked)}}
                                  />
                              }
                              label={
                                  <InputLabel style={{color: customTheme.palette.text.faded, left: "-5px", top: "1px"}}>Muted</InputLabel>
                              }
            />
        </div>
    </Card>
}

export default ConfigureParamCard