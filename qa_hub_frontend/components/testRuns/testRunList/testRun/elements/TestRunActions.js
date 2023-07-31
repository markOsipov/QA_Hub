import StopIcon from "@mui/icons-material/Stop";
import {customTheme} from "../../../../../styles/CustomTheme";
import DeleteIcon from "@mui/icons-material/Delete";
import {cancelTestRun, deleteTestRun, startRerun} from "../../../../../requests/testRuns/TestRunRequests";
import CustomIconButton from "../../../../primitives/CustomIconButton";
import StyledTooltip from "../../../../primitives/StyledTooltip";
import ReplayIcon from '@mui/icons-material/Replay';
export default function TestRunActions({testRun, filter, filterAndLoad, ...props}) {
  const handleStartRerunClick = () => {
    startRerun(testRun.testRunId).then(() => {
      filterAndLoad(filter)
    })
  }
  const handleDeleteTestRunClick = () => {
    if (confirm("This Testrun will be deleted. Are you sure?")) {
      deleteTestRun(testRun.testRunId).then(() => {
        filterAndLoad(filter)
      })
    }
  }

  const handleCancelTestRunClick = () => {
    if (confirm("This Testrun will be canceled. Are you sure?")) {
      cancelTestRun(testRun.testRunId).then(() => {
        filterAndLoad(filter)
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
}