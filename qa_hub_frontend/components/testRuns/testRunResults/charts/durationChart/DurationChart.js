import {observer} from "mobx-react-lite";
import {useEffect, useState} from "react";
import {FormControl, InputLabel, MenuItem, Paper} from "@mui/material";
import {customTheme} from "../../../../../styles/CustomTheme";
import Typography from "@mui/material/Typography";
import OverallDurationChart from "./groups/OverallDurationChart";
import ByRunnerDurationChart from "./groups/ByRunnerDurationChart";
import StyledSelect from "../../../../primitives/StyledSelect";
import ByDeviceDurationChart from "./groups/ByDeviceDurationChart";

const DurationChart = observer(({timelineData, hoveredTest, setHoveredTest}) => {
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

  return <Paper style={{padding: '10px', margin: '15px', maxWidth: '98xw', overflow: 'auto'}}>
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
    <div style={{display: 'flex', marginLeft: '100px'}}>
      {/*<div style={{flexGrow: '1', maxWidth: '150px'}}></div>*/}

      {
        chartGroups === ChartGroups.none &&
        <OverallDurationChart timelineData={timelineData} sortResults={sortResults} hoveredTest={hoveredTest} setHoveredTest={setHoveredTest}/>
      }
      {
        chartGroups === ChartGroups.runner &&
        <ByRunnerDurationChart timelineData={timelineData} sortResults={sortResults} hoveredTest={hoveredTest} setHoveredTest={setHoveredTest}/>
      }
      {
        chartGroups === ChartGroups.device &&
        <ByDeviceDurationChart timelineData={timelineData} sortResults={sortResults} hoveredTest={hoveredTest} setHoveredTest={setHoveredTest}/>
      }
    </div>
  </Paper>
})





export default DurationChart