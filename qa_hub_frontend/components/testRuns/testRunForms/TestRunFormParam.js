import Typography from "@mui/material/Typography";
import ParamTypes from "./ParamTypes";
import TextParam from "./paramTypes/TextParam";
import TextAreaParam from "./paramTypes/TextAreaParam";
import SelectParam from "./paramTypes/SelectParam";
import MultiSelectParam from "./paramTypes/MultiSelectParam";
import BooleanParam from "./paramTypes/BooleanParam";
import HelpIcon from "@mui/icons-material/Help";
import {useState, useEffect} from "react";
import {styled} from "@mui/material/styles";
import {Tooltip, tooltipClasses} from "@mui/material";
import StyledTooltip from "../../primitives/StyledTooltip";
function TestRunFormParam({param, index, params, setParams, props}) {
    const paramWidth = "700px"

    const [showHelp, setShowHelp] = useState(false)
    const setParamValue = (index, value) => {
        const newParams = params.slice()
        newParams[index].value = value

        setParams(newParams)
    }

    const DescriptionTooltip = styled(({ className, ...props }) => (
        <Tooltip {...props} classes={{ popper: className }} />
    ))({
        [`& .${tooltipClasses.tooltip}`]: {
            maxWidth: "500px",
            fontSize: "15px"
        },
    })

    return <div style={{display: "flex", alignItems: "center", width: "max-content", marginBottom: "25px"}} {...props}
                onMouseOver={() => {setShowHelp(true)}}
                onMouseLeave={() => {setShowHelp(false)}}
    >
        <div style={{width: "300px", display: "flex", justifyContent: "end"}}>
            <StyledTooltip title={param.name} maxWidth={'none'}>
                <Typography style={{position: "relative", top: "1px"}}>{param.name.cut(30)}</Typography>
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

        <div style={{minWidth: "100px"}}>
            {
                showHelp && param.description && <DescriptionTooltip title={param.description} placement="right">
                    <HelpIcon style={{marginLeft: "8px"}}></HelpIcon>
                </DescriptionTooltip>
            }
        </div>
    </div>

}

export default TestRunFormParam