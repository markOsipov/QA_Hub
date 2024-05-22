import TextWithLabel from "../../../primitives/TextWithLabel";
import Typography from "@mui/material/Typography";
import {Card} from "@mui/material";
import {useState} from "react";
import TestStatusWithRetries from "../../../common/TestStatusWithRetries";
import {useRouter} from "next/router";
import testResultsState from "../../../../state/testResults/TestResultsState";
import {observer} from "mobx-react-lite";
import projectState from "../../../../state/ProjectState";

const TestResultCard = observer(({testResult, ...props}) => {
  const router = useRouter()
  const [isHovering, setIsHovered] = useState(false);
  const onMouseEnter = () => setIsHovered(true);
  const onMouseLeave = () => setIsHovered(false);

  const handleTestResultCardClick = () => {
    testResultsState.setSelectedTest(testResult)
    router.query.test = (testResult.testcaseId != null && testResult.testcaseId.length > 0) ? testResult.testcaseId : testResult.fullName
    router.replace(router)
  }

  return <Card
    style={{
      display: 'flex',
      backgroundColor: isHovering ? 'rgba(255, 255, 255, 0.10)' : testResultsState.selectedTest?.fullName === testResult.fullName ? 'rgba(255, 255, 255, 0.13)': 'rgba(255, 255, 255, 0.05)',
      cursor: 'pointer',
      border: '1px solid rgba(0, 0, 0, 0.3)',
      boxShadow: '2px 2px 0 rgba(0, 0, 0, 0.25)',
      ...props.style
  }}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    onClick={handleTestResultCardClick}
  >
    <div
      style={{
        display: 'flex',
        width: '100%',
        alignItems: 'center'
      }}
    >
      <TextWithLabel
        style={{
          fontSize: "12px",
          width: "max-content",
          padding: "5px 6px",
          minHeight: 'unset',
          minWidth: '70px',
          display: 'grid',
          justifyItems: 'center',
          height: 'min-content',
          position: 'relative',
          top: '6px',
          marginRight: '7px'
        }}
        label={'TestcaseId'}
        value={testResult.testcaseId}
        labelStyle={{ justifySelf: 'center'}}
      />

      <div style={{maxWidth: 'min-content', overflowX: 'hidden', position: 'relative', marginRight: '5px', top: '-1px'}}>
        <Typography variant={'h6'} style={{marginLeft: '15px', width: 'max-content'}}>{projectState.getShortName(testResult)}</Typography>
        <Typography variant={'h6'} style={{marginLeft: '15px', width: 'max-content', fontSize: '14px', opacity: '0.5'}}>{testResult.fullName}</Typography>
      </div>
      <div style={{flexGrow: '1.1'}}></div>
      <TestStatusWithRetries status={testResult.status} retries={testResult.retries} />

    </div>
  </Card>
})

export default TestResultCard