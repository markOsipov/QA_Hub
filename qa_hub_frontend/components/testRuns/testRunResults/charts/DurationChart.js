import {observer} from "mobx-react-lite";
import {useEffect, useState} from "react";
import {Paper} from "@mui/material";
import {customTheme} from "../../../../styles/CustomTheme";
import Typography from "@mui/material/Typography";
import {getDateTime} from "../../../../utils/DateTimeUtils";
import StyledTooltip from "../../../primitives/StyledTooltip";

const DurationChart = observer(({timelineData, hoveredTest, setHoveredTest}) => {
  const SortOptions = {
    duration: "duration"
  }

  const [durationInfo, setDurationInfo] = useState([])
  const [maxDuration, setMaxDuration] = useState(0)
  const [sort, setSort] = useState(SortOptions.duration)
  const [sortDirection, setSortDirection] = useState(-1)

  useEffect(() => {
    let results = []

    if (timelineData.runners !== null) {
      timelineData.runners.forEach(runner => {
        runner.devices.forEach(device => {
          const saturatedResults = device.results.map(result => {
            return {
              ...result,
              deviceId: device.deviceId,
              runner: runner.runner
            }
          })

          results = results.concat(saturatedResults)
        })
      })
    }

    setDurationInfo(sortResults(results, sort, sortDirection))
    setMaxDuration(sortResults(results, SortOptions.duration, 1)[0].duration)

  }, [timelineData])

  const sortResults = (results, sortField, sortDirection) => {
    return results.sort( (a, b) => {
      let sortRes = 0
      if (a[sortField] > b[sortField] ) {
        sortRes = -1
      } else if (a[sortField] < b[sortField] ) {
        sortRes = 1
      }

      return sortRes * sortDirection
    })
  }

  return <Paper style={{padding: '10px', margin: '15px'}}>
    <Typography variant={'h5'}>Duration chart</Typography>
    <div style={{display: 'flex'}}>
      <div style={{flexGrow: '0.9'}}></div>

      <Scale
        maxDuration={maxDuration}
        style ={{
          marginRight: '10px',
          height: '350px'
        }}
      />
      <div
        style={{
          display: 'flex',
          minHeight: '350px',
          maxWidth: '85vw',
          overflowX: 'auto',
          position: 'relative',

        }}
      >

        <div style={{display: 'flex', minHeight: '350px', width: 'max-content', alignItems: 'baseline'}}>
          {
            durationInfo.map((durationElement, index) => {
              return <DurationElement
                key={index}
                durationElement={durationElement}
                maxDuration={maxDuration}
                hoveredTest={hoveredTest}
                setHoveredTest={setHoveredTest}
              />
            })
          }
        </div>
      </div>
    </div>

  </Paper>
})

const DurationElement = ({durationElement, hoveredTest, setHoveredTest, maxDuration, ...props}) => {
  const DurationElementTooltip = () => {
    return <div style={{display: 'grid'}}>
      <label style={{fontWeight: 'bold'}}>{durationElement.fullName}</label>

      <div style={{display: 'grid', marginTop: '10px'}}>
        <div style={{display: 'flex'}}>
          <label>Runner:</label>
          <label style={{marginLeft: '10px', color: 'rgba(255, 255, 255, 0.5)'}}>{durationElement.runner}</label>
        </div>

        <div style={{display: 'flex'}}>
          <label style={{marginLeft: '3px'}}>Device:</label>
          <label style={{marginLeft: '10px', color: 'rgba(255, 255, 255, 0.5)'}}>{durationElement.deviceId}</label>
        </div>

        <div style={{display: 'flex', marginTop: '10px'}}>
          <label style={{marginLeft: '1px'}}>Started:</label>
          <label style={{marginLeft: '10px', color: 'rgba(255, 255, 255, 0.5)'}}>{getDateTime(durationElement.startDate)}</label>
        </div>

        <div style={{display: 'flex'}}>
          <label style={{marginLeft: '5px'}}>Ended:</label>
          <label style={{marginLeft: '10px', color: 'rgba(255, 255, 255, 0.5)'}}>{getDateTime(durationElement.endDate)}</label>
        </div>

        <label style={{marginTop: '10px'}}>Duration: {Number.parseInt(durationElement.duration)}s</label>
      </div>

      <label style={{marginTop: '10px'}}>Retry: {durationElement.retry}</label>
    </div>
  }


  return <StyledTooltip
    maxWidth={'800px'}
    title={<DurationElementTooltip />}
  >
    <div
      style={{
        width: '10px',
        height: (durationElement.duration / maxDuration * 100 ) + '%',
        backgroundColor: durationElement.status === 'SUCCESS' ? customTheme.palette.success.main : customTheme.palette.error.main,
        ...props.style
      }}
      onMouseOver={() => setHoveredTest(durationElement.fullName)}
      onMouseLeave={() => setHoveredTest(null)}
      onBlur={() => setHoveredTest(null)}
    >
      {
        hoveredTest === durationElement.fullName &&
        <div style={{ width: '100%', height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.5)' }}/>
      }
    </div>
  </StyledTooltip>
}

const Scale = ({maxDuration, ...props}) => {
  return <div
    style={{
      display: 'flex',
      ...props.style
    }}
  >
    <div style={{height: '100%', width: 'max-content', position: 'relative'}}>
      <div style={{ position: 'absolute', top: '-8px', right: '5px' }}>{Number.parseInt(maxDuration)}s</div>
      <div style={{ position: 'absolute', top: 'calc(50% - 10px)', right: '5px' }}>{Number.parseInt(maxDuration / 2)}s</div>
    </div>
    <div
      style={{
        height: '100%',
        minWidth: '10px',
        maxWidth: '10px',
        borderColor: customTheme.palette.text.faded,
        borderRight: '2px solid',
        borderBottom: '2px solid',
        borderTop: '2px solid',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'visible'
      }}
    >
      <div
        style={{
          minWidth: '5px',
          borderBottom: '1px solid',
          borderColor: customTheme.palette.text.faded,
          flexGrow: '1'
        }}>
      </div>
      <div
        style={{
          minWidth: '5px',
          borderTop: '1px solid',
          borderColor: customTheme.palette.text.faded,
          flexGrow: '1'
        }}>
      </div>
    </div>
  </div>
}

export default DurationChart