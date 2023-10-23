import {useEffect, useState} from "react";
import DurationChartPlate from "../DurationChartPlate";

const ByRunnerDurationChart = ({timelineData, hoveredTest, setHoveredTest, sortResults}) => {
  const [durationInfo, setDurationInfo] = useState([])
  const [maxDuration, setMaxDuration] = useState(0)

  useEffect(() => {
    const results = []
    let maxDuration = 0

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

        results.push({
          runner: runner.runner,
          results: sortedResults
        })

        setMaxDuration(maxDuration)
      })
    }

    setDurationInfo(sortResults(results, "runner", 1))
  }, [timelineData])

  return <div>
    {
      durationInfo.map((runnerData, index) => {
        return <DurationChartPlate
          key={index}
          data={runnerData.results}
          maxDuration={maxDuration}
          title={runnerData.runner}
          hoveredTest={hoveredTest}
          setHoveredTest={setHoveredTest}
          style={{marginBottom: '35px'}}
        />
      })
    }
  </div>
}

export default ByRunnerDurationChart