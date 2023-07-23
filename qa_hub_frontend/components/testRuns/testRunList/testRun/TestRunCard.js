import {Paper} from "@mui/material";
import TextWithLabel from "../../../primitives/TextWithLabel";
import StatusBadge from "../../../primitives/StatusBadge";
import TimingsPlate from "./elements/TimingsPlate";
import GitEnvPlate from "./elements/GitEnvPlate";
import RunnersPlate from "./elements/RunnersPlate";
import TestResultsPlate from "./elements/TestResultsPlate";
import {customTheme} from "../../../../styles/CustomTheme";
import {useRouter} from "next/router";
import {useState} from "react";
export default function TestRunCard({testRun, ...props }) {
  function getProgressBarWidth() {
    return Math.max(window.innerWidth * 0.15, 200)
  }

  const router = useRouter()
  const [progressBarWidth, setProgressBarWidth] = useState(getProgressBarWidth())
  const opacity = 0.7

  const [isHovering, setIsHovered] = useState(false);
  const onMouseEnter = () => setIsHovered(true);
  const onMouseLeave = () => setIsHovered(false);
  function handleResize() {
    setProgressBarWidth(getProgressBarWidth())
  }

  const handleTestRunCardClick = () => {
    router.push(`/testRuns/${testRun.testRunId}`)
  }

  window.addEventListener('resize', handleResize)

  return <Paper style={{ padding: '15px', ...props.style, backgroundColor: isHovering ? 'rgba(255, 255, 255, 0.095)' : customTheme.palette.background.paper }}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onClick={handleTestRunCardClick}
  >
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ marginTop: "10px", display: "flex", alignItems: 'center' }}>
        <TextWithLabel
          value={testRun.testRunId}
          label={'testRunId'}
          labelStyle={{ justifySelf: 'center'}}
          style={{fontSize: "15px", width: "min-content", padding: "5px 6px", minHeight: 'unset'}}
        />
        <StatusBadge label={testRun.status} style={{ marginLeft: "10px"}}/>
      </div>

      <div style={{display: 'flex', marginTop: '45px'}}>

        <TimingsPlate testRun={testRun}
                      style={{
                        display: 'grid',
                        alignItems: 'end',
                        justifyItems: 'start',
                        position: 'relative',
                        opacity: opacity
                      }}

        />
        <div style={{display: 'flex', minWidth: '450px', position: 'relative', flexGrow: '2', justifyContent: 'center'}}>
          <TestResultsPlate testRun={testRun} progressBarWidth={progressBarWidth} style={{ minWidth: `${progressBarWidth + 185}px`}}/>
          <RunnersPlate testRun={testRun} style={{minWidth: '300px', marginLeft: '20px',  opacity: opacity}} />
        </div>

        <div style={{display: 'grid', justifyItems: 'end',  position: 'relative',  opacity: opacity, marginRight: '10px'}}>
          <GitEnvPlate testRun={testRun} style={{opacity: opacity}}/>
        </div>
      </div>
    </div>
  </Paper>
}