import {Box, Modal} from "@mui/material";
import Typography from "@mui/material/Typography";
import {modalStyle} from "../../../styles/ModalStyle";
import projectState from "../../../state/ProjectState";
import {useEffect, useState} from "react";
import {observer} from "mobx-react-lite";
import {getTestHistory, getTestStats} from "../../../requests/TestStatsRequests";
import StatsTestRunsFilter from "../filter/StatsTestRunsFilter";
import TestHistoryTable from "./TestHistoryTable";
import TestHistoryStats from "./TestHistoryStats";
import {useRouter} from "next/router";


const TestHistoryModal = observer(({isOpen, onClose, testcaseId}) => {
  const router = useRouter()
  const project = router.query.project
  const [testHistory, setTestHistory] = useState({})

  const defaultFilter = {}
  let [filter, setFilter] = useState(defaultFilter)

  const [loading, setLoading] = useState(false)
  const handleClose = () => {
    onClose()
  }

  useEffect(() => {
    setTestHistory({})
    if (testcaseId) {
      filterAndLoad(defaultFilter)
    }
  }, [testcaseId])

  function filterAndLoad(newFilter) {
    setLoading(true)

    const filterValue = newFilter || filter || defaultFilter
    setFilter(filterValue)

    getTestHistory(project, testcaseId, filterValue).then(response => {
      setLoading(false)
      if (response.data) {
        setTestHistory(response.data)
      }
    })
  }

  return <Modal
    open={isOpen}
    onClose={handleClose}
  >
    <Box sx={{...modalStyle, padding: '10px 15px', minWidth: '1500px'}}>
      <div style={{display: 'flex', alignItems: 'center', margin: '10px 10px 15px 10px'}}>
        <label style={{fontSize: '20px', marginRight: '20px', flexGrow: '1.1'}}>{testHistory.fullName || testcaseId}</label>
        {
          testHistory.results &&
          <TestHistoryStats testHistory={testHistory}/>
        }
      </div>
      <StatsTestRunsFilter filter={filter} setFilter={setFilter} filterAndLoad={filterAndLoad} loading={loading} />
      <TestHistoryTable testHistoryResults={testHistory.results || []} style={{ maxHeight: 'calc(100vh - 210px)', minHeight: '50vh', marginTop:'10px'}}/>

    </Box>
  </Modal>
})

export default TestHistoryModal;