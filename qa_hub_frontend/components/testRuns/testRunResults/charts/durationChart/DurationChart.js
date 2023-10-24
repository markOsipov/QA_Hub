import {observer} from "mobx-react-lite";
import {useEffect, useState} from "react";
import {FormControl, InputLabel, MenuItem, Paper} from "@mui/material";
import {customTheme} from "../../../../../styles/CustomTheme";
import Typography from "@mui/material/Typography";
import OverallDurationChart from "./groups/OverallDurationChart";
import ByRunnerDurationChart from "./groups/ByRunnerDurationChart";
import StyledSelect from "../../../../primitives/StyledSelect";
import ByDeviceDurationChart from "./groups/ByDeviceDurationChart";

const DurationChart = observer(({ timelineData, hoveredTest, setHoveredTest, filter }) => {
  const ChartGroups = {
    none: "none",
    runner: "runner",
    device: "device"
  }

  const [chartGroups, setChartGroups] = useState(ChartGroups.none)



  const sortResults = (results, sortField, sortDirection) => {
    return results.sort( (a, b) => {
      let sortRes = 0
      if (a[sortField] > b[sortField] ) {
        sortRes = 1
      } else if (a[sortField] < b[sortField] ) {
        sortRes = -1
      }

      return sortRes * sortDirection
    })
  }

  return <Paper style={{padding: '10px', margin: '15px', maxWidth: '98xw', overflow: 'auto', backgroundColor: customTheme.palette.background.default}}>
    <div style={{display: 'flex', alignItems: 'center', marginBottom: '20px', marginTop: '5px'}}>
      <Typography variant={'h5'} style={{}}>Duration chart</Typography>

      <FormControl sx={{ minWidth: 150, marginLeft: '15px' }} size="small">
        <InputLabel style={{ color: customTheme.palette.text.faded }}>Group by</InputLabel>
        <StyledSelect
          value={chartGroups}
          label="Group by"
          onChange={(e) => { setChartGroups(e.target.value)}}
        >
          {
            Object.keys(ChartGroups).map((option) =>
              <MenuItem key={option} value={option}>{option}</MenuItem>
            )
          }
        </StyledSelect>
      </FormControl>
    </div>
    <div style={{display: 'grid', placeItems: 'center'}}>

      {
        chartGroups === ChartGroups.none &&
        <OverallDurationChart
          timelineData={timelineData}
          sortResults={sortResults}
          hoveredTest={hoveredTest}
          setHoveredTest={setHoveredTest}
          filter={filter}
        />
      }
      {
        chartGroups === ChartGroups.runner &&
        <ByRunnerDurationChart
          timelineData={timelineData}
          sortResults={sortResults}
          hoveredTest={hoveredTest}
          setHoveredTest={setHoveredTest}
          filter={filter}
        />
      }
      {
        chartGroups === ChartGroups.device &&
        <ByDeviceDurationChart
          timelineData={timelineData}
          sortResults={sortResults}
          hoveredTest={hoveredTest}
          setHoveredTest={setHoveredTest}
          filter={filter}
        />
      }
    </div>
  </Paper>
})





export default DurationChart