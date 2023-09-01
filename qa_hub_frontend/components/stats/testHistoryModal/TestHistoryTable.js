import {Paper, Table, TableBody, TableContainer, TableHead} from "@mui/material";
import {StyledTableRow} from "../../primitives/Table/StyledTableRow";
import {StyledTableCell} from "../../primitives/Table/StyledTableCell";
import TestStatRow from "../TestStatRow";
import {getDate, getDateTime, getTimeMinutes} from "../../../utils/DateTimeUtils";
import {customTheme} from "../../../styles/CustomTheme";
import TestStatusWithRetries from "../../common/TestStatusWithRetries";
import ErrorMessage from "../../testRuns/testRunResults/testResultDetails/retries/ErrorMessage";

export default function TestHistoryTable({ testHistoryResults, ...props}) {
  if (testHistoryResults.length == 0) {
    return <div style={{...props.style}}>No test results</div>
  }

  return <Paper elevation={3} style={{...props.style, overflowY: 'auto'}}>
    <TableContainer>
      <Table size="small" stickyHeader >
        <TableHead style={{ height: "60px" }}>
          <StyledTableRow>
            <StyledTableCell align='center' style={{width: "40px"}}>№</StyledTableCell>
            <StyledTableCell align='center' style={{width: "110px"}}>Status</StyledTableCell>
            <StyledTableCell align='center' style={{width: "180px"}}>TestRunId</StyledTableCell>
            <StyledTableCell align='center' style={{width: "100px"}}>Retries</StyledTableCell>
            <StyledTableCell align='center' style={{width: "100px"}}>Duration(s)</StyledTableCell>
            <StyledTableCell align='center'>Message</StyledTableCell>

            <StyledTableCell align='center' style={{width: "180px"}}>Date</StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody >
          {
            testHistoryResults.map((testResult, index) => {
              return <StyledTableRow key={index}>
                <StyledTableCell align={'center'}>
                  <label style={{color: customTheme.palette.text.disabled}}>{index}</label>
                </StyledTableCell>

                <StyledTableCell align={'center'}>
                  <TestStatusWithRetries status={testResult.status}></TestStatusWithRetries>
                </StyledTableCell>

                <StyledTableCell align={'center'}>{testResult.testRunId}</StyledTableCell>
                <StyledTableCell align={'center'}>{testResult.retries}</StyledTableCell>
                <StyledTableCell align={'center'}>{Number.parseInt(testResult.duration)}</StyledTableCell>

                <StyledTableCell>
                  {
                    testResult.message &&
                    <div
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid',
                        borderColor: customTheme.palette.error.main,
                        borderRadius: '10px',
                        backgroundColor: customTheme.palette.error.faded,
                    }}
                    >{testResult.message}</div>
                  }
                </StyledTableCell>

                <StyledTableCell align={'center'}>
                  <label style={{color: customTheme.palette.text.disabled}}>{getTimeMinutes(testResult.date)}</label>
                  <label style={{marginLeft: '10px'}}>{getDate(testResult.date)}</label>
                </StyledTableCell>
              </StyledTableRow>
            })
          }
        </TableBody>
      </Table>
    </TableContainer>
  </Paper>
}
