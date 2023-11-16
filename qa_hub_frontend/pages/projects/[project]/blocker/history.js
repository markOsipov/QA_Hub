import {useEffect, useState} from "react";
import {observer} from "mobx-react-lite";
import {useRouter} from "next/router";
import {getBlockedTestsHistory} from "../../../../requests/BlockerRequests";
import { Paper } from "@mui/material";
import EventsList from "../../../../components/blocker/history/EventsList";
import SelectedBlockedTest from "../../../../components/blocker/history/SelectedBlockedTest";
import blockerState from "../../../../state/BlockerState";
import StyledTextField from "../../../../components/primitives/StyledTextField";
import CustomIconButton from "../../../../components/primitives/CustomIconButton";
import CancelIcon from "@mui/icons-material/Cancel";
import {customTheme} from "../../../../styles/CustomTheme";
import CloseIcon from "@mui/icons-material/Close";
import StyledTooltip from "../../../../components/primitives/StyledTooltip";

const BlockedTestsHistoryPage = observer(() => {
  const router = useRouter()

  const project = router.query.project
  const [history, setHistory] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [filter, setFilter] = useState("")

  function refreshHistory() {
    getBlockedTestsHistory(project).then(response => {
      if (response.data) {
        setHistory(response.data)
      }
    })
  }

  useEffect(() => {
    refreshHistory()
    blockerState.updateBlockedTests(project)
  }, [project])

  return <>
    <Paper elevation={3} style={{margin: "10px", height: "calc(100vh - 85px)", overflowY: "auto", width: "calc(100% - 20px)", display: 'flex', padding: '10px' }}>
      <div style={{width: 'calc(50%)', maxHeight: 'calc(100vh - 150px)', marginRight: '10px'}}>
        <EventsList
          history={history}
          refreshHistory={refreshHistory}
          setSelectedItem={setSelectedItem}
          filter={filter}
          style={{maxHeight: 'calc(100vh - 150px)'}}
        />

        <div style={{display: 'flex', alignItems: 'center'}}>
          <StyledTextField value={filter}
                           size="tiny"
                           label="Filter"
                           style={{minWidth: "400px", color: "white", margin: "8px"}}
                           autoComplete='off'
                           onChange ={(event) => {
                             setFilter(event.target.value)
                           }}
          />
          <StyledTooltip title={'Clear'}>
            <div>
              <CustomIconButton icon={<CloseIcon/>} action={() => {setFilter("")}} color={customTheme.palette.error.main} style={{marginLeft: '0Ï'}}/>
            </div>
          </StyledTooltip>

        </div>
      </div>
      <SelectedBlockedTest history={history} refreshHistory={refreshHistory} selectedItem={selectedItem} setSelectedItem={setSelectedItem}/>
    </Paper>
  </>
})

export default BlockedTestsHistoryPage


