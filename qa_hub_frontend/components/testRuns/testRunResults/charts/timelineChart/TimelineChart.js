import {observer} from "mobx-react-lite";
import {customTheme} from "../../../../../styles/CustomTheme";
import Typography from "@mui/material/Typography";
import ComputerIcon from "@mui/icons-material/Computer";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import {Paper} from "@mui/material";
import {useEffect, useRef, useState} from "react";
import {secondsBetween} from "../../../../../utils/DateTimeUtils";
import {useRouter} from "next/router";
import TimelineElement from "./TimelineElement";
import {getTimelineData} from "../../../../../requests/testResults/TestResultsRequests";
import DurationChart from "../durationChart/DurationChart";
import StyledTextField from "../../../../primitives/StyledTextField";
import Pointer from "./Pointer";

const TimelineChart = observer(({...props}) => {
  const deviceBlockWidth = 370
  const deviceBlockMargin = 20

  const router = useRouter()
  const [timelineData, setTimelineData] = useState({})
  const [filter, setFilter] = useState("")

  const [hoveredTest, setHoveredTest] = useState(null)

  const [testRunIdHovered, setTestRunIdHovered] = useState(false)

  const [showPointer, setShowPointer] = useState(false)
  const [pointerCoordX, setPointerCoordX] = useState(0)
  const [pointerTitle, setPointerTitle] = useState({ })

  const startDate = timelineData.startDate
  const endDate = timelineData.endDate
  const duration = secondsBetween(startDate, endDate)

  useEffect(() => {
    const testRunId = router.query.testRunId
    if (testRunId) {
      getTimelineData(testRunId).then(response => {
        if (response.data) {
          setTimelineData(response.data)
        }
      })
    }
  }, [router.query.testRunId])


  if (!timelineData.runners) {
    return <>Loading</>
  }

  return <div style={{display: 'grid'}}>
    <Paper
      style={{
        display: 'grid',
        padding: '20px',
        margin: '15px 15px 0 15px',
        maxWidth: '100%',
        backgroundColor: customTheme.palette.background.default,
        ...props.style
      }}
    >
      <div style={{display: 'flex', marginBottom: '20px', alignItems: 'center'}}>
        <Typography variant={'h5'}>Timeline</Typography>
        <a href={window.location.href.split("/charts")[0]}>
          <Typography
            variant={'h5'}
            style={{
              color: testRunIdHovered ? 'white' : 'rgba(255, 255, 255, 0.4)', marginLeft: '8px'
            }}

            onMouseOver={() => setTestRunIdHovered(true)}
            onMouseLeave={() => setTestRunIdHovered(false)}
            onBlur={() => setTestRunIdHovered(false)}

          >#{router.query.testRunId}</Typography>
        </a>

        <StyledTextField value={filter}
                         size="small"
                         label="Filter"
                         style={{minWidth: "150px", color: "white", marginLeft: '15px'}}
                         onChange ={(event) => {
                          setFilter(event.target.value)
                         }}
        />
      </div>
      <div style={{position: 'relative'}}>
        {
          (timelineData.runners || []).map( (runnerInfo, index) => {
            return <div key={index} style={{marginTop: index > 0 ? '35px' : '0'}}>
              <div style={{display: 'flex', alignItems: 'center', marginBottom: '5px'}}>
                <ComputerIcon></ComputerIcon>
                <label style={{marginLeft: '5px'}}>{runnerInfo.runner}</label>
              </div>

              {
                runnerInfo.devices.map((deviceInfo, index) => {
                  return <div key={index} style={{display: 'flex', alignItems: 'center'}}>
                    <div style={{display: 'flex', alignItems: 'center', marginLeft: `${deviceBlockMargin}px`, width: `${deviceBlockWidth}px`}}>
                      <PhoneIphoneIcon></PhoneIphoneIcon>
                      <label style={{width: '350px', marginLeft: '5px'}}>{deviceInfo.deviceId}</label>
                    </div>

                    <div style={{width: '100%', margin: '10px 0', backgroundColor: 'rgba(255, 255, 255, 0.07)', height: '20px', position: 'relative'}}>
                      {
                        deviceInfo.results.map((result, index) => {
                          return (result.fullName.toLowerCase().includes(filter.toLowerCase()) || String(result.testcaseId).toLowerCase().includes(filter.toLowerCase())) &&
                            <TimelineElement
                              key={index}
                              startDate={startDate}
                              endDate={endDate}
                              duration={duration}
                              result={result}
                              hoveredTest={hoveredTest}
                              setHoveredTest={setHoveredTest}
                            />
                        })
                      }
                    </div>

                  </div>
                })
              }
            </div>

          })
        }
        {
          showPointer && <Pointer coordX={pointerCoordX} pointerTitle={pointerTitle}/>
        }

      </div>
      <div style={{display: 'flex'}}>
        <div style={{minWidth: `${deviceBlockMargin + deviceBlockWidth}px`}}></div>
        <ScaleX
          duration={duration}
          style={{opacity: '0.5', minHeight: '30px', paddingTop: '20px', paddingBottom: '20px'}}
          setPointerCoordX={setPointerCoordX}
          setShowPointer={setShowPointer}
          setPointerTitle={setPointerTitle}
        />
      </div>


    </Paper>
    <DurationChart timelineData={timelineData} hoveredTest={hoveredTest} setHoveredTest={setHoveredTest} filter={filter}/>
  </div>
})

const ScaleX = ({duration, elementWidth, setShowPointer, setPointerCoordX, setPointerTitle, ...props}) => {
  const ref = useRef(null)

  const handleMouseMove = (e) => {
    const xCoord = e.clientX - 34 //34 is magic number, adjusting pointer position to the cursor

    const relX = (e.clientX - ref.current.offsetLeft) / ref.current.clientWidth
    const time = Math.max(0, Number.parseInt(duration * relX))
    const untilEnd = duration - time

    setPointerTitle({
      time: time,
      untilEnd: untilEnd
    })

    setPointerCoordX(xCoord)
  }

  return <div
    {...props}
    style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      opacity: '0.7',
      ...props.style
    }}
    onMouseOver={() => {setShowPointer(true)}}
    onMouseLeave={() => {setShowPointer(false)}}
    onMouseMove={handleMouseMove}
    ref={ref}
  >

    <div
      style={{
        height: '10px',
        width: '100%',
        borderColor: customTheme.palette.text.faded,
        borderRight: '2px solid',
        borderLeft: '2px solid',
        borderTop: '2px solid',
        display: 'flex',
        overflow: 'visible',
      }}
    >
      <div
        style={{
          minWidth: '5px',
          borderRight: '1px solid',
          borderColor: customTheme.palette.text.faded,
          flexGrow: '1'
        }}>
      </div>
      <div
        style={{
          minWidth: '5px',
          borderLeft: '1px solid',
          borderColor: customTheme.palette.text.faded,
          flexGrow: '1'
        }}>
      </div>
    </div>

    <div style={{width: `100%`, height: 'max-content', position: 'relative', minHeight: '15px'}}>
      <div style={{ position: 'absolute', left: '-3px' }}>0</div>
      <div style={{ position: 'absolute', right: '0' }}>{duration}s</div>
      <div style={{ position: 'absolute', left: `calc(50% - ${String(Number.parseInt(duration / 2)).length * 4.2}px)` }}>{duration / 2}s</div>
    </div>
  </div>
}
export default TimelineChart