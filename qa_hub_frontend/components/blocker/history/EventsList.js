import {Table, TableBody, TableContainer, TableHead} from "@mui/material";
import {StyledTableRow} from "../../primitives/Table/StyledTableRow";
import {StyledTableCell} from "../../primitives/Table/StyledTableCell";
import {useEffect, useState} from "react";
import HistoryItemTableRow from "./HistoryItemTableRow";
const EventsList = ({history, refreshHistory, setSelectedItem, filter, ...props}) => {
  const [filteredItems, setFilteredItems] = useState(history)

  useEffect(() => {
    if (filter == null) {
      setFilteredItems(history)
    } else {
      setFilteredItems(
        history.filter(el => {
          return filter === "" ||
            el.blockedTest.testcaseId.includes(filter) ||
            el.blockedTest.fullName.includes(filter) ||
            el.blockedTest.tmsTask.includes(filter) ||
            el.blockedTest.comment.includes(filter)
        })
      )
    }
  }, [filter, history])

  return <TableContainer style={{...props.style}}>
    <Table size="small" stickyHeader >
      <TableHead style={{ height: "60px" }}>
        <StyledTableRow>
          <StyledTableCell align='left' style={{width: '50px'}}>№</StyledTableCell>
          <StyledTableCell style={{width: "50px"}} align='center'>Event</StyledTableCell>
          <StyledTableCell style={{minWidth: "50px"}} align='center'>TestcaseId</StyledTableCell>
          <StyledTableCell style={{minWidth: "150px"}} align='center'>ShortName</StyledTableCell>
          <StyledTableCell style={{minWidth: "50px"}} align='center'>Issue</StyledTableCell>
          <StyledTableCell style={{width: "150px", minWidth: "150px"}} align='center'>Date</StyledTableCell>
        </StyledTableRow>
      </TableHead>
      <TableBody>
        {
          filteredItems.map((historyItem, index) => {
              return <HistoryItemTableRow key={index} historyItem={historyItem} setSelectedItem={setSelectedItem} index={index} />
            }
          )
        }
      </TableBody>
    </Table>
  </TableContainer>
}

export default EventsList

