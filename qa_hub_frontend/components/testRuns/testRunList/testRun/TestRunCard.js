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
export default function TestRunCard({testRun, filter, filterAndLoad, ...props }) {
  const opacity = 0.6
  function getProgressBarWidth() {
    return Math.max(window.innerWidth * 0.2, 200)
  }

  const router = useRouter()
  const [progressBarWidth, setProgressBarWidth] = useState(getProgressBarWidth())


  const [isHovering, setIsHovered] = useState(false);
  const onMouseEnter = () => setIsHovered(true);
  const onMouseLeave = () => setIsHovered(false);
  function handleResize() {
    setProgressBarWidth(getProgressBarWidth())
  }

  const handleTestRunCardClick = () => {
     window.location.href = `/testRuns/${testRun.testRunId}`

     //router.push(`testRuns/${testRun.testRunId}`) //got a bug, changes URL but doesn't render the new page
  }

  window.addEventListener('resize', handleResize)

  const filterByStatus = () => {
    const statuses = filter.statuses || []
    if (statuses.includes(testRun.status)) {
      statuses.pop(testRun.status)
    } else {
      statuses.push(testRun.status)
    }

    const newFilterValue = {
      ...filter,
      statuses: statuses
    }

    filterAndLoad(newFilterValue)
  }

  return <Paper style={{ padding: '15px', ...props.style,  }}>
    <div style={{ display: "flex", width: '100%'}}>
      <div style={{display: 'grid', minWidth: '311px'}}>
        <div
          style={{
            marginTop: "10px",
            display: "flex",
            alignItems: 'center',
            width: 'min-content'
          }}
        >
          <TextWithLabel
            value={testRun.testRunId}
            label={'testRunId'}
            labelStyle={{ justifySelf: 'center', cursor: 'pointer'}}
            valueStyle={{cursor: 'pointer'}}
            style={{
              fontSize: "15px",
              width: "min-content",
              padding: "5px 6px",
              minHeight: 'unset',
              backgroundColor: isHovering ? 'rgba(255, 255, 255, 0.07)' : customTheme.palette.background.paper,
              cursor: 'pointer'
            }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={handleTestRunCardClick}
          />
          <StatusBadge
            label={testRun.status}
            style={{ marginLeft: "10px", cursor: 'pointer'}}
            onClick={filterByStatus}
          />
        </div>

        <TimingsPlate testRun={testRun}
                      style={{
                        display: 'grid',
                        alignItems: 'end',
                        justifyItems: 'start',
                        position: 'relative',
                        marginTop: '45px',
                        opacity: opacity
                      }}
        />
      </div>

      <div style={{display: 'flex', width: '100%'}}>
        <div style={{flexGrow: '1'}}></div>
        <div style={{display: 'flex', flexGrow: '1', position: 'relative', top: '11px'}}>
          <div style={{display: 'flex', alignItems: 'center', marginLeft: '20px', flexGrow: '1.4'}}>
            <div style={{display: 'flex', minWidth: '450px', position: 'relative',  justifyContent: 'start'}}>
              <TestResultsPlate testRun={testRun} progressBarWidth={progressBarWidth} style={{ minWidth: `${progressBarWidth + 185}px`}}/>
              <RunnersPlate testRun={testRun} style={{minWidth: '300px',  opacity: opacity}} />
            </div>
          </div>

          <div style={{display: 'grid', justifyItems:'end', width: '40%', minWidth: '470px'}}>
            <GitEnvPlate testRun={testRun} filter={filter} filterAndLoad={filterAndLoad} style={{marginRight: '8px', marginLeft: '15px', }}/>
          </div>

        </div>
      </div>

    </div>
  </Paper>
}