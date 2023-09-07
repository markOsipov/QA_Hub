import {useEffect, useState} from "react";
import {getCookie, QaHubCookies, setCookie} from "../../utils/CookieHelper";
import projectState from "../../state/ProjectState";
import {observer} from "mobx-react-lite";
import {getTestStats} from "../../requests/TestStatsRequests";
import TestStatsTable from "./TestStatsTable";
import StyledTextField from "../primitives/StyledTextField";
import LoadMoreTestStatsButton from "./LoadMoreTestStatsButton";
import StatsTestRunsFilter from "./filter/StatsTestRunsFilter";
import TestHistoryModal from "./testHistoryModal/TestHistoryModal";
import {useRouter} from "next/router";

const TestStats = observer (({...props}) => {
  const router = useRouter()
  const project = router.query.project

  const [testHistoryModalOpen, setTestHistoryModalOpen] = useState(router.query.testHistory != null)
  const [selectedTestId, setSelectedTestId] = useState(router.query.testHistory || null)

  const openTestHistoryModal = (fullName) => {
    setSelectedTestId(fullName)
    router.query.testHistory = fullName
    router.replace(router).then(() => {
      setTestHistoryModalOpen(true)
    })
  }

  const closeTestHistoryModal = (fullName) => {
    delete router.query.testHistory
    router.replace(router).then(() => {
      setTestHistoryModalOpen(false)
      setSelectedTestId(null)
    })
  }

  const defaultFilter = {}
  const defaultSort = {
    fieldName: 'fullName',
    isAscending: true
  }

  let [testStats, setTestStats] = useState([])
  let [filter, setFilter] = useState(defaultFilter)
  let [sort, setSort] = useState(defaultSort)

  const loadMoreCookie = QaHubCookies.testStatsLoadCount
  const defaultLoadSize = 50
  const initialLoadSize = Number.parseInt(getCookie(loadMoreCookie)) || defaultLoadSize
  const initialSkip = 0

  const [loadMoreSize, setLoadMoreSize] = useState(initialLoadSize)
  const [lastTestStatsLoaded, setLastTestStatsLoaded] = useState(false)
  const [loading, setLoading] = useState(false)

  const loadTestStats = async () => {
    setLoading(true)
    await getTestStats(project, filter, testStats.length, loadMoreSize, sort).then((response) => {
      setLoading(false)
      if (response.data) {
        setTestStats([...testStats, ...response.data])

        if (response.data.length < loadMoreSize || response.data.length === 0) {
          setLastTestStatsLoaded(true)
        }
      }
    })
  }

  function sortTestStats(fieldName, isAscending) {
    const newSort = { fieldName: fieldName, isAscending: isAscending }
    setSort(newSort)

    filterAndLoad(filter, newSort)
  }

  function filterAndLoad(newFilter, newSort) {
    setLoading(true)

    const filterValue = newFilter || filter || defaultFilter
    const sortValue = newSort || sort || defaultSort

    setFilter(filterValue)
    setSort(sortValue)

    setLastTestStatsLoaded(false)

    getTestStats(project, filterValue, initialSkip, loadMoreSize, sortValue).then(response => {
      setLoading(false)
      if (response.data) {
        setTestStats(response.data)
      }
    })
  }

  useEffect(() => {
    loadTestStats()
  }, [project])

  const updateLoadMoreCount = (event) => {
    setLoadMoreSize(Number.parseInt(event.target.value))
  }

  const saveCurrentLoadCount = () => {
    setCookie(loadMoreCookie, loadMoreSize)
  }

  return <div>
    <TestHistoryModal isOpen={testHistoryModalOpen} onClose={closeTestHistoryModal} testcaseId={selectedTestId} />
    <StatsTestRunsFilter filter={filter} setFilter={setFilter} filterAndLoad={filterAndLoad} loading={loading} style={{margin: '10px'}}/>

    <div style={{maxHeight: 'calc(100vh - 165px)', overflowY: 'auto', marginLeft: '10px'}}>
      <TestStatsTable testStats={testStats} sort={sort} sortTestStats={sortTestStats} openTestHistoryModal={openTestHistoryModal}/>
      {
        !lastTestStatsLoaded &&
        <LoadMoreTestStatsButton
          loadMoreSize={loadMoreSize}
          loadMoreTestStats={loadTestStats}
          style={{marginTop: '25px'}}
        />
      }
      <div style={{marginTop: '11px', paddingLeft: '4px', opacity: '0.55'}}>
        <div style={{display: 'flex'}}>
          <label >{`Test stats loaded: ${testStats.length}`}</label>
          <div style={{flexGrow: '1.1'}}></div>

          <div style={{display: 'flex', alignItems: 'center'}}>
            <label style={{fontSize: '12px', marginRight: '5px'}}>Load count</label>
            <StyledTextField
              size={"tiny"}
              value={loadMoreSize}
              onChange={updateLoadMoreCount}
              onBlur={saveCurrentLoadCount}
              style={{width: 'min-content', minWidth: '50px'}}
              type={'number'}
            />
          </div>
        </div>
      </div>
    </div>
  </div>
})

export default TestStats