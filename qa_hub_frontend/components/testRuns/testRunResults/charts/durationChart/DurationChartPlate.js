import DurationChartElement from "./DurationChartElement";
import {customTheme} from "../../../../../styles/CustomTheme";
import Typography from "@mui/material/Typography";

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
    <div style={{display: 'flex', backgroundColor: customTheme.palette.background.paper, padding: '25px 20px', borderRadius: '10px', ...props.style}}>
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
          borderRight: '1px solid',
          borderColor: customTheme.palette.text.faded,
          flexGrow: '1'
        }}>
      </div>
      <div
        style={{
          minWidth: '5px',
          borderLeft: '1px solid',
          borderColor: customTheme.palette.text.faded,
          flexGrow: '1'
        }}>
      </div>
    </div>

    <div style={{width: `${maxCount * (elementWidth || 10)}px`, height: 'max-content', position: 'relative', minHeight: '15px'}}>
      <div style={{ position: 'absolute', left: '-3px' }}>0</div>
      <div style={{ position: 'absolute', right: '-8px' }}>{Number.parseInt(maxCount)}</div>
      <div style={{ position: 'absolute', left: `calc(50% - ${String(maxCount / 2).length * 2.25}px)` }}>{Number.parseInt(maxCount / 2)}</div>
    </div>
  </div>
}


export default DurationChartPlate