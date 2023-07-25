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

export default function RetryTab({retry, testResult, isLastRetry, testResults, setTestResults, filter, setFilter, setFilterChanged, ...props}) {
  const [selectedStep, setSelectedStep] = useState(null)

  let lastResult = retry.statusHistory[retry.statusHistory.length - 1]

  return <div style={{...props.style}}>
    <StatusHistory retry={retry} />

    {
      lastResult.message != null &&
      <div style={{display: "flex", marginTop: '15px'}}>
        <ErrorMessage
          message={lastResult.message}
          testResults={testResults}
          setTestResults={setTestResults}
          filter={filter}
          setFilter={setFilter}
          setFilterChanged={setFilterChanged}
          style={{width: '50%'}}
        />
        {
          isLastRetry && lastResult.status === "FAILURE" &&
          <QaResolutionPanel testResult={testResult} style={{marginLeft: '30px'}}/>
        }
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


    <Accordion style={{ marginTop: '25px', backgroundColor: 'rgba(0, 0, 0, 0.07)', borderRadius: '12px'}}>
      <StyledAccordionSummary
        style={{maxWidth: "max-content"}}
        aria-controls="panel1a-content"
      >
        <Typography variant="h5" style={{marginBottom: "5px", marginTop: "5px"}}>Test logs</Typography>
      </StyledAccordionSummary>

      <AccordionDetails >
        <div style={{display: 'flex'}}>
          <StepsPanel
            style={{width: '40%', minWidth: '100px', resize: 'horizontal', overflowX: 'auto'}}
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
      </AccordionDetails>
    </Accordion>
  </div>
}