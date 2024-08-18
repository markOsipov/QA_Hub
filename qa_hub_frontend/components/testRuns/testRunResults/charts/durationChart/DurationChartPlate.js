import DurationChartElement from "./DurationChartElement";
import {customTheme} from "../../../../../styles/CustomTheme";
import Typography from "@mui/material/Typography";
import {useEffect, useState, useRef} from 'react'

const DurationChartPlate = ({data, hoveredTest, setHoveredTest, maxDuration, maxCount, title, filter, ...props}) => {
  let maxDurationNormalized =  maxDuration || Math.max(...data.map(element => element.duration))
  let maxCountNormalized = maxCount || data.length

  const elementWidth = 10

  if ((data || []).length === 0) {
    return null
  }

  return <div>
    {
      title &&
      <Typography variant={'h6'} style={{marginBottom: '10px'}}>{title}</Typography>
    }
    <div style={{display: 'flex', backgroundColor: customTheme.palette.background.paper, padding: '25px 20px', borderRadius: '10px', ...props.style, minWidth: "400px"}}>
      <ScaleY
        maxDuration={maxDurationNormalized}
        style ={{
          marginRight: '5px',
          height: '350px'
        }}
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '350px',
          maxWidth: 'calc(100vw - 350px)',
          overflowX: 'auto',
          position: 'relative',
          paddingLeft: '10px',
        }}
      >
        <div style={{display: 'flex', minHeight: '350px', width: 'max-content', alignItems: 'end'}}>
          {
            data.map((element, index) => {
              return <DurationChartElement
                key={index}
                durationElement={element}
                maxDuration={maxDurationNormalized}
                hoveredTest={hoveredTest}
                setHoveredTest={setHoveredTest}
                filter={filter}
                style={{width: `${elementWidth}px`}}
                index={index}
              />
            })
          }
        </div>

        <ScaleX maxCount={maxCountNormalized} style={{marginTop: '15px', marginBottom: '20px'}}/>
      </div>
    </div>
  </div>
}

const ScaleY = ({maxDuration, ...props}) => {
  return <div
    style={{
      display: 'flex',
      opacity: '0.7',
      ...props.style
    }}
  >
    <div style={{height: '100%', width: 'max-content', position: 'relative', minWidth: '30px'}}>
      <div style={{ position: 'absolute', top: '-8px', right: '5px' }}>{Number.parseInt(maxDuration)}s</div>
      <div style={{ position: 'absolute', top: 'calc(50% - 10px)', right: '5px' }}>{Number.parseInt(maxDuration / 2)}s</div>
    </div>
    <div
      style={{
        height: '100%',
        minWidth: '10px',
        maxWidth: '10px',
        borderColor: customTheme.palette.text.faded,
        borderRight: '2px solid',
        borderBottom: '2px solid',
        borderTop: '2px solid',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'visible'
      }}
    >
      <div
        style={{
          minWidth: '5px',
          borderBottom: '1px solid',
          borderColor: customTheme.palette.text.faded,
          flexGrow: '1'
        }}>
      </div>
      <div
        style={{
          minWidth: '5px',
          borderTop: '1px solid',
          borderColor: customTheme.palette.text.faded,
          flexGrow: '1'
        }}>
      </div>
    </div>
  </div>
}

const ScaleX = ({maxCount, elementWidth, ...props}) => {
  const refLeft = useRef(null)
  const refRight = useRef(null)
  const refCenter = useRef(null)

  const [posLeft, setPosLeft] = useState('0px')
  const [posCenter, setPosCenter] = useState('0px')
  const [posRight, setPosRight] = useState('0px')

  useEffect(() => {
    if (refLeft?.current?.clientWidth > 0) {
      setPosLeft(`-${refLeft.current?.clientWidth / 2}px`)
    }
  }, [refLeft])

  useEffect(() => {
    if (refCenter?.current?.clientWidth > 0) {
      setPosCenter( `calc(50% - ${refCenter.current?.clientWidth / 2}px)`)
    }
  }, [refCenter])

  useEffect(() => {
    if (refRight?.current?.clientWidth > 0) {
      setPosRight(`-${refRight.current?.clientWidth / 2}px`)
    }
  }, [refRight])
  

  return <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      minWidth: `${maxCount * (elementWidth || 10) + 30}px`,
      opacity: '0.7',
      ...props.style
    }}
  >

    <div
      style={{
        height: '10px',
        minWidth: `${maxCount * (elementWidth || 10)}px`,
        width: `${maxCount * (elementWidth || 10)}px`,
        borderColor: customTheme.palette.text.faded,
        borderRight: '2px solid',
        borderLeft: '2px solid',
        borderTop: '2px solid',
        display: 'flex',
        overflow: 'visible',
      }}
    >
      <div
        style={{
          minWidth: '5px',
          borderRight: maxCount > 1 && '1px solid',
          borderColor: customTheme.palette.text.faded,
          flexGrow: '1'
        }}>
      </div>
      <div
        style={{
          minWidth: '5px',
          borderLeft: maxCount > 1 && '1px solid',
          borderColor: customTheme.palette.text.faded,
          flexGrow: '1'
        }}>
      </div>
    </div>

    <div style={{width: `${maxCount * (elementWidth || 10)}px`, height: 'max-content', position: 'relative', minHeight: '15px'}}>
      {
        refLeft &&
        <div ref={refLeft} style={{ position: 'absolute', left: posLeft }}>0</div>
      }
      {
        refRight &&
        <div ref={refRight} style={{ position: 'absolute', right: posRight }}>{Number.parseInt(maxCount)}</div>
      }
      
      {
        refCenter && maxCount > 1 &&
        <div ref={refCenter} style={{ position: 'absolute', left: posCenter }}>{Number.parseInt(maxCount / 2)}</div>
      }
      
    </div>
  </div>
}


export default DurationChartPlate