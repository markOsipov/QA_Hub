import {observer} from "mobx-react-lite";
import projectState from "../../../state/ProjectState";
import {useEffect, useState} from "react";
import {getTestRuns} from "../../../requests/testRuns/TestRunRequests";
import TestRunCard from "./testRun/TestRunCard";
import TestRunsFilter from "./filters/TestRunsFilter";
import StyledTextField from "../../primitives/StyledTextField";
import LoadMoreTestRunsButton from "./LoadMoreTestRunsButtons";
import {getCookie, QaHubCookies, setCookie} from "../../../utils/CookieHelper";
import PushTestRunModal from "../pushTestRunModal/PushTestRunModal";
import {useRouter} from "next/router";
import TestRunForm from "../testRunForms/TestRunForm";

const TestRunList = observer(({...props}) => {
  const router = useRouter()
  const project = projectState.selectedProject

  let [testRuns, setTestRuns] = useState([])
  let [filter, setFilter] = useState({})
  const [loading, setLoading] = useState(false)

  const loadMoreCookie = QaHubCookies.testRunsLoadCount
  const defaultLoadSize = 50
  const initialLoadSize = Number.parseInt(getCookie(loadMoreCookie)) || defaultLoadSize
  const initialSkip = 0

  const [loadMoreSize, setLoadMoreSize] = useState(initialLoadSize)
  const [lastTestRunLoaded, setLastTestRunLoaded] = useState(false)

  const loadMoreTestRuns = async () => {
    setLoading(true)
    await getTestRuns(project, filter, testRuns.length, loadMoreSize).then((response) => {
      setLoading(false)
      if (response.data != null) {
        setTestRuns([...testRuns, ...response.data])

        if (response.data.length < loadMoreSize || response.data.length === 0) {
          setLastTestRunLoaded(true)
        }
      }
    })
  }

  function filterAndLoad(filter) {
    const filterValue = filter || {}
    setFilter(filterValue)
    setLastTestRunLoaded(false)

    setLoading(true)
    getTestRuns(project, filterValue, initialSkip, loadMoreSize).then(response => {
      setLoading(false)
      if (response.data) {
        setTestRuns(response.data)

        if (response.data.length < loadMoreSize || (response.data.length || 0) === 0) {
          setLastTestRunLoaded(true)
        }
      }
    })
  }

  function reloadTestRuns() {
    setLastTestRunLoaded(false)

    setLoading(true)
    getTestRuns(project, filter, initialSkip, loadMoreSize).then((response) => {
      setLoading(false)
      if (response.data != null) {
        setTestRuns(response.data)

        if (response.data.length < loadMoreSize || (response.data.length || 0) === 0) {
          setLastTestRunLoaded(true)
        }
      }
    })
  }

  useEffect(() => {
    reloadTestRuns()
  }, [project])

  const updateLoadMoreCount = (event) => {
    setLoadMoreSize(Number.parseInt(event.target.value))
  }

  const saveCurrentLoadCount = () => {
    setCookie(loadMoreCookie, loadMoreSize)
  }


  return <div style={{...props.style}}>
    <PushTestRunModal reloadTestRuns={reloadTestRuns}/>

    <TestRunForm reloadTestRuns={reloadTestRuns} />
    <TestRunsFilter filter={filter} setFilter={setFilter} filterAndLoad={filterAndLoad} loading={loading} style={{marginTop: '10px'}}/>
    <div style={{minWidth: 'max-content'}}>
      {
        testRuns.map((testRun, index) => {
          return <TestRunCard
            testRun={testRun}
            key={index}
            style={{marginTop: "15px", minWidth: 'max-content'}}
            filter={filter}
            setFilter={setFilter}
            filterAndLoad={filterAndLoad}
          />
        })
      }
      {
        !lastTestRunLoaded &&
        <LoadMoreTestRunsButton
          loadMoreSize={loadMoreSize}
          loadMoreTestRuns={loadMoreTestRuns}
          style={{marginTop: '25px'}}
        />
      }
      <div style={{marginTop: '11px', paddingLeft: '4px', opacity: '0.55'}}>
        <div style={{display: 'flex'}}>
          <label >{`Test runs loaded: ${testRuns.length}`}</label>
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

export default TestRunList