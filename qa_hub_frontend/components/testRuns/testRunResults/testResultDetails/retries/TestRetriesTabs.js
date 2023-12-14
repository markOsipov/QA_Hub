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
const TestRetriesTabs = observer(({ ...props }) => {
  const {selectedTest} = testResultsState
  const [tabValue, setTabValue] = useState('0');
  const [retries, setRetries] = useState([])

  useEffect(() => {
    getTestRetries(selectedTest.testRunId, selectedTest.fullName).then((data) => {
      setRetries(data.data)
    })
  }, [selectedTest.testRunId, selectedTest.fullName])

  useEffect(() => {
    setTabValue('0')
  },[selectedTest.testRunId, selectedTest.fullName])

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return <Box style={{...props.style}}>
    <TabContext value={tabValue}>
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
  </Box>
})

export default TestRetriesTabs