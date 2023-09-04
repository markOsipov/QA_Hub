import {Accordion, AccordionDetails, Paper} from "@mui/material";
import TestRetriesTabs from "./retries/TestRetriesTabs";
import TextWithLabel from "../../../primitives/TextWithLabel";
import Typography from "@mui/material/Typography";
import TestStatusWithRetries from "../../../common/TestStatusWithRetries";
import {observer} from "mobx-react-lite";
import testResultsState from "../../../../state/testResults/TestResultsState";
import ErrorMessage from "./retries/ErrorMessage";
import QaResolutionPanel from "./retries/QaResolutionPanel";
import StyledAccordionSummary from "../../../primitives/StyledAccordeonSummary";
import StyledTooltip from "../../../primitives/StyledTooltip";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import AppleIcon from "@mui/icons-material/Apple";
import TestResultActions from "./TestResultActions";
import {useState} from "react";
import {useRouter} from "next/router";
import TestHistoryModal from "../../../stats/testHistoryModal/TestHistoryModal";

const TestResultDetails = observer(({ ...props }) => {
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
      return <div>Not selected</div>
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
              <div style={{maxWidth: 'min-content', overflowX: 'hidden', position: 'relative', marginLeft: '15px', top: '-1px'}}>
                <TestResultShortName testResult={selectedTest} action={() => openTestHistoryModal(selectedTest.fullName)} style={{marginLeft: '5px',}}/>
                <Typography variant={'h6'} style={{marginLeft: '15px', width: 'max-content', fontSize: '14px', opacity: '0.5'}}>{selectedTest.fullName}</Typography>
              </div>
              <TestStatusWithRetries
                status={selectedTest.status}
                retries={selectedTest.retries}
                style={{
                  position: 'relative',
                  top: '12px',
                  marginLeft: '25px'
              }}/>
            </div>

            {
              selectedTest.message != null &&
              <div style={{display: "flex", marginTop: '15px'}}>
                <ErrorMessage
                  message={selectedTest.message}
                  style={{width: '50%'}}
                />
                {
                  selectedTest && selectedTest.status === "FAILURE" &&
                  <QaResolutionPanel testResult={selectedTest} style={{marginLeft: '30px'}}/>
                }
              </div>
            }

            <div style={{display: 'flex', marginTop: '25px', marginLeft: '5px'}}>
              <StyledTooltip title={'Duration'}>
                <div style={{display: 'flex', alignItems: 'center'}}>
                  <AccessTimeFilledIcon />
                  <label style={{marginLeft: '5px'}}>{ Number.parseInt(selectedTest.duration) }s</label>
                </div>
              </StyledTooltip>

              <StyledTooltip title={'Device model'}>
                <div style={{display: 'flex', alignItems: 'center', marginLeft: '20px'}}>
                  <PhoneIphoneIcon />
                  <label style={{marginLeft: '5px'}}>{ selectedTest.device }</label>
                </div>
              </StyledTooltip>

              <StyledTooltip title={'Runtime'}>
                <div style={{display: 'flex', alignItems: 'center', marginLeft: '20px'}}>
                  <AppleIcon />
                  <label style={{marginLeft: '5px'}}>{ selectedTest.deviceRuntime }</label>
                </div>
              </StyledTooltip>
            </div>

          </div>

          <TestResultActions testResult={selectedTest} style={{position: 'absolute', right: '10px', bottom: '10px'}}/>
        </Paper>

        <Accordion style={{ marginTop: '15px'}}>
          <StyledAccordionSummary
            style={{maxWidth: "max-content"}}
            aria-controls="panel1a-content"
          >
            <Typography variant="h5" style={{marginBottom: "5px", marginTop: "5px"}}>Details</Typography>
          </StyledAccordionSummary>

          <AccordionDetails style={{padding: '15px 10px'}}>
            <TestRetriesTabs/>
          </AccordionDetails>
        </Accordion>

      </div>
    }
  }

  return <div style={{...props.style}}>
    {
      renderContent()
    }
  </div>
})

const TestResultShortName = ({testResult, action, ...props}) => {
  const [hovered, setHovered] = useState(false)
  function getShortName(testResult) {
    return testResult.fullName.substring(testResult.fullName.lastIndexOf(".") + 1)
  }

  return <Typography
    variant={'h6'}
    onClick={action}
    onMouseOver={() => setHovered(true)}
    onMouseLeave={() => setHovered(false)}
    onBlur={() => setHovered(false)}
    style={{
      cursor: "pointer",
      padding: '0 10px',
      backgroundColor: hovered && 'rgba(255, 255, 255, 0.09)',
      width: 'max-content',
      ...props.style
    }}
  >{getShortName(testResult)}</Typography>
}
export default TestResultDetails