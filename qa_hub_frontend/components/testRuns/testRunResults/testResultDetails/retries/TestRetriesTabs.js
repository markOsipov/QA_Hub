import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import {useEffect, useState} from "react";
import {getTestRetries} from "../../../../../requests/testResults/TestResultsRequests";
import RetryTab from "./RetryTab";
import testResultsFilter from "../../testResultsList/filters/TestResultsFilter";
import {observer} from "mobx-react-lite";
import testResultsFilterState from "../../../../../state/testResults/TestResultsFilterState";
import testResultsState from "../../../../../state/testResults/TestResultsState";
import Loader from "../../../../common/Loader";

const TestRetriesTabs = observer(({ ...props }) => {
  const {selectedTest} = testResultsState
  const [tabValue, setTabValue] = useState('0');
  const [retries, setRetries] = useState([])
  const [retriesLoading, setRetriesLoading] = useState(false)

  useEffect(() => {
    setRetriesLoading(true)

    const testRunId = selectedTest.testRunId
    const fullName = selectedTest.fullName

    function currentTestHasNotChanged() {
      return testRunId ==  selectedTest.testRunId && fullName == selectedTest.fullName
    }

    getTestRetries(selectedTest.testRunId, selectedTest.fullName).then((data) => {
      if (currentTestHasNotChanged) {
        setRetries(data.data)
        setRetriesLoading(false)
      }
    })
  }, [selectedTest.testRunId, selectedTest.fullName])

  useEffect(() => {
    setTabValue('0')
  },[selectedTest.testRunId, selectedTest.fullName])

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  function TabContent({retriesLoading, handleChange}) {
    if (retriesLoading) {
      return <div style={{...props.style, display: 'flex', alignItems: 'center', marginTop: '12px', marginLeft: '10px'}}>
      <Loader style={{marginRight: '5px'}}/>{ "Test retries are loading" }
    </div>
    }

    return <TabContext value={tabValue}>
    <Box sx={{ borderBottom: 1, borderColor: 'divider', width: 'min-content' }}>
      <TabList onChange={handleChange}>
        {
          retries.map((retry, index) => {
            return <Tab label={`Retry ${retry.retry}`} value={String(retries.length - index - 1)} key={`RetryTab${retry.retry}`} style={{color: 'white'}}/>
          })
        }
      </TabList>
    </Box>
    {
      retries.map((retry, index) => {
        return <TabPanel  key={`RetryPanel${retry.retry}`} value={String(retries.length - index - 1)} style={{padding: '0 5px'}}>
          <RetryTab
            retry={retry}
            isLastRetry={retries.length - index - 1 === 0 }
          />
        </TabPanel>
      })
    }
  </TabContext>
  }

  return <Box style={{...props.style}}>
    <TabContent retriesLoading={retriesLoading} tabValue={tabValue} handleChange={handleChange} />
  </Box>
})

export default TestRetriesTabs