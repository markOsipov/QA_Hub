import {observer} from "mobx-react-lite";
import {useEffect, useState} from "react";
import {getTimelineData} from "../../../../../requests/testResults/TestResultsRequests";
import testRunId from "./index";
import {useRouter} from "next/router";
import {daysBetween, getDateTime, getTimeSeconds, secondsBetween} from "../../../../../utils/DateTimeUtils";
import {customTheme} from "../../../../../styles/CustomTheme";
import StyledTooltip from "../../../../../components/primitives/StyledTooltip";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import ComputerIcon from "@mui/icons-material/Computer";
import {Paper} from "@mui/material";
import Typography from "@mui/material/Typography";

const TestrunChartsPage = observer(() => {
  const router = useRouter()

  const [timelineData, setTimelineData] = useState({})
  const [hoveredTest, setHoveredTest] = useState(null)

  const [testRunIdHovered, setTestRunIdHovered] = useState(false)

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

  return <Paper style={{display: 'grid', padding: '20px', margin: '15px', backgroundColor: customTheme.palette.background.default}}>
    <div style={{display: 'flex', marginBottom: '20px'}}>
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
    </div>
    {
      (timelineData.runners || []).map( (runnerInfo, index) => {
        return <div key={index} style={{marginBottom: '35px'}}>
          <div style={{display: 'flex', alignItems: 'center', marginBottom: '5px'}}>
            <ComputerIcon></ComputerIcon>
            <label style={{marginLeft: '5px'}}>{runnerInfo.runner}</label>
          </div>

          {
            runnerInfo.devices.map((deviceInfo, index) => {
              return <div key={index} style={{display: 'flex', alignItems: 'center'}}>
                <div style={{display: 'flex', alignItems: 'center', marginLeft: '20px'}}>
                  <PhoneIphoneIcon></PhoneIphoneIcon>
                  <label style={{width: '350px', marginLeft: '5px'}}>{deviceInfo.deviceId}</label>
                </div>

                <div style={{width: '100%', margin: '10px 0', backgroundColor: 'rgba(255, 255, 255, 0.07)', height: '20px', position: 'relative'}}>
                  {
                    deviceInfo.results.map((result, index) => {
                      return <TimelineElement
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
  </Paper>
})

const TimelineElement = ({ startDate, endDate, duration, result, hoveredTest, setHoveredTest, ...props }) => {
  const resultDuration = Number.parseInt(result.duration)
  const secondsBeforeEnd = secondsBetween(startDate, result.endDate)
  const secondsFromStart = (secondsBeforeEnd - resultDuration)

  const relativeStart = (secondsBeforeEnd - resultDuration) / duration * 100
  const relativeWidth = resultDuration / duration * 100

  const TimelineElementTooltip = () => {
    return <div style={{display: 'grid'}}>
      <label style={{fontWeight: 'bold'}}>{result.fullName}</label>

      <div style={{display: 'grid', marginTop: '10px'}}>
        <div style={{display: 'flex'}}>
          <label>Started: {secondsFromStart}s</label>
          <label style={{marginLeft: '15px', color: 'rgba(255, 255, 255, 0.5)'}}>{getDateTime(result.startDate)}</label>

        </div>

        <div style={{display: 'flex'}}>
          <label style={{marginLeft: '5px'}}>Ended: {secondsBeforeEnd}s</label>
          <label style={{marginLeft: '15px', color: 'rgba(255, 255, 255, 0.5)'}}>{getDateTime(result.endDate)}</label>
        </div>

        <label style={{marginTop: '5px'}}>Duration: {resultDuration}s</label>
      </div>

      <label style={{marginTop: '10px'}}>Retry: {result.retry}</label>
    </div>
  }

  return <StyledTooltip
    maxWidth={'800px'}
    title={<TimelineElementTooltip />}
  >
    <div
      style={{
        position: 'absolute',
        left: relativeStart + '%',
        backgroundColor: result.status == 'SUCCESS' ? customTheme.palette.success.main : customTheme.palette.error.main,
        height: '100%',
        width: relativeWidth + '%',
        ...props.style
      }}
      onMouseOver={() => setHoveredTest(result.fullName)}
      onMouseLeave={() => setHoveredTest(null)}
      onBlur={() => setHoveredTest(null)}
    >
      {
        hoveredTest === result.fullName &&
        <div style={{ width: '100%', height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.65)' }}/>

      }
    </div>
  </StyledTooltip>
}

export default TestrunChartsPage