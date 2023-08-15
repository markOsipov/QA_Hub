import {useEffect, useState} from "react";
import StepsPanel from "./steps/StepsPanel";
import LogsPanel from "./logs/LogPanel";
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

const RetryTab = observer(({retry, isLastRetry, ...props}) => {
  const {selectedTest} = testResultsState
  const [selectedStep, setSelectedStep] = useState(null)

  let lastResult = retry.statusHistory[retry.statusHistory.length - 1]

  return <div style={{...props.style}}>
    <StatusHistory retry={retry} />

    {
      lastResult.message != null &&
      <div style={{display: "flex", marginTop: '15px'}}>
        <ErrorMessage
          message={lastResult.message}
          style={{width: '50%'}}
        />
      </div>
    }

    <div style={{display: 'flex', marginTop: '25px', marginLeft: '5px'}}>
      <StyledTooltip title={'Duration'}>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <AccessTimeFilledIcon />
          <label style={{marginLeft: '5px'}}>{ Number.parseInt(lastResult.duration) }s</label>
        </div>
      </StyledTooltip>

      <StyledTooltip title={'Device model'}>
        <div style={{display: 'flex', alignItems: 'center', marginLeft: '20px'}}>
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

    <div style={{display: 'flex', marginTop: '45px'}}>
      <StepsPanel
        style={{width: 'max-content', minWidth: '200px', resize: 'horizontal', overflowX: 'auto'}}
        retry={retry}
        selectedStep={selectedStep}
        setSelectedStep={setSelectedStep}
      />
      <LogsPanel
        style={{width: 'min-content', flexGrow: '1.1', marginLeft: '15px'}}
        retry={retry}
        selectedStep={selectedStep}
        setSelectedStep={setSelectedStep}
      />
    </div>
  </div>
})

export default RetryTab