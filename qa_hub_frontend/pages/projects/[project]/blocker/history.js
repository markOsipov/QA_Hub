import {useEffect, useState} from "react";
import {observer} from "mobx-react-lite";
import {useRouter} from "next/router";
import {getBlockedTestsHistory} from "../../../../requests/BlockerRequests";
import { Paper } from "@mui/material";
import EventsList from "../../../../components/blocker/history/EventsList";
import SelectedBlockedTest from "../../../../components/blocker/history/SelectedBlockedTest";
import blockerState from "../../../../state/BlockerState";

const BlockedTestsHistoryPage = observer(() => {
  const router = useRouter()

  const project = router.query.project
  const [history, setHistory] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)

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
      <EventsList history={history} refreshHistory={refreshHistory} setSelectedItem={setSelectedItem}  style={{width: 'calc(50%)', maxHeight: '90vh', marginRight: '10px'}}/>
      <SelectedBlockedTest history={history} refreshHistory={refreshHistory} selectedItem={selectedItem} setSelectedItem={setSelectedItem}/>
    </Paper>
  </>
})

export default BlockedTestsHistoryPage


