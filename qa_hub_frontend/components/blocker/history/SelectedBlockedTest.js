import Typography from "@mui/material/Typography";
import {customTheme} from "../../../styles/CustomTheme";
import {blockTest, unblockTest} from "../../../requests/BlockerRequests";
import StyledTooltip from "../../primitives/StyledTooltip";
import CustomIconButton from "../../primitives/CustomIconButton";
import UndoIcon from "@mui/icons-material/Undo";
import {observer} from "mobx-react-lite";
import blockerState from "../../../state/BlockerState";
import TextWithLabel from "../../primitives/TextWithLabel";
import {Switch} from "@mui/material";
import {getDate, getTimeMinutes} from "../../../utils/DateTimeUtils";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EventTypeIcon from "./EventTypeIcon";
import EventsList from "./EventsList";
import {useEffect, useState} from "react";

const SelectedBlockedTest = observer(({selectedItem, setSelectedItem, history, refreshHistory, ...props}) => {
  const blockedTests = blockerState.blockedTests

  const [filteredHistory, setFilteredHistory] = useState([])
  const [blockedTest, setBlockedTest] = useState(null)
  const [isBlocked, setIsBlocked] = useState(false)

  useEffect(() => {
    const historyFilter = (item) => {
      return item.blockedTest.testcaseId === blockedTest?.testcaseId ||
        item.blockedTest.fullName === blockedTest?.fullName ||
        item.blockedTest.shortName === blockedTest?.shortName
    }

    setFilteredHistory(history.filter(historyFilter))
  }, [history, selectedItem, blockedTest])

  useEffect(() => {
    setBlockedTest(selectedItem?.blockedTest)
  }, [selectedItem])

  useEffect(() => {
    const isBlocked = blockedTests.filter(item => {
      return item.testcaseId === blockedTest?.testcaseId ||
      item.fullName === blockedTest?.fullName ||
      item.shortName === blockedTest?.shortName
    }).length > 0

    console.log(blockedTest?.testcaseId)
    console.log(JSON.stringify(blockedTests))
    console.log(isBlocked)

    setIsBlocked(isBlocked)
  }, [blockedTests, blockedTest])

  if (!blockedTest) {
    return <div style={{display: 'grid', placeItems: 'center', width: '55%'}}>
      <Typography variant={'h5'} style={{color: customTheme.palette.text.disabled}}>Not selected</Typography>
    </div>
  }
  return <div style={{width: '55%', padding: '0 15px 15px 15px'}}>
    <div style={{display: 'flex', marginBottom: '30px'}}>
      <EventTypeIcon eventType={selectedItem.event}></EventTypeIcon>
      <Typography variant={'h5'} style={{marginLeft: '10px'}}>Event details:</Typography>
      <div style={{flexGrow: '1'}}></div>

      <StyledTooltip title={'Event date'}>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <CalendarTodayIcon style={{fontSize: '15px'}} />
          <label style={{marginLeft: '7px'}}>{getDate(selectedItem.date)}</label>
          <label style={{marginLeft: '10px', color: customTheme.palette.text.disabled}}>{getTimeMinutes(selectedItem.date)}</label>
        </div>
      </StyledTooltip>
    </div>

    <div
      style={{
        maxWidth: 'max-content',
        display: 'flex',
        alignItems: 'center',
        marginTop: '20px'
      }}
    >
      <TextWithLabel label={'TestcaseId'} value={blockedTest.testcaseId} style={{height: 'max-content', minWidth: '90px'}}/>
      <TextWithLabel label={'FullName'} value={blockedTest.fullName} style={{marginLeft: '15px', height: 'max-content', minWidth: 'max-content'}}/>
      <TextWithLabel label={'Issue'} value={blockedTest.jiraIssue} style={{marginLeft: '15px', height: 'max-content', minWidth: '90px'}}/>

      <div style={{display: 'flex', alignItems: 'center', marginLeft: '20px'}}>
        <Switch
          checked={blockedTest.allowTrialRuns}
        />
        <label>Trial</label>
      </div>
    </div>

    <div style={{marginTop: '10px'}}>
      <Typography variant={'h6'} style={{color: customTheme.palette.text.faded}}>Related events</Typography>

      <div>
        <EventsList history={filteredHistory } refreshHistory={refreshHistory} setSelectedItem={setSelectedItem} style={{width: '100%', height: 'max-content', minHeight: '250px', maxHeight: 'calc(100vh - 350px)', opacity: '0.7', resize: 'vertical'}}></EventsList>
      </div>
    </div>

    <div style={{marginTop: '10px'}}>
      Is blocked: { String(isBlocked) }
    </div>
  </div>
})

export default SelectedBlockedTest
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
      if (confirm("Do you want to block this test")) {
        blockTest(blockedTest).then(() => {
          refreshHistory()
        })
      }
    } else {
      if (confirm("Do you want to block this test")) {
        unblockTest(blockedTest).then(() => {
          refreshHistory()
        })
      }
    }
  }

  return <StyledTooltip title={'Undo'}>
    <div>
      <CustomIconButton
        action={handleClick}
        color={customTheme.palette.primary.main}
        icon={<UndoIcon />}
      />
    </div>
  </StyledTooltip>
}