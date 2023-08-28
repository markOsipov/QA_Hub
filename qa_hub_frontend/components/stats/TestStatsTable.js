import {
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow
} from "@mui/material";
import {StyledTableRow} from "../primitives/Table/StyledTableRow";
import {StyledTableCell} from "../primitives/Table/StyledTableCell";
import {observer} from "mobx-react-lite";
import projectState from "../../state/ProjectState";
import blockerState from "../../state/BlockerState";
import {useEffect, useState} from "react";
import TestStatRow from "./TestStatRow";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const TestStatsTable = observer(({ testStats, sort, sortTestStats, ...props }) => {
  const {selectedProject} = projectState
  const {blockedTests} = blockerState

  useEffect(() => {
    blockerState.updateBlockedTests(selectedProject)
  }, [selectedProject])

  return <div style={{...props.style}}>
      <Paper elevation={3} style={{marginTop: '10px', maxHeight: "calc(100vh - 165px)", overflowY: "auto", minWidth: "35vw" }}>
        <TableContainer style={{}}>
          <Table size="small" stickyHeader >
            <TableHead style={{ height: "60px" }}>
              <StyledTableRow>
                <StyledTableCell align='center' style={{width: "50px"}}>№</StyledTableCell>
                <StyledTableCell style={{width: "50px"}}/>
                <SortableTableCell fieldName={"fullName"} sortTestStats={sortTestStats} sort={sort} align='left'>FullName</SortableTableCell>
                <SortableTableCell fieldName={"avgRetries"} sortTestStats={sortTestStats} sort={sort} align='center'>Avg Retries</SortableTableCell>
                <SortableTableCell fieldName={"avgDuration"} sortTestStats={sortTestStats} sort={sort} align='center'>Avg Duration(s)</SortableTableCell>
                <SortableTableCell fieldName={"successRate"} sortTestStats={sortTestStats} sort={sort} align='center'>Success Rate</SortableTableCell>
                <SortableTableCell fieldName={"lastRun"} sortTestStats={sortTestStats} sort={sort} align='center'>Last run</SortableTableCell>
                <SortableTableCell fieldName={"lastSuccess"} sortTestStats={sortTestStats} sort={sort} align='center'>Last success</SortableTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {
                testStats.map((testStat, index) => {
                  return <TestStatRow key={index} testStat={testStat} index={index}/>
                })
              }
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
  </div>
})

export default TestStatsTable

function SortableTableCell({fieldName, sort, sortTestStats, ...props}) {
  const [hovered, setHovered] = useState(false)
  function changeSortOrder() {
    let isAscending = true
    if (sort?.fieldName === fieldName) {
      isAscending = !sort?.isAscending
    }

    sortTestStats(fieldName, isAscending)
  }

  return <StyledTableCell
    style={{
      ...props.style
    }}

    {...props}
  >
    <div style={{display:'flex', justifyContent: props.align}}>
      <div
        style={{
          display: 'flex',
          backgroundColor: hovered && 'rgba(255, 255, 255, 0.07)',
          cursor: 'pointer',
          padding: '10px 20px'
        }}
        onClick={changeSortOrder}
        onMouseOver={() => { setHovered(true) }}
        onMouseLeave={() => { setHovered(false) }}
        onBlur={() => { setHovered(false) }}
      >
        <label style={{ cursor: 'pointer' }}>{props.children}</label>
        {
          sort?.fieldName === fieldName && sort?.isAscending &&
          <ArrowDropUpIcon/>
        }
        {
          sort?.fieldName === fieldName && !sort?.isAscending &&
          <ArrowDropDownIcon/>
        }
      </div>
    </div>
  </StyledTableCell>
}