import TextWithLabel from "../../primitives/TextWithLabel";
import Typography from "@mui/material/Typography";
import StatusBadge from "../../primitives/StatusBadge";
import {Card} from "@mui/material";
import {useState} from "react";

export default function TestResultCard({testResult, setSelectedTest, ...props}) {
  const [isHovering, setIsHovered] = useState(false);
  const onMouseEnter = () => setIsHovered(true);
  const onMouseLeave = () => setIsHovered(false);

  const handleTestResultCardClick = () => {
    setSelectedTest(testResult)
  }

  function getShortName(testResult) {
    return testResult.fullName.substring(testResult.fullName.lastIndexOf(".") + 1)
  }

  return <Card
    style={{
      display: 'flex',
      backgroundColor: isHovering ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.055)',
      ...props.style
  }}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    onClick={handleTestResultCardClick}
  >
    <div style={{display: 'flex', width: '100%', alignItems: 'center' }}>
      <TextWithLabel
        style={{
          fontSize: "12px",
          width: "max-content",
          padding: "5px 6px",
          minHeight: 'unset',
          minWidth: '70px',
          display: 'grid',
          justifyItems: 'center',
          height: 'min-content',
          position: 'relative',
          top: '6px',
          marginRight: '7px'
        }}
        label={'TestcaseId'}
        value={testResult.testcaseId}
        labelStyle={{ justifySelf: 'center'}}
      />

      <div style={{maxWidth: 'min-content', overflowX: 'hidden', position: 'relative', marginRight: '5px', top: '-1px'}}>
        <Typography variant={'h6'} style={{marginLeft: '15px', width: 'max-content'}}>{getShortName(testResult)}</Typography>
        <Typography variant={'h6'} style={{marginLeft: '15px', width: 'max-content', fontSize: '14px', opacity: '0.5'}}>{testResult.fullName}</Typography>
      </div>
      <div style={{flexGrow: '1.1'}}></div>
      <StatusBadge label={testResult.status} style={{marginLeft: '4px'}}/>
    </div>
  </Card>
}