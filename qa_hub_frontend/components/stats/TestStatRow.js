import {StyledTableCell} from "../primitives/Table/StyledTableCell";
import StyledTooltip from "../primitives/StyledTooltip";
import {StyledTableRow} from "../primitives/Table/StyledTableRow";
import {observer} from "mobx-react-lite";
import blockerState from "../../state/BlockerState";
import LockIcon from "@mui/icons-material/Lock";
import {customTheme} from "../../styles/CustomTheme";
import {daysBetween, getDate} from "../../utils/DateTimeUtils";
import {useState} from "react";

const TestStatRow = observer(({testStat, index, openTestHistoryModal, ...props}) => {
  const {blockedTests} = blockerState

  const isBlocked = blockedTests.findIndex((el) => { return el.fullName === testStat.fullName}) >= 0
  const successRate = Number.parseInt(testStat.successRate * 100)

  const openTestHistory = () => {
    openTestHistoryModal(testStat.fullName)
  }

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
      <TestStatsFullName fullName={testStat.fullName} action={openTestHistory} />
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
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <div style={{display: 'flex'}}>
          <label>{testStat.lastRun && getDate(testStat.lastRun)}</label>
          {
            testStat.lastRun &&
            <label style={{marginLeft: '10px', color: customTheme.palette.text.disabled}}>{ daysBetween(testStat.lastRun) } days</label>
          }
        </div>
      </div>
    </StyledTableCell>

    <StyledTableCell align="center">
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <div style={{display: 'flex'}}>
          <label>{testStat.lastSuccess && getDate(testStat.lastSuccess)}</label>
          {
            testStat.lastSuccess &&
            <label style={{marginLeft: '10px', color: customTheme.palette.text.disabled}}>{ daysBetween(testStat.lastSuccess) } days</label>
          }
        </div>
      </div>
    </StyledTableCell>
  </StyledTableRow>
})

const TestStatsFullName = ({fullName, action, ...props}) => {
  const [hovered, setHovered] = useState(false)

  return <label
      onClick={action}
      onMouseOver={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onBlur={() => setHovered(false)}
      style={{
        padding: '7px 12px',
        cursor: "pointer",
        backgroundColor: hovered && 'rgba(255, 255, 255, 0.09)',
        ...props.style
      }}
    >{fullName}</label>
}
export default TestStatRow