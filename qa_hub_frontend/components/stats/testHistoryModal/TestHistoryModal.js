import {Box, Modal} from "@mui/material";
import Typography from "@mui/material/Typography";
import {modalStyle} from "../../../styles/ModalStyle";
import projectState from "../../../state/ProjectState";
import {useEffect, useState, useRef} from "react";
import {observer} from "mobx-react-lite";
import {getTestHistory, getTestStats} from "../../../requests/TestStatsRequests";
import StatsTestRunsFilter from "../filter/StatsTestRunsFilter";
import TestHistoryTable from "./TestHistoryTable";
import TestHistoryStats from "./TestHistoryStats";
import {useRouter} from "next/router";
import { ContactPageSharp } from "@mui/icons-material";
import { tr } from "date-fns/locale";

const TestHistoryModal = observer(({isOpen, onClose, testcaseId}) => {
  const testNameRef = useRef(null)
  const testStatsRef = useRef(null)

  const router = useRouter()
  const project = router.query.project
  const [testHistory, setTestHistory] = useState({})

  const [positioning, setPositioning] = useState("grid")

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

  useEffect(() => {
   
    const handleResize = () => {      
        setPositioning(calcPositioning())
    };

    window.addEventListener("resize", handleResize);
    return () => {
        window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {    
    setPositioning(calcPositioning())    
  }, [testHistory.results])

  const calcPositioning = () => {   
    try {
      const windowWidth = window.innerWidth
      const nameWidth = testNameRef.current.clientWidth
      const statsWidth = testStatsRef.current.clientWidth

      if (windowWidth * 0.95 < nameWidth + statsWidth) {
        return "grid"
      }
    } catch {}
    
    return "flex"
  }

  return <Modal
    open={isOpen}
    onClose={handleClose}
  >
    <Box sx={{...modalStyle, padding: '10px 15px', minWidth: '1500px'}}>
      <div style={{display: positioning, alignItems: 'center', margin: '10px 10px 15px 10px'}}>
        <label ref={testNameRef} style={{fontSize: '20px', marginRight: '20px', flexGrow: '1.1', width: 'min-content', marginBottom: '15px'}}>{testHistory.fullName || testcaseId}</label>
        {
          testHistory.results &&
          <TestHistoryStats innerRef={testStatsRef} testHistory={testHistory} style={{marginBottom: '15px',  width: 'min-content'}}/>
        }
      </div>
      <StatsTestRunsFilter filter={filter} setFilter={setFilter} filterAndLoad={filterAndLoad} loading={loading} />
      <TestHistoryTable testHistoryResults={testHistory.results || []} style={{ maxHeight: 'calc(100vh - 210px)', minHeight: '50vh', marginTop:'10px'}}/>

    </Box>
  </Modal>
})

export default TestHistoryModal;