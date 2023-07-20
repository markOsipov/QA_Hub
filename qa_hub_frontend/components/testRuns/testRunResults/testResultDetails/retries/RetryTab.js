import StatusBadge from "../../../../primitives/StatusBadge";
import {useEffect, useState} from "react";
import {customTheme} from "../../../../../styles/CustomTheme";
import StepsPanel from "./steps/StepsPanel";
import LogsPanel from "./logs/LogPanel";
import StyledAccordionSummary from "../../../../primitives/StyledAccordeonSummary";
import Typography from "@mui/material/Typography";
import {Accordion, AccordionDetails} from "@mui/material";
import StatusHistory from "./StatusHistory";
import ErrorMessage from "./ErrorMessage";

export default function RetryTab({retry, ...props}) {
  const [lastResult, setLastResult] = useState(null)
  const [selectedStep, setSelectedStep] = useState(null)


  useEffect(() => {
    setLastResult(retry.statusHistory[retry.statusHistory.length - 1])
  }, [retry])

  if (!lastResult) {
    return  <div style={{...props.style}}>Loading...</div>
  }

  return <div style={{...props.style}}>
    <StatusHistory retry={retry} />
    <ErrorMessage message={lastResult.message} style={{marginTop: '15px', minWidth: '50%'}}/>

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