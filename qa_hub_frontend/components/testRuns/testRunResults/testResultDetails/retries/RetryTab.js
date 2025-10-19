import {useEffect, useState} from "react";
import StepsPanel from "./steps/StepsPanel";
import LogsPanel from "./logs/LogPanel";
import AttachmentsPanel from "./AttachmentsPanel";
import StyledAccordionSummary from "../../../../primitives/StyledAccordeonSummary";
import Typography from "@mui/material/Typography";
import {Accordion, AccordionDetails} from "@mui/material";
import StatusHistory from "./StatusHistory";
import ErrorMessage from "./ErrorMessage";
import QaResolutionPanel from "./QaResolutionPanel";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import StyledTooltip from "../../../../primitives/StyledTooltip";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import AppleIcon from '@mui/icons-material/Apple';
import {observer} from "mobx-react-lite";
import testResultsFilter from "../../testResultsList/filters/TestResultsFilter";
import testResultsState from "../../../../../state/testResults/TestResultsState";
import AttachmentElement from "../AttachmentElement";
import ComputerIcon from "@mui/icons-material/Computer";
import TextWithLabel from "../../../../primitives/TextWithLabel";
import RotatingArrowRight from "../../../../primitives/RotatingArrowRight";
import { getCookie, setCookie, QaHubCookies } from "../../../../../utils/CookieHelper";
import Checkbox from '@mui/material/Checkbox';

const RetryTab = observer(({retry, isLastRetry, ...props}) => {
  const {selectedTest} = testResultsState
  const [selectedStep, setSelectedStep] = useState(null)

  const [alwaysShowMoreDetails, setAlwaysShowMoreDetails] = useState(getCookie(QaHubCookies.alwaysShowMoreDetailsTestResult))
  const [showMoreDetails, setShowMoreDetails] = useState(alwaysShowMoreDetails)

  const handleCheckboxClick = (e) => {
    const newValue =!(String(alwaysShowMoreDetails) == "true")
    setAlwaysShowMoreDetails(String(newValue))
    setCookie(QaHubCookies.alwaysShowMoreDetailsTestResult, String(newValue))
  }

  useEffect(() => {
    setShowMoreDetails(String(alwaysShowMoreDetails) == "true")
  }, [selectedTest])

  let lastResult = retry.statusHistory[retry.statusHistory.length - 1]

  return <div style={{...props.style}}>
    <div style={{display: "flex", marginTop: '15px'}}>
      <StatusHistory retry={retry}/>
    </div>

    {
      lastResult.message != null &&
      <div style={{display: "flex", marginTop: '15px', maxWidth: '100%'}}>
        <ErrorMessage
          message={lastResult.message}
          style={{width: 'calc(100% - 707px)'}}
        />
        {
          isLastRetry &&
          <QaResolutionPanel testResult={selectedTest} style={{marginLeft: '13px'}}/>
        }
      </div>
    }

    <div style={{display: 'flex', marginTop: '10px', marginLeft: '5px'}}>
      <div style={{display: 'flex', opacity: '0.7' }}>
        <StyledTooltip title={'Runner'}>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <ComputerIcon />
            <label style={{marginLeft: '5px'}}>{ lastResult.runner }</label>
          </div>
        </StyledTooltip>

        <StyledTooltip title={'Device Id'}>
          <div style={{display: 'flex', alignItems: 'center', marginLeft: '20px'}}>
            <PhoneIphoneIcon />
            <label style={{marginLeft: '5px'}}>{ lastResult.deviceId }</label>
          </div>
        </StyledTooltip>
      </div>

      <div style={{ marginLeft: '20px', display: 'flex', opacity: '0.7' }}>
        <StyledTooltip title={'Device model'}>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <PhoneIphoneIcon />
            <label style={{marginLeft: '5px'}}>{ lastResult.device }</label>
          </div>
        </StyledTooltip>

        <StyledTooltip title={'Runtime'}>
          <div style={{display: 'flex', alignItems: 'center', marginLeft: '20px'}}>
            <AppleIcon />
            <label style={{marginLeft: '5px'}}>{ lastResult.deviceRuntime }</label>
          </div>
        </StyledTooltip>
      </div>

      <StyledTooltip title={'Duration'}>
        <div style={{display: 'flex', alignItems: 'center', marginLeft: '25px', opacity: '0.7'}}>
          <AccessTimeFilledIcon />
          <label style={{marginLeft: '5px'}}>{ Number.parseInt(lastResult.duration) }s</label>
        </div>
      </StyledTooltip>

      {
        lastResult.attachments.map((attachment, index) => {
          return <AttachmentElement key={index} attachment={attachment} />
        })
      }
    </div>
    <div style={{display: 'flex', alignItems: 'center', marginTop: "25px"}}>    
      <Typography variant="h5">More details</Typography>        
      <RotatingArrowRight value={showMoreDetails} setValue={setShowMoreDetails} />

    </div>
    <div style={{display: 'flex', opacity:'0.7', alignItems: 'center'}}>
          <Checkbox
            style={{padding: '0'}}
            checked={alwaysShowMoreDetails == "true"}
            onChange={handleCheckboxClick}
          />
          <Typography variant="h10" style={{marginLeft:'5px'}}>Always show more details</Typography>
        </div>
    {
      String(showMoreDetails) == "true" && 
      <div style={{display: 'flex', marginTop: '35px'}}>        
        <StepsPanel
          style={{width: 'max-content', minWidth: '400px', width: 'max-content'}}
          retry={retry}
          selectedStep={selectedStep}
          setSelectedStep={setSelectedStep}
        />
        <AttachmentsPanel
          style={{width: 'min-content', flexGrow: '1.1', marginLeft: '15px'}}
          retry={retry}
          selectedStep={selectedStep}
          setSelectedStep={setSelectedStep}
        />
      </div>
    }
  </div>
})

export default RetryTab