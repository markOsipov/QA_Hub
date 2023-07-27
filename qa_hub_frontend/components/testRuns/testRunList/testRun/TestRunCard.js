import {Paper} from "@mui/material";
import TextWithLabel from "../../../primitives/TextWithLabel";
import StatusBadge from "../../../primitives/StatusBadge";
import TimingsPlate from "./elements/timings/TimingsPlate";
import TestResultsPlate from "./elements/TestResultsPlate";
import {customTheme} from "../../../../styles/CustomTheme";
import {useRouter} from "next/router";
import {useState} from "react";
import TestRunConfig from "../../testRunResults/testRunOverview/TestRunConfig";
export default function TestRunCard({testRun, filter, filterAndLoad, ...props }) {
  const opacity = 0.6

  const router = useRouter()

  const progressBarWidth = Math.max(window.innerWidth * 0.2, 200)

  const [isHovering, setIsHovered] = useState(false);
  const onMouseEnter = () => setIsHovered(true);
  const onMouseLeave = () => setIsHovered(false);


  const handleTestRunCardClick = () => {
     window.location.href = `/testRuns/${testRun.testRunId}`

     //router.push(`testRuns/${testRun.testRunId}`) //got a bug, changes URL but doesn't render the new page
  }

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
    <div style={{ display: "flex", width: '100%', position: 'relative'}}>
      <div style={{display: 'grid', minWidth: '340px'}}>
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

      {/*<div style={{flexGrow: '1.1', maxWidth: '15%'}}></div>*/}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'end',
          alignItems: 'center',
          marginLeft: '50px',
          position: 'relative',
          left: `calc(50% - ${progressBarWidth * 2 + 100}px)`
        }}
      >
        <TestResultsPlate testRun={testRun} progressBarWidth={progressBarWidth} style={{minWidth: `${progressBarWidth + 170}px`, marginTop: '20px', position: 'relative', top: '-9px'}}/>

        {
          testRun.config !== null &&
          <TestRunConfig testRun={testRun} style={{marginLeft: '80px', position: 'relative', top: '13px'}}/>
        }
      </div>
    </div>
  </Paper>
}