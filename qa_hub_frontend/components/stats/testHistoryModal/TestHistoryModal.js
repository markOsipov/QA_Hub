import {Box, Modal} from "@mui/material";
import Typography from "@mui/material/Typography";
import {modalStyle} from "../../../styles/ModalStyle";
import projectState from "../../../state/ProjectState";
import {useEffect, useState} from "react";
import {observer} from "mobx-react-lite";
import {getTestHistory, getTestStats} from "../../../requests/TestStatsRequests";
import StatsTestRunsFilter from "../filter/StatsTestRunsFilter";
import TestHistoryTable from "./TestHistoryTable";


const TestHistoryModal = observer(({isOpen, onClose, testcaseId}) => {
  const {selectedProject} = projectState
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

    getTestHistory(selectedProject, testcaseId, filterValue).then(response => {
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
    <Box sx={{...modalStyle, minWidth: '1500px'}}>
      <Typography variant="h6" component="h2" style={{marginBottom: "5px"}}>
        {testcaseId}
      </Typography>

      <StatsTestRunsFilter filter={filter} setFilter={setFilter} filterAndLoad={filterAndLoad} loading={loading} />

      <TestHistoryTable testHistoryResults={testHistory.results || []} style={{ maxHeight: '80vh', minHeight: '50vh', marginTop:'10px'}}/>

    </Box>
  </Modal>
})

export default TestHistoryModal;