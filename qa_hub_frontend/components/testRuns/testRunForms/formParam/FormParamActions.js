import CustomIconButton from "../../../primitives/CustomIconButton";
import {customTheme} from "../../../../styles/CustomTheme";
import BugReportIcon from "@mui/icons-material/BugReport";
import LockIcon from "@mui/icons-material/Lock";
import {observer} from "mobx-react-lite";
import blockerState from "../../../../state/BlockerState";
import projectState from "../../../../state/ProjectState";
import {getTestResults} from "../../../../requests/testResults/TestResultsRequests";
import {useState} from "react";
import RefreshIcon from '@mui/icons-material/Refresh';
import StyledTooltip from "../../../primitives/StyledTooltip";
import Loader from "../../../common/Loader";
import {useRouter} from "next/router";

const FormParamActions = observer(({param, index, testRunId, setParamValue}) => {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const project = router.query.project
  const addBlockedTests = () => {
    setLoading(true)

    blockerState.updateBlockedTests(
      project,
      () => {
        setLoading(false)

        const blockedTests = blockerState.blockedTests
          .map(blockedTest => blockedTest.fullName)
          .join("\n")

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
      <StyledTooltip title={"Add failed tests"}>
        <div>
          <CustomIconButton
            action={addFailedTests}
            color={customTheme.palette.error.main}
            icon={<BugReportIcon/>}

          />
        </div>
      </StyledTooltip>
    }

    {
      param.role === "testList" &&
      <StyledTooltip title={"Add blocked tests"}>
        <div>
          <CustomIconButton
            action={addBlockedTests}
            color={customTheme.palette.error.main}
            icon={<LockIcon/>}
          />
        </div>
      </StyledTooltip>
    }

    {
      loading &&
      <Loader style={{marginLeft: '5px'}}/>
    }
  </div>
})

export default FormParamActions