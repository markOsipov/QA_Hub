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
import BranchSelector from "./BranchSelector";
import alertState from "../../../state/AlertState";
import {useRouter} from "next/router";

const TestRunForm = observer(({reloadTestRuns}) => {
    const router = useRouter()
    let project = router.query.project

    const [isEditTestRunFormModalOpen, setIsEditTestRunFormModalOpen] = useState(false);
    const [paramConfigs, setParamConfigs] = useState([])
    const [params, setParams] =  useState([])
    const [branch, setBranch] =  useState("dev")

    function loadTestRunForm() {
        getTestRunForm(project).then(response => {
            if (response.data?.params) {
                setParamConfigs(response.data?.params)
            }
        })
    }

    useEffect(() => {
        loadTestRunForm()
    }, [project])

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

    const handleStartNewTestRunClick = () => {
        createNewTestRun(project, branch, params).then(() => {
            reloadTestRuns()
            alertState.showAlert("New testrun has started", "success")
        }).catch((err) => {
            let message = "Failed to start new testrun"
            let errorBody = err.response?.data

            alertState.showAlert(message, "error")
            if (errorBody) {
                console.log(message + ":\n" + JSON.stringify(errorBody, null, 2))
            }
        })
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
                <BranchSelector project={project} branch={branch} setBranch={setBranch}/>
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
                            onClick={handleStartNewTestRunClick}
                            endIcon={<PlayArrowIcon />}
                    >Start</Button>

                </div>
            </AccordionDetails>
        </Accordion>
    </Paper>
})

export default TestRunForm