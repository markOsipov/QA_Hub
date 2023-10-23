import {observer} from "mobx-react-lite";
import {customTheme} from "../../../../styles/CustomTheme";
import Typography from "@mui/material/Typography";
import ComputerIcon from "@mui/icons-material/Computer";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import {Paper} from "@mui/material";
import {useEffect, useState} from "react";
import {secondsBetween} from "../../../../utils/DateTimeUtils";
import {useRouter} from "next/router";
import TimelineElement from "./TimelineElement";
import {getTimelineData} from "../../../../requests/testResults/TestResultsRequests";
import DurationChart from "./durationChart/DurationChart";

const TimelineChart = observer(({...props}) => {
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
    <DurationChart timelineData={timelineData} hoveredTest={hoveredTest} setHoveredTest={setHoveredTest}></DurationChart>
  </div>
})

export default TimelineChart