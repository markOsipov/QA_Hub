import {Card, Paper, Table, TableBody, TableContainer, TableHead} from "@mui/material";
import {StyledTableRow} from "../../primitives/Table/StyledTableRow";
import {StyledTableCell} from "../../primitives/Table/StyledTableCell";
import TextWithLabel from "../../primitives/TextWithLabel";
import {useState} from "react";
import {customTheme} from "../../../styles/CustomTheme";
import {getDate, getTimeMinutes} from "../../../utils/DateTimeUtils";
import EventTypeIcon from "./EventTypeIcon";
const EventsList = ({history, refreshHistory, setSelectedItem, ...props}) => {
  const [hovered, setHovered] = useState(false)
  const handleClick = (historyItem) => {
    setSelectedItem(historyItem)
  }

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
          history.map((historyItem, index) => {
              return <HistoryItemTableRow key={index} historyItem={historyItem} setSelectedItem={setSelectedItem} index={index} />
            }
          )
        }
      </TableBody>
    </Table>
  </TableContainer>
}

export default EventsList


const HistoryItemTableRow = ({historyItem, setSelectedItem, index, ...props}) => {
  const [hovered, setHovered] = useState(false)
  const handleClick = () => {
    setSelectedItem(historyItem)
  }

  return  <StyledTableRow
    onMouseOver={() => setHovered(true)}
    onMouseLeave={() => setHovered(false)}
    onBlur={() => setHovered(false)}
    style={{ backgroundColor: hovered ? 'rgba(255, 255, 255, 0.05)' : 'unset', cursor: 'pointer' }}
    onClick={handleClick}
  >
    <StyledTableCell align="left">
      <label style={{ padding: "5px 9px"}}>{index + 1}</label>
    </StyledTableCell>
    <StyledTableCell align="center">
      <EventTypeIcon eventType={historyItem.event} />
    </StyledTableCell>
    <StyledTableCell align="center">{historyItem.blockedTest.testcaseId}</StyledTableCell>
    <StyledTableCell align="center">{historyItem.blockedTest.shortName}</StyledTableCell>
    <StyledTableCell align="center">{historyItem.blockedTest.jiraIssue}</StyledTableCell>
    <StyledTableCell align="center">
      <label>{getDate(historyItem.date)}</label>
      <label style={{marginLeft: '10px', color: customTheme.palette.text.disabled}}>{getTimeMinutes(historyItem.date)}</label>
    </StyledTableCell>
  </StyledTableRow>
}

