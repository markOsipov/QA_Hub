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

const TestRunList = observer(({...props}) => {
  let {selectedProject} = projectState

  let [testRuns, setTestRuns] = useState([])
  let [filter, setFilter] = useState({})

  const loadMoreCookie = QaHubCookies.testRunsLoadCount
  const defaultLoadSize = 50
  const initialLoadSize = Number.parseInt(getCookie(loadMoreCookie)) || defaultLoadSize
  const initialSkip = 0

  const [loadMoreSize, setLoadMoreSize] = useState(initialLoadSize)
  const [lastTestRunLoaded, setLastTestRunLoaded] = useState(false)

  const loadTestRuns = async () => {
    await getTestRuns(selectedProject, filter, testRuns.length, loadMoreSize).then((response) => {
      if (response.data) {
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
    getTestRuns(selectedProject, filterValue, initialSkip, loadMoreSize).then(response => {
      if (response.data) {
        setTestRuns(response.data)
      }
    })
  }

  useEffect(() => {
    loadTestRuns()
  }, [selectedProject])

  const updateLoadMoreCount = (event) => {
    setLoadMoreSize(Number.parseInt(event.target.value))
  }

  const saveCurrentLoadCount = () => {
    setCookie(loadMoreCookie, loadMoreSize)
  }


  return <div style={{...props.style}}>
    <PushTestRunModal/>
    <TestRunsFilter filter={filter} setFilter={setFilter} filterAndLoad={filterAndLoad}/>
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
          loadMoreTestRuns={loadTestRuns}
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