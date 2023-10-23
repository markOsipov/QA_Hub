import DurationChartPlate from "../DurationChartPlate";
import {useEffect, useState} from "react";

const OverallDurationChart = ({timelineData, hoveredTest, setHoveredTest, sortResults}) => {
  const [durationInfo, setDurationInfo] = useState([])

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

    setDurationInfo(sortResults(results, "duration", -1))
  }, [timelineData])

  return  <DurationChartPlate data={durationInfo} hoveredTest={hoveredTest} setHoveredTest={setHoveredTest} title={'Overall'}/>
}

export default OverallDurationChart