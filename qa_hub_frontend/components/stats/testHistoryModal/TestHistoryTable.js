import {Paper, Table, TableBody, TableContainer, TableHead} from "@mui/material";
import {StyledTableRow} from "../../primitives/Table/StyledTableRow";
import {StyledTableCell} from "../../primitives/Table/StyledTableCell";
import {getDate, getTimeMinutes} from "../../../utils/DateTimeUtils";
import {customTheme} from "../../../styles/CustomTheme";
import TestStatusWithRetries from "../../common/TestStatusWithRetries";
import {useState} from "react";
import {useRouter} from "next/router";

export default function TestHistoryTable({ testHistoryResults, ...props}) {
  if (testHistoryResults.length == 0) {
    return <div style={{...props.style}}>No test results</div>
  }

  const calcErrorHeight = (testResult) => {
    if (testResult.message.split("\n").length > 5) {
      return "100px"
    }
    return "max-content"
  }

  return <Paper elevation={3} style={{...props.style, overflowY: 'auto'}}>
    <TableContainer>
      <Table size="small" stickyHeader >
        <TableHead style={{ height: "40px" }}>
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
                  <label style={{color: customTheme.palette.text.disabled}}>{index + 1}</label>
                </StyledTableCell>

                <StyledTableCell align={'center'}>
                  <TestStatusWithRetries status={testResult.status}></TestStatusWithRetries>
                </StyledTableCell>

                <StyledTableCell align={'center'}><TestHistoryTestRunId testResult={testResult}/></StyledTableCell>
                <StyledTableCell align={'center'}>
                  <label style={{
                    padding: '3px 6px',
                    // color: testResult.retries == 2 ? customTheme.palette.background.default : customTheme.palette.text.primary ,
                    backgroundColor: testResult.retries >= 3 ? customTheme.palette.error.main : testResult.retries >= 2 ? customTheme.palette.warning.main : 'unset',
                    border: testResult.retries > 1 ? '1px solid' : '0px',
                    borderRadius: '5px',
                    borderColor: testResult.retries >= 3 ? customTheme.palette.error.main : testResult.retries >= 2 ? customTheme.palette.warning.main : customTheme.palette.text.primary
                  }}>
                    {testResult.retries}
                  </label>
                </StyledTableCell>
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
                        whiteSpace: 'break-spaces',
                        height: calcErrorHeight(testResult),
                        resize: 'vertical',
                        overflowY: 'hidden',
                        minHeight: '50px',
                        backgroundColor: customTheme.palette.error.faded,
                      }}
                    >{testResult.message}</div>
                  }
                </StyledTableCell>

                <StyledTableCell align={'center'}>
                  <label style={{color: customTheme.palette.text.disabled}}>{getTimeMinutes(testResult.endDate)}</label>
                  <label style={{marginLeft: '10px'}}>{getDate(testResult.endDate)}</label>
                </StyledTableCell>
              </StyledTableRow>
            })
          }
        </TableBody>
      </Table>
    </TableContainer>
  </Paper>
}

const TestHistoryTestRunId = ({testResult, ...props}) => {
  const router = useRouter()
  const [hovered, setHovered] = useState(false)
  const testRunUrl = new URL(`${window.location.origin}/projects/${router.query.project}/testRuns/${testResult.testRunId}`)
  testRunUrl.searchParams.append("test", testResult.testcaseId || testResult.fullName)

  return <a
    onMouseOver={() => setHovered(true)}
    onMouseLeave={() => setHovered(false)}
    onBlur={() => setHovered(false)}
    style={{
      padding: '7px 12px',
      cursor: "pointer",
      backgroundColor: hovered && 'rgba(255, 255, 255, 0.09)',
      ...props.style
    }}
    href={testRunUrl.href} target={"_blank"} rel="noreferrer"
  >{testResult.testRunId}</a>
}