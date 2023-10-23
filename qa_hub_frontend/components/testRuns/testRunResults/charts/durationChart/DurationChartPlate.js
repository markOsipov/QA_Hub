import DurationChartElement from "./DurationChartElement";
import {customTheme} from "../../../../../styles/CustomTheme";
import Typography from "@mui/material/Typography";

const DurationChartPlate = ({data, hoveredTest, setHoveredTest, maxDuration, title, ...props}) => {
  let maxDurationNormalized =  maxDuration || Math.max(...data.map(element => element.duration))

  if ((data || []).length === 0) {
    return null
  }

  return <div>
    {
      title &&
      <Typography variant={'h6'} style={{marginBottom: '10px'}}>{title}</Typography>
    }
    <div style={{display: 'flex', backgroundColor: customTheme.palette.background.paper, padding: '25px 20px', borderRadius: '10px', ...props.style}}>
      <Scale
        maxDuration={maxDurationNormalized}
        style ={{
          marginRight: '10px',
          height: '350px'
        }}
      />
      <div
        style={{
          display: 'flex',
          minHeight: '350px',
          maxWidth: 'calc(100vw - 350px)',
          overflowX: 'auto',
          position: 'relative',

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
              />
            })
          }
        </div>
      </div>
    </div>
  </div>
}

const Scale = ({maxDuration, ...props}) => {
  return <div
    style={{
      display: 'flex',
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

export default DurationChartPlate