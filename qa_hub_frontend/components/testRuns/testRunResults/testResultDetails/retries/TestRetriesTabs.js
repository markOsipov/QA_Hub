import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import {useEffect, useState} from "react";
import {getTestRetries} from "../../../../../requests/testResults/TestResultsRequests";
import RetryTab from "./RetryTab";
export default function TestRetriesTabs({ testResult, testResults, setTestResults, ...props }) {

  const [tabValue, setTabValue] = useState('0');
  const [retries, setRetries] = useState([])

  useEffect(() => {
    getTestRetries(testResult.testRunId, testResult.fullName).then((data) => {
      setRetries(data.data)
    })
  }, [testResult.testRunId, testResult.fullName])

  useEffect(() => {
    setTabValue('0')
  },[testResult.testRunId, testResult.fullName])

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return <Box style={{...props.style}}>
    <TabContext value={tabValue}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
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
          return <TabPanel  key={`RetryPanel${retry.retry}`} value={String(retries.length - index - 1)} style={{padding: '24px 5px 0px 5px'}}>
            <RetryTab
              retry={retry}
              testResult={testResult}
              isLastRetry={retries.length - index - 1 === 0 }
              testResults={testResults}
              setTestResults={setTestResults}
            />
          </TabPanel>
        })
      }
    </TabContext>
  </Box>
}