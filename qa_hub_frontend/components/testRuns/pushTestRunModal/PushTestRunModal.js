import {Box, Modal} from "@mui/material";
import Typography from "@mui/material/Typography";
import {modalStyle} from "../../../styles/ModalStyle";
import pushModalState from "../../../state/testRuns/PushModalState";
import {useEffect, useState} from "react";
import {getTestRunForm} from "../../../requests/testRuns/TestRunFormsRequests";
import {observer} from "mobx-react-lite";
import BranchSelector from "../testRunForms/BranchSelector";
import TestRunFormParam from "../testRunForms/formParam/TestRunFormParam";
import Button from "@mui/material/Button";
import {createNewTestRun} from "../../../requests/testRuns/TestRunRequests";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CustomIconButton from "../../primitives/CustomIconButton";
import {customTheme} from "../../../styles/CustomTheme";
import ClearIcon from "@mui/icons-material/Clear";
import alertState from "../../../state/AlertState";
import axios from "axios";


const PushTestRunModal = observer(({reloadTestRuns}) => {
  let {isOpen, testRun, useSelectedTests, selectedTests} = pushModalState

  const [paramConfigs, setParamConfigs] = useState([])
  const [params, setParams] = useState([])
  const [branch, setBranch] = useState("dev")

  const handleClose = () => {
    pushModalState.setIsOpen(!confirm("Close modal window?"));
  }

  const handleStartNewTestRunClick = () => {
    createNewTestRun(testRun.project, branch, params)
      .then(() => {
        alertState.showAlert("New testrun has started", "success")

        if (reloadTestRuns) {
          reloadTestRuns()
        }

        pushModalState.setIsOpen(false)
      })
      .catch((err) => {
        let message = "Failed to start new testrun"
        let errorBody = err.response?.data

        alertState.showAlert(message, "error")
        if (errorBody) {
          console.log(message + ":\n" + JSON.stringify(errorBody, null, 2))
        }
      })
  }

  function loadTestRunForm() {
    getTestRunForm(testRun.project).then(response => {
      if (response.data?.params) {
        setParamConfigs(response.data?.params)
      }
    })
  }

  useEffect(() => {
    if (testRun != null) {
      loadTestRunForm()
    }
  }, [testRun])

  useEffect(() => {
    if (testRun) {
      setBranch(testRun.config?.branch)
      setParams(paramConfigs
        .map(paramConfig => {
          let initialParamValue = testRun?.params?.find(param => param.name === paramConfig.name)?.value

          if (useSelectedTests && paramConfig.role === 'testList') {
            initialParamValue = selectedTests.join("\n")
          }

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
      <Box sx={{...modalStyle, minWidth: '650px'}}>
        Loading
      </Box>
    </Modal>
  }

  return <Modal
    open={isOpen}
    onClose={handleClose}
  >
    <Box sx={{...modalStyle, minWidth: '650px'}}>
      <Typography id="modal-modal-title" variant="h6" component="h2" style={{marginBottom: "20px"}}>
        Start new testrun
      </Typography>

      <BranchSelector project={testRun.project} branch={branch} setBranch={setBranch}/>

      {
        params.map((param, index) => {
          return <div  key={"param_" + index }>
            <TestRunFormParam param={param} index={index} params={params} setParams={setParams} testRunId={testRun?.testRunId}/>
          </div>
        })
      }

      <div style={{display: "flex", marginRight: '150px'}}>


        <div style={{flexGrow: "2"}}></div>

        <Button variant="contained"
                color="primary"
                size="small"
                onClick={handleStartNewTestRunClick}
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