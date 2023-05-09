import {observer} from "mobx-react-lite";
import projectState from "../../../state/ProjectState";
import {Paper} from "@mui/material";
import {useState, useEffect} from "react";
import {getTestRunForm} from "../../../requests/TestRunFormsRequests";
import Typography from "@mui/material/Typography";
import EditTestRunFormModal from "./configure/EditTestRunFormModal";
import Button from "@mui/material/Button";
import TextParam from "./paramTypes/TextParam";
import TextAreaParam from "./paramTypes/TextAreaParam";
import SelectParam from "./paramTypes/SelectParam";
import BooleanParam from "./paramTypes/BooleanParam";
import MultiSelectParam from "./paramTypes/MultiSelectParam";
import ParamTypes from "./ParamTypes";
import StyledAccordionSummary from "../../primitives/StyledAccordeonSummary";
import {Accordion, AccordionDetails, AccordionSummary, Box, Card} from "@mui/material";

const TestRunForm = observer(() => {
    let {selectedProject} = projectState

    const [isEditTestRunFormModalOpen, setIsEditTestRunFormModalOpen] = useState(false);
    const [paramConfigs, setParamConfigs] = useState([])
    const [params, setParams] =  useState([])

    function loadTestRunForm() {
        getTestRunForm(selectedProject).then(response => {
            if (response.data?.params) {
                setParamConfigs(response.data?.params)
            }
        })
    }

    const setParamValue = (index, value) => {
        const newParams = params.slice()
        newParams[index].value = value

        setParams(newParams)
    }

    useEffect(() => {
        loadTestRunForm()
    }, [selectedProject])

    useEffect(() => {
        setParams(paramConfigs
            .filter(paramConfig => !paramConfig.muted)
            .map(paramConfig => {
                return {...paramConfig, value: paramConfig.defaultValue}
            })
        )
    }, [paramConfigs])

    const handleEditFormClick = () => {
        setIsEditTestRunFormModalOpen(true)
    }

    return <Paper style={{padding: "15px"}}>
        <EditTestRunFormModal isOpen={isEditTestRunFormModalOpen} setIsOpen={setIsEditTestRunFormModalOpen} params={paramConfigs} loadTestRunForm={loadTestRunForm}/>

        <Accordion>
            <StyledAccordionSummary
                style={{maxWidth: "min-content"}}
                aria-controls="panel1a-content"
            >
                <Typography variant="h5" style={{width: "max-content"}}>Start new testrun</Typography>
            </StyledAccordionSummary>

            <AccordionDetails style={{marginTop: "20px"}}>
                {
                    paramConfigs.length === 0 ? <Typography>No params configured for this project</Typography> : null
                }
                {
                    params.map((param, index) => {
                        const paramWidth = "700px"

                        return <div style={{display: "flex", alignItems: "center", width: "max-content", marginBottom: "25px"}} key={"param_" + param.name}>
                            <div style={{width: "300px", display: "flex", justifyContent: "end"}}>
                                <Typography style={{position: "relative", top: "1px"}}>{param.name}</Typography>
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
                        </div>
                    })
                }

                    <Button variant="contained"
                            color="error"
                            size="small"
                            onClick={handleEditFormClick}
                            style={{margin: "12px 8px 0 8px"}}
                    >Configure</Button>
                </AccordionDetails>
            </Accordion>
    </Paper>
})

export default TestRunForm