import {Box, Modal} from "@mui/material";
import Typography from "@mui/material/Typography";
import {modalStyle} from "../../../styles/ModalStyle";
import projectState from "../../../state/ProjectState";
import pushModalState from "../../../state/testRuns/PushModalState";
import {useEffect, useState} from "react";
import {getTestRunForm} from "../../../requests/testRuns/TestRunFormsRequests";
import {observer} from "mobx-react-lite";
import BranchSelector from "../testRunForms/BranchSelector";
import TestRunFormParam from "../testRunForms/TestRunFormParam";
import Button from "@mui/material/Button";
import {createNewTestRun} from "../../../requests/testRuns/TestRunRequests";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CustomIconButton from "../../primitives/CustomIconButton";
import {customTheme} from "../../../styles/CustomTheme";
import ClearIcon from "@mui/icons-material/Clear";


const PushTestRunModal = observer(() => {
  let {selectedProject} = projectState
  let {isOpen, testRun} = pushModalState

  const [paramConfigs, setParamConfigs] = useState([])
  const [params, setParams] = useState([])
  const [branch, setBranch] = useState("dev")

  const handleClose = () => {
    pushModalState.setIsOpen(!confirm("Close modal window?"));
  }

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
    if (testRun) {
      setBranch(testRun.config?.branch)
      setParams(paramConfigs
        .map(paramConfig => {
          let initialParamValue = testRun?.params?.find(param => param.name === paramConfig.name)?.value

          return {...paramConfig, value: initialParamValue || paramConfig.defaultValue}
        })
      )
    }
  }, [paramConfigs, testRun])

  if (!testRun) {
    return <Modal
      open={isOpen}
      onClose={handleClose}
    >
      <Box sx={{...modalStyle, minWidth: '550px'}}>
        Loading
      </Box>
    </Modal>
  }

  return <Modal
    open={isOpen}
    onClose={handleClose}
  >
    <Box sx={{...modalStyle, minWidth: '550px'}}>
      <Typography id="modal-modal-title" variant="h6" component="h2" style={{marginBottom: "20px"}}>
        Start new testrun
      </Typography>

      <BranchSelector project={selectedProject} branch={branch} setBranch={setBranch}/>

      {
        params.map((param, index) => {
          return <div  key={"param_" + index }>
            <TestRunFormParam param={param} index={index} params={params} setParams={setParams} testRunId={testRun?.testRunId}/>
          </div>
        })
      }

      <div style={{display: "flex", marginRight: '100px'}}>


        <div style={{flexGrow: "2"}}></div>

        <Button variant="contained"
                color="primary"
                size="small"
                onClick={() => {
                  createNewTestRun(selectedProject, branch, params)
                }}
                endIcon={<PlayArrowIcon />}
        >Start</Button>

        <CustomIconButton
          action={handleClose}
          color={customTheme.palette.error.main}
          icon={<ClearIcon/>}
        />
      </div>
    </Box>
  </Modal>
})

export default PushTestRunModal;