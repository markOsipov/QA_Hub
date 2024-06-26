import {useEffect, useState} from "react";
import DurationChartPlate from "../DurationChartPlate";
import Typography from "@mui/material/Typography";

const ByDeviceDurationChart = ({timelineData, hoveredTest, setHoveredTest, sortResults, filter}) => {
  const [durationInfo, setDurationInfo] = useState([])
  const [maxDuration, setMaxDuration] = useState(0)
  const [maxCount, setMaxCount] = useState(0)

  useEffect(() => {
    const results = {...timelineData}
    let maxDuration = 0
    let maxCount = 0

    if (timelineData.runners !== null) {
      results.runners.forEach(runner => {
        runner.devices.forEach(device => {
          maxCount = Math.max(maxCount, device.results.length)

          const saturatedResults = device.results.map(result => {
            maxDuration = Math.max(maxDuration, result.duration)

            return {
              ...result,
              deviceId: device.deviceId,
              runner: runner.runner
            }
          })
          device.results = sortResults(saturatedResults, "duration", -1)
        })
      })
    }

    setMaxDuration(maxDuration)
    setMaxCount(maxCount)
    setDurationInfo(results)
  }, [timelineData])

  return <div style={{ width: '100%', display: 'grid', placeItems: 'center'}}>
    {
      (durationInfo.runners || []).map((runnerData, index) => {
        return <div key={index} style={{marginBottom: '50px'}}>
          <Typography variant={'h5'} style={{ }}>{runnerData.runner}</Typography>
          <div style={{display: 'flex', flexWrap: 'wrap', maxWidth: '98vw'}}>
            {
              runnerData.devices.map((deviceData, index) => {
                return <DurationChartPlate
                  key={index}
                  data={deviceData.results}
                  maxDuration={maxDuration}
                  maxCount={maxCount}
                  title={deviceData.deviceId}
                  hoveredTest={hoveredTest}
                  setHoveredTest={setHoveredTest}
                  style={{margin: '10px 10px 35px 10px', minWidth: '500px'}}
                  filter={filter}
                />
              })
            }
          </div>
        </div>
      })
    }
  </div>
}

export default ByDeviceDurationChart