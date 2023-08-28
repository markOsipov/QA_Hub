import {StyledTableCell} from "../primitives/Table/StyledTableCell";
import StyledTooltip from "../primitives/StyledTooltip";
import {StyledTableRow} from "../primitives/Table/StyledTableRow";
import {observer} from "mobx-react-lite";
import blockerState from "../../state/BlockerState";
import LockIcon from "@mui/icons-material/Lock";
import {customTheme} from "../../styles/CustomTheme";
import {getDate} from "../../utils/DateTimeUtils";

const TestStatRow = observer(({testStat, index, ...props}) => {
  const {blockedTests} = blockerState

  const isBlocked = blockedTests.findIndex((el) => { return el.fullName === testStat.fullName}) >= 0
  const successRate = Number.parseInt(testStat.successRate * 100)

  return <StyledTableRow style={{height: '45px', ...props.style}} {...props}>
    <StyledTableCell align="center">
      <label style={{ padding: "5px 9px", color: customTheme.palette.text.disabled}}>{index + 1}</label>
    </StyledTableCell>

    <StyledTableCell align="left">
      {
        isBlocked &&
        <StyledTooltip title={"Test is blocked"}>
          <LockIcon style={{color: customTheme.palette.text.disabled}} />
        </StyledTooltip>
      }
    </StyledTableCell>

    <StyledTableCell align="left">
      {testStat.fullName}
    </StyledTableCell>

    <StyledTableCell align="center">
      {Number.parseInt(testStat.avgRetries * 100) / 100}
    </StyledTableCell>

    <StyledTableCell align="center">
      {testStat.avgDuration}
    </StyledTableCell>

    <StyledTableCell align="center">
      <div style={{display: 'flex', flexDirection:'column', height: 'max-content'}}>
        <div>
          <label>{successRate}%</label>
          <label style={{color: customTheme.palette.text.disabled, marginLeft: '12px'}}>{testStat.successRuns }/{testStat.totalRuns}</label>
        </div>

        <div style={{display: 'flex', width: '100px', height: '2px', alignSelf: 'center', marginTop: '3px'}}>
          <div style={{backgroundColor: customTheme.palette.success.main, height: '100%', width: `${successRate}%`}}></div>
          <div style={{backgroundColor: customTheme.palette.error.main, height: '100%', width: `${100 - successRate}%`}}></div>
        </div>
      </div>


    </StyledTableCell>

    <StyledTableCell align="center">
      {testStat.lastRun && getDate(testStat.lastRun)}
    </StyledTableCell>

    <StyledTableCell align="center">
      {testStat.lastSuccess && getDate(testStat.lastSuccess)}
    </StyledTableCell>
  </StyledTableRow>
})

export default TestStatRow