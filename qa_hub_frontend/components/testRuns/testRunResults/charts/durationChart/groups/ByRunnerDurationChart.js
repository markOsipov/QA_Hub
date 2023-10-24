import {useEffect, useState} from "react";
import DurationChartPlate from "../DurationChartPlate";

const ByRunnerDurationChart = ({timelineData, hoveredTest, setHoveredTest, sortResults, filter}) => {
  const [durationInfo, setDurationInfo] = useState([])
  const [maxDuration, setMaxDuration] = useState(0)
  const [maxCount, setMaxCount] = useState(0)

  useEffect(() => {
    const results = []
    let maxDuration = 0
    let maxCount = 0

    if (timelineData.runners !== null) {
      timelineData.runners.forEach(runner => {
        let runnerResults = []

        runner.devices.forEach(device => {
          const saturatedResults = device.results.map(result => {
            return {
              ...result,
              deviceId: device.deviceId,
              runner: runner.runner
            }
          })

          runnerResults = runnerResults.concat(saturatedResults)
        })


        const sortedResults = sortResults(runnerResults, "duration", -1)

        maxDuration = Math.max(maxDuration, sortedResults[0].duration)
        maxCount = Math.max(maxCount, runnerResults.length)

        results.push({
          runner: runner.runner,
          results: sortedResults
        })
      })
    }
    setMaxDuration(maxDuration)
    setMaxCount(maxCount)

    setDurationInfo(sortResults(results, "runner", 1))
  }, [timelineData])

  return <div>
    {
      durationInfo.map((runnerData, index) => {
        return <DurationChartPlate
          key={index}
          data={runnerData.results}
          maxDuration={maxDuration}
          maxCount={maxCount}
          title={runnerData.runner}
          hoveredTest={hoveredTest}
          setHoveredTest={setHoveredTest}
          style={{marginBottom: '35px'}}
          filter={filter}
        />
      })
    }
  </div>
}

export default ByRunnerDurationChart