import Typography from "@mui/material/Typography";
import ParamTypes from "../ParamTypes";
import TextParam from "../paramTypes/TextParam";
import TextAreaParam from "../paramTypes/TextAreaParam";
import SelectParam from "../paramTypes/SelectParam";
import MultiSelectParam from "../paramTypes/MultiSelectParam";
import BooleanParam from "../paramTypes/BooleanParam";
import HelpIcon from "@mui/icons-material/Help";
import {useState, useEffect} from "react";
import StyledTooltip from "../../../primitives/StyledTooltip";
import FormParamActions from "./FormParamActions";
import {cut} from "../../../../utils/Extensions";
import {customTheme} from "../../../../styles/CustomTheme";

function TestRunFormParam({param, index, params, setParams, props, testRunId}) {
    const paramWidth = "700px"

    const [showHelp, setShowHelp] = useState(false)
    const setParamValue = (index, value) => {
        const newParams = params.slice()
        newParams[index].value = value

        setParams(newParams)
    }

    return <div style={{display: "flex", alignItems: "center", width: "max-content", marginBottom: "25px"}} {...props}
                onMouseOver={() => {setShowHelp(true)}}
                onMouseLeave={() => {setShowHelp(false)}}
                onBlur={() => {setShowHelp(false)}}
    >
        <div style={{width: "300px", display: "flex", justifyContent: "end"}}>
            <StyledTooltip title={param.name.length > 30 ? param.name : ""} maxWidth={'none'}>
                <Typography style={{position: "relative", top: "1px", cursor: 'default'}}>{ cut(param.name, 30) }</Typography>
            </StyledTooltip>
        </div>
        <div style={{minWidth: "50%", marginLeft: "15px"}}>
            {
                (param.type === ParamTypes.TEXT) ?
                    <TextParam style={{width: paramWidth}} param={param} index={index} setParamValue={setParamValue} />
                    : (param.type === ParamTypes.TEXT_AREA) ?
                        <TextAreaParam style={{width: paramWidth}} param={param} index={index} setParamValue={setParamValue} />
                        : (param.type === ParamTypes.SELECT) ?
                            <SelectParam style={{width: paramWidth}} param={param} index={index} setParamValue={setParamValue} />
                            : (param.type === ParamTypes.MULTI_SELECT) ?
                                <MultiSelectParam style={{width: paramWidth}} param={param} index={index} setParamValue={setParamValue} />
                                : (param.type === ParamTypes.BOOLEAN) ?
                                    <BooleanParam style={{width: paramWidth}} param={param} index={index} setParamValue={setParamValue} />
                                    : null
            }
        </div>

        <div style={{display: 'flex', minWidth: "150px"}}>
            <FormParamActions param={param} testRunId={testRunId} index={index} setParamValue={setParamValue}/>
            <div>
                {
                  showHelp && param.description && <StyledTooltip title={param.description} placement="right">
                      <HelpIcon style={{marginLeft: "8px", color: customTheme.palette.text.disabled}}></HelpIcon>
                  </StyledTooltip>
                }
            </div>
        </div>
    </div>

}

export default TestRunFormParam