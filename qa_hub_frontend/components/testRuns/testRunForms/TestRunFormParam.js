import Typography from "@mui/material/Typography";
import ParamTypes from "./ParamTypes";
import TextParam from "./paramTypes/TextParam";
import TextAreaParam from "./paramTypes/TextAreaParam";
import SelectParam from "./paramTypes/SelectParam";
import MultiSelectParam from "./paramTypes/MultiSelectParam";
import BooleanParam from "./paramTypes/BooleanParam";
import HelpIcon from "@mui/icons-material/Help";
import {useState, useEffect} from "react";
import StyledTooltip from "../../primitives/StyledTooltip";
import {cut} from "../../../utils/Extensions";
import CustomIconButton from "../../primitives/CustomIconButton";
import {customTheme} from "../../../styles/CustomTheme";
import ClearIcon from "@mui/icons-material/Clear";
import LockIcon from "@mui/icons-material/Lock";
import CancelIcon from '@mui/icons-material/Cancel';
import BugReportIcon from '@mui/icons-material/BugReport';

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

        <div style={{display: 'flex', minWidth: "100px"}}>
            {/*<div style={{display: 'flex'}}>*/}
            {/*    {*/}
            {/*      param.role === "testList" && testRunId &&*/}
            {/*      <CustomIconButton*/}
            {/*        action={() => {}}*/}
            {/*        color={customTheme.palette.error.main}*/}
            {/*        icon={<BugReportIcon/>}*/}
            {/*      />*/}
            {/*    }*/}

            {/*    {*/}
            {/*      param.role === "testList" &&*/}
            {/*      <CustomIconButton*/}
            {/*        action={() => {}}*/}
            {/*        color={customTheme.palette.error.main}*/}
            {/*        icon={<LockIcon/>}*/}
            {/*      />*/}
            {/*    }*/}
            {/*</div>*/}
            <div>
                {
                  showHelp && param.description && <StyledTooltip title={param.description} placement="right">
                      <HelpIcon style={{marginLeft: "8px"}}></HelpIcon>
                  </StyledTooltip>
                }
            </div>
        </div>
    </div>

}

export default TestRunFormParam