import {observer} from "mobx-react-lite";
import TimelineChart from "../../../../../components/testRuns/testRunResults/charts/timelineChart/TimelineChart";

const TestrunChartsPage = observer(() => {
  return <div>
    <TimelineChart></TimelineChart>
  </div>

})



export default TestrunChartsPage