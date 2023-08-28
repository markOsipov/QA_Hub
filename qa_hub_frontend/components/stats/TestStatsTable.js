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
import AddBlockedTestModal from "../blocker/AddBlockedTestModal";
import {StyledTableRow} from "../primitives/Table/StyledTableRow";
import {StyledTableCell} from "../primitives/Table/StyledTableCell";
import FullNameTableHeaderCell from "../blocker/FullNameTableHeaderCell";
import BlockedTestTableRow from "../blocker/BlockedTestTableRow";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import TablePaginationActions from "../primitives/Table/TablePaginationActions";
import {observer} from "mobx-react-lite";
import projectState from "../../state/ProjectState";
import blockerState from "../../state/BlockerState";
import {useEffect} from "react";
import LockIcon from '@mui/icons-material/Lock';
import StyledTooltip from "../primitives/StyledTooltip";
import {customTheme} from "../../styles/CustomTheme";
import TestStatRow from "./TestStatRow";

const TestStatsTable = observer(({ testStats, ...props }) => {
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
                <StyledTableCell align='left'>FullName</StyledTableCell>
                <StyledTableCell align='center'>Avg Retries</StyledTableCell>
                <StyledTableCell align='center'>Avg Duration(s)</StyledTableCell>
                <StyledTableCell align='center'>Success Rate</StyledTableCell>
                <StyledTableCell align='center'>Last run</StyledTableCell>
                <StyledTableCell align='center'>Last success</StyledTableCell>
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
