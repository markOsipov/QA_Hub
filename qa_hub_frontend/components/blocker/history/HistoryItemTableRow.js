import {useState} from "react";
import {StyledTableRow} from "../../primitives/Table/StyledTableRow";
import {StyledTableCell} from "../../primitives/Table/StyledTableCell";
import EventTypeIcon from "./EventTypeIcon";
import {getDate, getDateTime, getTimeMinutes} from "../../../utils/DateTimeUtils";
import {customTheme} from "../../../styles/CustomTheme";

export default function HistoryItemTableRow({historyItem, setSelectedItem, index, ...props}) {
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
    <StyledTableCell align="center">{historyItem.blockedTest.tmsTask}</StyledTableCell>
    <StyledTableCell align="center">
      <label style={{ color: customTheme.palette.text.disabled}}>{getTimeMinutes(historyItem.date) }</label>
      <label style={{marginLeft: '7px',}}>{getDate(historyItem.date) }</label>
    </StyledTableCell>
  </StyledTableRow>
}