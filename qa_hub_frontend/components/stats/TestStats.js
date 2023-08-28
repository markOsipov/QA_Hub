import {useEffect, useState} from "react";
import {getCookie, QaHubCookies, setCookie} from "../../utils/CookieHelper";
import projectState from "../../state/ProjectState";
import {observer} from "mobx-react-lite";
import {getTestStats} from "../../requests/TestStatsRequests";
import TestRunsFilter from "../testRuns/testRunList/filters/TestRunsFilter";
import TestStatsTable from "./TestStatsTable";

const TestStats = observer (({...props}) => {
  let {selectedProject} = projectState

  const defaultFilter = {}
  const defaultSort = null

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
    await getTestStats(selectedProject, filter, testStats.length, loadMoreSize, sort).then((response) => {
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

    getTestStats(selectedProject, filterValue, initialSkip, loadMoreSize, sortValue).then(response => {
      setLoading(false)
      if (response.data) {
        setTestStats(response.data)
      }
    })
  }

  useEffect(() => {
    loadTestStats()
  }, [selectedProject])

  const updateLoadMoreCount = (event) => {
    setLoadMoreSize(Number.parseInt(event.target.value))
  }

  const saveCurrentLoadCount = () => {
    setCookie(loadMoreCookie, loadMoreSize)
  }

  return <div>
    <TestRunsFilter filter={filter} setFilter={setFilter} filterAndLoad={filterAndLoad} title={"Test stats by testruns"} loading={loading}/>

    <TestStatsTable testStats={testStats} sort={sort} sortTestStats={sortTestStats}/>
  </div>
})

export default TestStats