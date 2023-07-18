import StatusBadge from "../primitives/StatusBadge";
import {customTheme} from "../../styles/CustomTheme";

export default function TestStatusWithRetries({status, retries, ...props}) {
  const borderColor1 = 'rgba(0, 0, 0, 1)'
  const borderColor = 'rgba(255, 255, 255, 0.9)'
  const NumericRetriesBubble = () => {
    return <div
      style={{
        position: 'absolute',
        borderRadius: '10px',
        border: '2px solid',
        borderColor: borderColor,
        backgroundColor: status == 'SUCCESS' ? customTheme.palette.success.main : customTheme.palette.error.main,
        width: '18px',
        height: '18px',
        justifySelf: 'center',
        display: 'grid',
        top: '16px'
      }}
    >
      <label
        style={{
          justifySelf: "center",
          alignSelf: 'center',
          position: "relative",
          left: '0px',
          top: '-1px',
          fontSize:'13px',
          fontWeight: '500',
          color: 'white'
        }}
      >{retries}</label>
    </div>
  }

  const VisualRetriesBubble = () => {
    const bubbleSize = '9px'
    return <div
      style={{
        display: 'flex',
        justifySelf: "center",
        alignSelf: 'center',
        position: "relative",
        top: '-4px',
        opacity: '0.99'
      }}
    >
      {
        Array(retries).fill().map( (el, index) => {
          return <div key={`RetryBubble${index}`} style={{
            height: bubbleSize,
            width: bubbleSize,
            borderRadius: '5px',
            border: `1px solid`,
            borderColor: borderColor,
            marginLeft: '1px',
            backgroundColor:  status === 'SUCCESS' && index === retries - 1 ? customTheme.palette.success.main : customTheme.palette.error.main,
          }} />
        })
      }
    </div>
  }

  function getRetriesIndicator() {
    if (retries > 5) {
      return <NumericRetriesBubble />
    }
    return <VisualRetriesBubble />
  }

  return <div style={{marginLeft: '4px', position: 'relative', display: 'grid'}}>
    <StatusBadge label={status}/>
    {
      getRetriesIndicator()
    }
  </div>


}