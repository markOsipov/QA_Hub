import CustomIconButton from "../../../primitives/CustomIconButton";
import {customTheme} from "../../../../styles/CustomTheme";
import BugReportIcon from "@mui/icons-material/BugReport";
import LockIcon from "@mui/icons-material/Lock";
import {observer} from "mobx-react-lite";
import blockerState from "../../../../state/BlockerState";
import projectState from "../../../../state/ProjectState";
import {getTestResults} from "../../../../requests/testResults/TestResultsRequests";
import {useEffect, useState} from "react";
import RefreshIcon from '@mui/icons-material/Refresh';

const FormParamActions = observer(({param, index, testRunId, setParamValue}) => {
  const [loading, setLoading] = useState(false)
  const addBlockedTests = () => {
    setLoading(true)

    blockerState.updateBlockedTests(
      projectState.selectedProject,
      () => {
        setLoading(false)

        const blockedTests = blockerState.blockedTests
          .map(blockedTest => blockedTest.fullName)
          .join(", \n")

        setParamValue(index, blockedTests)
      }
    )
  }

  const addFailedTests = () => {
    setLoading(true)

    const filter = {
      statuses: ["FAILURE", "PROCESSING", "WAITING"]
    }

    getTestResults(testRunId, filter, 0, 0).then((response) => {
      setLoading(false)

      if (response?.data) {
        const failedTests = response.data
          .map(testResult => testResult.fullName)
          .join(", \n")

        setParamValue(index, failedTests)
      }
    })
  }

  return <div style={{display: 'flex', position: 'relative', top: '-2px'}}>
    {
      param.role === "testList" && testRunId &&
      <CustomIconButton
        action={addFailedTests}
        color={customTheme.palette.error.main}
        icon={<BugReportIcon/>}
      />
    }

    {
      param.role === "testList" &&
      <CustomIconButton
        action={addBlockedTests}
        color={customTheme.palette.error.main}
        icon={<LockIcon/>}
      />
    }

    {
      loading &&
      <RefreshIcon style={{
        animation: "rotation 1.2s linear infinite",
        fontSize: '25px',
        color: customTheme.palette.text.faded,
        marginLeft: '5px'

      }}></RefreshIcon>
    }
  </div>
})

export default FormParamActions