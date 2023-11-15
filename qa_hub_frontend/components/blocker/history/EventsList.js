import {Card, Paper, Table, TableBody, TableContainer, TableHead} from "@mui/material";
import {StyledTableRow} from "../../primitives/Table/StyledTableRow";
import {StyledTableCell} from "../../primitives/Table/StyledTableCell";
import TextWithLabel from "../../primitives/TextWithLabel";
import {useState} from "react";
import {customTheme} from "../../../styles/CustomTheme";
import {getDate, getTimeMinutes} from "../../../utils/DateTimeUtils";
import EventTypeIcon from "./EventTypeIcon";
const EventsList = ({history, refreshHistory, setSelectedItem, ...props}) => {
  return <TableContainer style={{...props.style}}>
    <Table size="small" stickyHeader >
      <TableHead style={{ height: "60px" }}>
        <StyledTableRow>
          <StyledTableCell align='left' style={{width: '50px'}}>№</StyledTableCell>
          <StyledTableCell style={{width: "50px"}} align='center'>Event</StyledTableCell>
          <StyledTableCell style={{minWidth: "350px"}} align='center'>Test</StyledTableCell>
          <StyledTableCell style={{width: "150px", minWidth: "150px"}} align='center'>Date</StyledTableCell>
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
                  <EventTypeIcon eventType={historyItem.event} />
                </StyledTableCell>
                <StyledTableCell align="center" style={{display: 'grid', placeItems: 'center'}}>
                  <BlockedTestInfo
                    historyItem={historyItem}
                    setSelectedItem={setSelectedItem}
                  />
                </StyledTableCell>
                <StyledTableCell align="center">
                  <label>{getDate(historyItem.date)}</label>
                  <label style={{marginLeft: '10px', color: customTheme.palette.text.disabled}}>{getTimeMinutes(historyItem.date)}</label>
                </StyledTableCell>
              </StyledTableRow>
            }
          )
        }
      </TableBody>
    </Table>
  </TableContainer>
}

export default EventsList


const BlockedTestInfo = ({historyItem, setSelectedItem, ...props}) => {
  const [hovered, setHovered] = useState(false)
  const handleClick = () => {
    setSelectedItem(historyItem)
  }

  return <div
    style={{
      padding: '15px',
      maxWidth: 'max-content',
      backgroundColor: hovered ? 'rgba(255, 255, 255, 0.07)' : 'unset',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      ...props.style
  }}
    onClick={handleClick}
    onMouseOver={() => { setHovered(true)} }
    onMouseLeave={() => { setHovered(false)} }
    onBlur={() => { setHovered(false)} }
  >
    <TextWithLabel label={'TestcaseId'} value={historyItem.blockedTest.testcaseId} style={{height: 'max-content', minWidth: '90px'}}/>
    <TextWithLabel label={'ShortName'} value={historyItem.blockedTest.shortName} style={{marginLeft: '15px', height: 'max-content', minWidth: 'max-content'}}/>
    <TextWithLabel label={'Issue'} value={historyItem.blockedTest.jiraIssue} style={{marginLeft: '15px', height: 'max-content', minWidth: '90px'}}/>
  </div>
}

