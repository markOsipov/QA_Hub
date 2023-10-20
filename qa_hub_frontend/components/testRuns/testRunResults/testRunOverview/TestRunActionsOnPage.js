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
import Button from "@mui/material/Button";
import projectIntegrationsState from "../../../../state/integrations/ProjectIntegrationsState";
import GitHubIcon from '@mui/icons-material/GitHub';
import BarChartIcon from '@mui/icons-material/BarChart';
import testRunId from "../../../../pages/projects/[project]/testRuns/[testRunId]";

const TestRunActionsOnPage = observer (({testRun, updateTestRunInfo, ...props}) => {
  const router = useRouter()

  const tmsType = projectIntegrationsState.tmsInt?.projectTmsInfo?.type
  const cicdType = projectIntegrationsState.cicdInt?.projectCicdInfo?.type

  const handleStartRerunClick = () => {
    pushModalState.open(testRun)
  }
  const handleDeleteTestRunClick = () => {
    if (confirm("This Testrun will be deleted. Are you sure?")) {
      deleteTestRun(testRun.testRunId).then(() => {
        window.location.href = `/projects/${testRun.project}/testRuns`
        alert(`Testrun ${testRun.testRunId} has been deleted`)
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
    {
      testRun.allureLaunchId && tmsType &&

      <StyledTooltip title={`Testrun in ${tmsType}`}>
        <div style={{marginLeft: '5px'}}>
          <Button
            href={`${projectIntegrationsState.tmsInt.launchUrl}/${testRun.allureLaunchId}`}
            target={'_blank'}
            variant={'contained'}
            size="small"
            style={{
              height: '25px',
              backgroundColor: tmsType === 'Allure' ? customTheme.palette.integrations.allure : customTheme.palette.primary.main
          }}
          >{ tmsType }</Button>
        </div>
      </StyledTooltip>
    }

    {
      testRun.cicdJobId && cicdType &&

      <StyledTooltip title={`Job in ${cicdType}`}>
        <div style={{marginLeft: '5px'}}>
          <Button
            href={`${projectIntegrationsState.cicdInt.jobUrl}/${testRun.cicdJobId}`}
            target={'_blank'}
            variant={'contained'}
            size="small"
            style={{
              height: '25px',
              backgroundColor: cicdType === 'GitHub' ? customTheme.palette.integrations.gitHub : customTheme.palette.primary.main
            }}
            startIcon={ cicdType === 'GitHub' && <GitHubIcon />}
          >{ cicdType }</Button>
        </div>
      </StyledTooltip>
    }

    <StyledTooltip title={`Charts`}>
      <div style={{marginLeft: '5px'}}>
        <Button
          href={`/projects/${testRun.project}/testRuns/${testRun.testRunId}/charts`}
          target={'_blank'}
          variant={'contained'}
          size="small"
          style={{
            height: '25px',
            backgroundColor: customTheme.palette.primary.main
          }}
          startIcon={ <BarChartIcon />}
        >Charts</Button>
      </div>
    </StyledTooltip>

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