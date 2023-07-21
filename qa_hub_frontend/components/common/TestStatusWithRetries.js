import StatusBadge from "../primitives/StatusBadge";
import {customTheme} from "../../styles/CustomTheme";

export default function TestStatusWithRetries({status, retries, ...props}) {
  const RetriesBubbles = () => {
    const bubbleSize = '8px'
    return <div
      style={{
        display: 'flex',
        justifySelf: "center",
        alignSelf: 'center',
        position: "relative",
        top: '-6px',
        padding: '3px 3px',
        backgroundColor: 'rgb(0, 0, 0)' ,
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.55)'
      }}
    >
      {
        Array(retries).fill().map( (el, index) => {
          return <div key={`RetryBubble${index}`} style={{
            height: bubbleSize,
            width: bubbleSize,
            borderRadius: '5px',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            marginLeft: index === 0 ? '0' : '2px',
            backgroundColor:  status === 'SUCCESS' && index === retries - 1 ? customTheme.palette.success.main : customTheme.palette.error.main,
          }} />
        })
      }
    </div>
  }

  const RetriesBubblesExp = () => {
    const bubbleSize = '16px'
    return <div
      style={{
        display: 'flex',
        justifySelf: "center",
        alignSelf: 'center',
        position: "relative",
        top: '-10px',
        padding: '3px',
        transform: 'scale(0.55)'
      }}
    >
      {
        Array(retries).fill().map( (el, index) => {
          return <div key={`RetryBubble${index}`} style={{
            height: bubbleSize,
            width: bubbleSize,
            borderRadius: '20px',
            border: '2px solid rgba(255, 255, 255, 0.85)',
            marginLeft: index === 0 ? '0' : '1.5px',
            backgroundColor:  status === 'SUCCESS' && index === retries - 1 ? customTheme.palette.success.main : customTheme.palette.error.main,
          }} />
        })
      }
    </div>
  }


  return <div style={{marginLeft: '4px', position: 'relative', display: 'grid', height: '30px', ...props.style}}>
    <StatusBadge label={status} />
    {
      retries > 1 &&
      <RetriesBubblesExp />
    }

  </div>


}