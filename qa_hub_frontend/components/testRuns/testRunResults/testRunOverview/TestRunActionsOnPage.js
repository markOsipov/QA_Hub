import {cancelTestRun, deleteTestRun, startRerun} from "../../../../requests/testRuns/TestRunRequests";
import StyledTooltip from "../../../primitives/StyledTooltip";
import CustomIconButton from "../../../primitives/CustomIconButton";
import {customTheme} from "../../../../styles/CustomTheme";
import ReplayIcon from "@mui/icons-material/Replay";
import StopIcon from "@mui/icons-material/Stop";
import DeleteIcon from "@mui/icons-material/Delete";
import {useRouter} from "next/router";
import {observer} from "mobx-react-lite";
import pushModalState from "../../../../state/testRuns/PushModalState";

const TestRunActionsOnPage = observer (({testRun, updateTestRunInfo, ...props}) => {
  const router = useRouter()

  const handleStartRerunClick = () => {
    pushModalState.open(testRun)
  }
  const handleDeleteTestRunClick = () => {
    if (confirm("This Testrun will be deleted. Are you sure?")) {
      deleteTestRun(testRun.testRunId).then(() => {
        router.push("/testRuns")
        alert(`Testun ${testRun.testRunId} has been deleted`)
      })
    }
  }

  const handleCancelTestRunClick = () => {
    if (confirm("This Testrun will be canceled. Are you sure?")) {
      cancelTestRun(testRun.testRunId).then(() => {
        updateTestRunInfo(testRun.testRunId)
      })
    }
  }

  return <div style={{display: 'flex', ...props.style}}>
    <StyledTooltip title={"Rerun"}>
      <div>
        <CustomIconButton
          action={handleStartRerunClick}
          color={customTheme.palette.text.disabled}
          icon={<ReplayIcon style={{transform: 'scaleX(-1) rotate(180deg)'}}/>}
        />
      </div>
    </StyledTooltip>


    {
      testRun.status === 'PROCESSING' &&
      <StyledTooltip title={"Cancel"}>
        <div>
          <CustomIconButton
            action={handleCancelTestRunClick}
            icon={<StopIcon/>}
          />
        </div>
      </StyledTooltip>
    }

    <StyledTooltip title={"Delete"}>
      <div>
        <CustomIconButton
          action={handleDeleteTestRunClick}
          color={customTheme.palette.error.main}
          icon={<DeleteIcon/>}
        />
      </div>
    </StyledTooltip>

  </div>
})

export default TestRunActionsOnPage