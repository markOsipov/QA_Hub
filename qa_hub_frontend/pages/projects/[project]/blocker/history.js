import {useEffect, useState} from "react";
import {observer} from "mobx-react-lite";
import {useRouter} from "next/router";
import {blockTest, getBlockedTestsHistory, unblockTest} from "../../../../requests/BlockerRequests";
import {
  Card,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
} from "@mui/material";
import {StyledTableRow} from "../../../../components/primitives/Table/StyledTableRow";
import {StyledTableCell} from "../../../../components/primitives/Table/StyledTableCell";
import DateWithDayDiff from "../../../../components/stats/cells/DateWithDayDiff";
import CustomIconButton from "../../../../components/primitives/CustomIconButton";
import StopIcon from "@mui/icons-material/Stop";
import UndoIcon from '@mui/icons-material/Undo';
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import TextWithLabel from "../../../../components/primitives/TextWithLabel";

const BlockedTestsHistoryPage = observer(() => {
  const router = useRouter()

  const project = router.query.project
  const [history, setHistory] = useState([])

  function refreshHistory() {
    getBlockedTestsHistory(project).then(response => {
      if (response.data) {
        setHistory(response.data)
      }
    })
  }

  useEffect(() => {
    refreshHistory()
  }, [project])

  return <>
    Blocker history
    <Paper elevation={3} style={{margin: "15px", maxHeight: "calc(100vh - 165px)", overflowY: "auto", minWidth: "35vw", width: 'max-content' }}>
      <TableContainer>
        <Table size="small" stickyHeader >
          <TableHead style={{ height: "60px" }}>
            <StyledTableRow>
              <StyledTableCell align='left' style={{width: '50px'}}>№</StyledTableCell>
              <StyledTableCell align='center' style={{width: "50px"}}></StyledTableCell>
              <StyledTableCell style={{width: "150px"}} align='center'>Event</StyledTableCell>
              <StyledTableCell align='center'>Test</StyledTableCell>
              <StyledTableCell style={{width: "250px", minWidth: "250px"}} align='center'>Date</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {
              history.map((historyItem, index) => {
                  return <StyledTableRow key={index}>
                    <StyledTableCell align="left">
                      <label style={{ padding: "5px 9px"}}>{index + 1}</label>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <BlockerEventActionButton
                        eventType={historyItem.event}
                        blockedTest={historyItem.blockedTest}
                        refreshHistory={refreshHistory}
                      />
                    </StyledTableCell>
                    <StyledTableCell align="center">{historyItem.event}</StyledTableCell>
                    <StyledTableCell align="center"><BlockedTestInfo blockedTest={historyItem.blockedTest}/></StyledTableCell>
                    <StyledTableCell align="center"><DateWithDayDiff date={historyItem.date}/></StyledTableCell>
                  </StyledTableRow>
                }
              )
            }
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  </>
})

export default BlockedTestsHistoryPage

const BlockerEventActionButton = ({eventType, blockedTest, refreshHistory, ...props}) => {
  const eventTypes = {
    unblock: "unblock",
    block: "block",
    edit: "edit"
  }

  if (eventType === eventTypes.edit ) {
    return null
  }

  const handleClick = () => {
    if (eventType === eventTypes.unblock ) {
      blockTest(blockedTest).then(() => {
        refreshHistory()
      })
    } else {
      unblockTest(blockedTest).then(() => {
        refreshHistory()
      })
    }
  }

return <Button variant="contained"
    color="primary"
    size="small"
    startIcon={<UndoIcon />}
    onClick={handleClick}
  >Undo</Button>
}

const BlockedTestInfo = ({blockedTest, ...props}) => {
  return <Card style={{display: 'block', padding: '15px', maxWidth: 'max-content', ...props.style}}>
    <TextWithLabel label={'TestcaseId'} value={blockedTest.testcaseId} />
    <TextWithLabel label={'FullName'} value={blockedTest.fullName} style={{marginTop: '25px'}}/>
    <TextWithLabel label={'Comment'} value={blockedTest.comment} style={{marginTop: '25px'}}/>
    <TextWithLabel label={'Issue'} value={blockedTest.jiraIssue} style={{marginTop: '25px'}}/>
  </Card>
}
