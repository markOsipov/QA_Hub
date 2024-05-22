import Typography from "@mui/material/Typography";
import {customTheme} from "../../../styles/CustomTheme";
import {blockTest, getTaskStatus, unblockTest} from "../../../requests/BlockerRequests";
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
import Button from "@mui/material/Button";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import {useRouter} from "next/router";
import TaskLink from "../TaskLink";
import TaskStatus from "../TaskStatus";
import projectIntegrationsState from "../../../state/integrations/ProjectIntegrationsState";

const SelectedBlockedTest = observer(({selectedItem, setSelectedItem, history, refreshHistory, ...props}) => {
  const blockedTests = blockerState.blockedTests
  const router = useRouter()
  const project = router.query.project

  const [filteredHistory, setFilteredHistory] = useState([])
  const [blockedTest, setBlockedTest] = useState(null)
  const [isBlocked, setIsBlocked] = useState(false)

  const [status, setStatus] = useState(null)
  const [color, setColor] = useState(null)
  const taskTrackerInfo = projectIntegrationsState.taskTrackerInt || {}

  useEffect(() => {
    if (selectedItem) {
      getTaskStatus(selectedItem.blockedTest.project, selectedItem.blockedTest.tmsTask).then((data) => {
        setStatus(data?.data?.statusInfo?.statusName || null)
        setColor(data?.data?.statusInfo?.statusColor || null)
      })
    }
  }, [selectedItem])

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

    setIsBlocked(isBlocked)
  }, [blockedTests, blockedTest])

  const handleClickBlock = () => {
    blockTest(blockedTest).then(() => {
      blockerState.updateBlockedTests(project)
      refreshHistory()
    })
  }

  const handleClickUnblock = () => {
      unblockTest(blockedTest).then(() => {
        blockerState.updateBlockedTests(project)
        refreshHistory()
      })
  }

  if (!blockedTest) {
    return <div style={{display: 'grid', placeItems: 'center', width: '55%'}}>
      <Typography variant={'h5'} style={{color: customTheme.palette.text.disabled}}>Not selected</Typography>
    </div>
  }
  return <div style={{width: '55%', padding: '5px 0 10px 10px'}}>
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

    <div style={{display: 'block', width: 'max-content'}}>
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

        <div style={{display: 'flex', alignItems: 'center', marginLeft: '15px'}}>
          <Switch
            checked={blockedTest.allowTrialRuns}
          />
          <label>Trial</label>
        </div>

        <div style={{display: 'flex', alignItems: 'center', width:'max-content', marginLeft: '15px'}}>
          <TaskStatus status={status} color={color} />
          <TaskLink blockedTest={selectedItem.blockedTest} taskUrl={taskTrackerInfo.taskUrl} style={{width:'max-content', marginLeft: '3px'}}/>
        </div>
      </div>
      <TextWithLabel label={'Comment'} value={blockedTest.comment} style={{height: 'max-content', minHeight: '20px', maxHeight: '300px', resize: 'vertical', marginTop: '20px'}}/>
    </div>

    <div style={{marginTop: '10px'}}>
      <Typography variant={'h6'} style={{color: customTheme.palette.text.faded}}>Related events</Typography>

      <div>
        <EventsList history={filteredHistory } refreshHistory={refreshHistory} setSelectedItem={setSelectedItem} style={{width: '100%', height: 'max-content', minHeight: '250px', maxHeight: 'calc(100vh - 360px)', opacity: '0.7', resize: 'vertical'}}></EventsList>
      </div>
    </div>

    <div style={{marginTop: '20px', display: 'flex', alignItems: 'center'}}>
      {
        isBlocked &&
        <Button
          startIcon={<LockOpenIcon />}
          variant={'contained'}
          size={'small'}
          onClick={handleClickUnblock}
        >Unblock</Button>
      }
      {
        !isBlocked &&
        <Button
          startIcon={<LockIcon />}
          variant={'contained'}
          size={'small'}
          color={'error'}
          onClick={handleClickBlock}
        >Block</Button>
      }
      <label style={{marginLeft: '10px'}}>This is test is { isBlocked ? 'blocked' : 'unblocked' } now</label>
    </div>
  </div>
})

export default SelectedBlockedTest