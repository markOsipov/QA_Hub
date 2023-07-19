import StatusBadge from "../../../primitives/StatusBadge";
import {useEffect, useState} from "react";
import {customTheme} from "../../../../styles/CustomTheme";
import StepsPanel from "./steps/StepsPanel";
import LogsPanel from "./logs/LogPanel";

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
    <StatusBadge label={lastResult.status} />

    {
      lastResult.message &&
      <div style={{
        marginTop: '15px',
        padding: '10px',
        border: '1px solid',
        borderColor: customTheme.palette.error.main,
        borderRadius: '10px',
        backgroundColor: customTheme.palette.error.faded,
        width: 'max-content',
        minWidth: '50%',
        display: 'grid'
      }}>
        {
          lastResult.message.split("\n").map((line, index) => {
            return <label key={index} style={{whiteSpace: 'break-spaces'}}>{line}</label>
          })
        }

      </div>
    }
    <div style={{display: 'flex', marginTop: '15px'}}>
      <StepsPanel
        style={{width: '90%', minWidth: '100px', resize: 'horizontal', overflowX: 'auto'}}
        retry={retry}
        selectedStep={selectedStep}
        setSelectedStep={setSelectedStep}
      />
      <LogsPanel
        style={{flexGrow: '1', marginLeft: '15px'}}
        retry={retry}
        selectedStep={selectedStep}
        setSelectedStep={setSelectedStep}
      />
    </div>
  </div>
}