import {observer} from "mobx-react-lite";
import projectState from "../../../state/ProjectState";
import {FormControl, Input, Paper} from "@mui/material";
import {useState, useEffect} from "react";
import {getTestRunForm} from "../../../requests/testRuns/TestRunFormsRequests";
import Typography from "@mui/material/Typography";
import EditTestRunFormModal from "./configure/EditTestRunFormModal";
import Button from "@mui/material/Button";
import StyledAccordionSummary from "../../primitives/StyledAccordeonSummary";
import {Accordion, AccordionDetails, } from "@mui/material";
import "../../../utils/Extensions";
import TestRunFormParam from "./formParam/TestRunFormParam";
import SettingsIcon from '@mui/icons-material/Settings';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import {createNewTestRun} from "../../../requests/testRuns/TestRunRequests";
import TextParam from "./paramTypes/TextParam";
import {customTheme} from "../../../styles/CustomTheme";
import StyledTooltip from "../../primitives/StyledTooltip";
import ParamTypes from "./ParamTypes";
import TextAreaParam from "./paramTypes/TextAreaParam";
import SelectParam from "./paramTypes/SelectParam";
import MultiSelectParam from "./paramTypes/MultiSelectParam";
import BooleanParam from "./paramTypes/BooleanParam";
import HelpIcon from "@mui/icons-material/Help";
import BranchSelector from "./BranchSelector";

const TestRunForm = observer(() => {
    let {selectedProject} = projectState

    const [isEditTestRunFormModalOpen, setIsEditTestRunFormModalOpen] = useState(false);
    const [paramConfigs, setParamConfigs] = useState([])
    const [params, setParams] =  useState([])
    const [branch, setBranch] =  useState("dev")

    function loadTestRunForm() {
        getTestRunForm(selectedProject).then(response => {
            if (response.data?.params) {
                setParamConfigs(response.data?.params)
            }
        })
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

    return <Paper>
        <EditTestRunFormModal isOpen={isEditTestRunFormModalOpen} setIsOpen={setIsEditTestRunFormModalOpen} params={paramConfigs} loadTestRunForm={loadTestRunForm}/>

        <Accordion>
            <StyledAccordionSummary
                style={{maxWidth: "min-content"}}
                aria-controls="panel1a-content"
            >
                <Typography variant="h5" style={{width: "max-content"}}>Start new testrun</Typography>
            </StyledAccordionSummary>

            <AccordionDetails style={{marginTop: "20px", maxWidth: "1048px"}}>
                <BranchSelector project={selectedProject} branch={branch} setBranch={setBranch}/>
                {
                    params.map((param, index) => {
                        return <TestRunFormParam key={"param_" + index } param={param} index={index} params={params} setParams={setParams} />
                    })
                }

                <div style={{display: "flex"}}>
                    <Button variant="contained"
                            color="error"
                            size="small"
                            onClick={handleEditFormClick}
                            startIcon={<SettingsIcon />}
                    >Configure</Button>

                    <div style={{flexGrow: "2"}}></div>

                    <Button variant="contained"
                            color="primary"
                            size="small"
                            onClick={() => {
                                createNewTestRun(selectedProject, branch, params)
                            }}
                            endIcon={<PlayArrowIcon />}
                    >Start</Button>

                </div>
            </AccordionDetails>
        </Accordion>
    </Paper>
})

export default TestRunForm