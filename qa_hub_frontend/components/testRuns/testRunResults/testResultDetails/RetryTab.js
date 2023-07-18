import StatusBadge from "../../../primitives/StatusBadge";
import {useEffect, useState} from "react";

export default function RetryTab({retry, ...props}) {
  const[lastResult, setLastResult] = useState(null)
  useEffect(() => {
    setLastResult(retry.statusHistory[retry.statusHistory.length - 1])
  }, [retry])

  if (!lastResult) {
    return  <div style={{...props.style}}>Loading...</div>
  }

  return <div style={{...props.style}}>
    <StatusBadge label={lastResult.status} style={{ marginLeft: "10px"}}/>


  </div>
}