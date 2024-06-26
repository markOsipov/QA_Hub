import {Accordion, AccordionDetails, Paper} from "@mui/material";
import TestRetriesTabs from "./retries/TestRetriesTabs";
import TextWithLabel from "../../../primitives/TextWithLabel";
import Typography from "@mui/material/Typography";
import TestStatusWithRetries from "../../../common/TestStatusWithRetries";
import {observer} from "mobx-react-lite";
import testResultsState from "../../../../state/testResults/TestResultsState";
import TestResultActions from "./TestResultActions";
import {useState} from "react";
import {useRouter} from "next/router";
import TestHistoryModal from "../../../stats/testHistoryModal/TestHistoryModal";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {customTheme} from "../../../../styles/CustomTheme";
import alertState from "../../../../state/AlertState";
import {copyToClipboard} from "../../../../utils/CopyHelper";
import TestResultTags from "./TestResultTags";
import projectState from "../../../../state/ProjectState";

const TestResultDetails = observer(({...props }) => {
  const router = useRouter()
  const {  selectedTest } = testResultsState

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
  const renderContent = () => {
    if (selectedTest == null) {
      return <div style={{display: 'grid', placeItems: 'center', width: '100%' }}>
        <Typography variant={'h5'} style={{color: customTheme.palette.text.disabled}}>Not selected</Typography>
      </div>
    } else {
      return <div>
        <TestHistoryModal isOpen={testHistoryModalOpen} onClose={closeTestHistoryModal} testcaseId={selectedTestId} />
        <Paper style={{padding: '15px 10px', position: 'relative'}}>
          <div style={{padding: '2px 2px'}}>
            <div style={{display: 'flex', marginLeft: '8px'}}>
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
                  top: '15px',
                  marginRight: '7px'
                }}
                label={'TestcaseId'}
                value={selectedTest.testcaseId}
                labelStyle={{ justifySelf: 'center'}}
              />
              <div style={{maxWidth: 'min-content', overflowX: 'hidden', position: 'relative', top: '-1px'}}>
                <TestResultShortName testResult={selectedTest} action={() => openTestHistoryModal(selectedTest.fullName)} style={{marginLeft: '5px',}}/>
                <TestResultFullName testResult={selectedTest} />
              </div>
              <TestStatusWithRetries
                status={selectedTest.status}
                retries={selectedTest.retries}
                style={{
                  position: 'relative',
                  top: '12px',
                  marginLeft: '7px'
              }}/>
            </div>
          </div>
          <TestResultTags style={{position: 'absolute', right: '5px', top: '5px'}} tags={selectedTest.tags} />
          <TestResultActions testResult={selectedTest} style={{position: 'absolute', right: '10px', bottom: '10px'}}/>
        </Paper>

        <Paper style={{ marginTop: '15px', padding: '10px 15px'}}>
            <TestRetriesTabs/>
        </Paper>
      </div>
    }
  }

  return <div style={{...props.style}}>
    {
      renderContent()
    }
  </div>
})

const TestResultShortName = observer(({testResult, action, ...props}) => {
  const [nameHovered, setNameHovered] = useState(false)
  const [copyIconHovered, setCopyIconHovered] = useState(false)
  const shortName = projectState.getShortName(testResult)


  function copyTestName() {
    copyToClipboard(shortName)
    alertState.showAlert("Test short name has been copied", alertState.severities.success)
  }

  return <div
    style={{display: 'flex', alignItems: 'center'}}
  >
    <Typography
      variant={'h6'}
      onClick={action}
      onMouseOver={() => setNameHovered(true)}
      onMouseLeave={() => setNameHovered(false)}
      onBlur={() => setNameHovered(false)}
      style={{
         cursor: "pointer",
         padding: '0 10px',
         backgroundColor: nameHovered && 'rgba(255, 255, 255, 0.09)',
        width: 'max-content',
        ...props.style
      }}
    >{shortName}</Typography>
    {
      <div
        style={{display: 'flex', position: 'relative', left: '-6px'}}
      >
        <div
          style={{
            padding: '3px',
            display: 'grid',
            alignItems: 'center',
            justifyItems: 'center',
            cursor: 'pointer'
          }}
          onClick={copyTestName}
          onMouseOver={() => setCopyIconHovered(true)}
          onMouseLeave={() => setCopyIconHovered(false)}
          onBlur={() => setCopyIconHovered(false)}
        >
          <ContentCopyIcon
            style={{
              transform: 'scale(-1, 0.8)',
              color: copyIconHovered ? customTheme.palette.text.white : customTheme.palette.text.disabled,
              fontSize: '18px',
            }}
          />
        </div>
      </div>
    }
  </div>
})

const TestResultFullName = observer(({testResult}) => {
  const [copyIconHovered, setCopyIconHovered] = useState(false)
  function copyFullTestName() {
    copyToClipboard(testResult.fullName)
    alertState.showAlert("Test full name has been copied", alertState.severities.success)
  }

  return <div
    style={{display: 'flex', alignItems: 'center', position: 'relative'}}
  >
    <Typography variant={'h6'} style={{marginLeft: '15px', width: 'max-content', fontSize: '14px', opacity: '0.5', padding: '3px 0px'}}>{testResult.fullName}</Typography>
    <div style={{minWidth: '30px'}}>
      {
        <div
          style={{
            marginLeft: '3px',
            padding: '3px 0px',
            display: 'grid',
            alignItems: 'center',
            justifyItems: 'center',
            cursor: 'pointer',
            position: 'relative',
            top: '-2px',
            width: '24px',
            height: '24px'
          }}
          onClick={copyFullTestName}
          onMouseOver={() => setCopyIconHovered(true)}
          onMouseLeave={() => setCopyIconHovered(false)}
          onBlur={() => setCopyIconHovered(false)}
        >
          <ContentCopyIcon
            style={{
              transform: 'scale(-1, 0.8)',
              color: copyIconHovered ? customTheme.palette.text.white : customTheme.palette.text.disabled,
              fontSize: '18px',
            }}
          />
        </div>
      }
    </div>
  </div>
})

export default TestResultDetails