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
    <div style={{display: 'flex', width: '100%', position: 'relative', top: '6px'}}>
      <TextWithLabel
        style={{
          fontSize: "12px",
          width: "max-content",
          padding: "5px 6px",
          minHeight: 'unset',
          minWidth: '70px',
          display: 'grid',
          justifyItems: 'center'
        }}
        label={'TestcaseId'}
        value={testResult.testcaseId}
        labelStyle={{ justifySelf: 'center'}}
      />

      <div style={{maxWidth: 'min-content', overflowX: 'hidden'}}>
        <Typography variant={'h6'} style={{marginLeft: '15px', width: 'max-content'}}>{testResult.fullName}</Typography>
      </div>
      <div style={{flexGrow: '1.1'}}></div>
      <StatusBadge label={testResult.status} style={{marginLeft: '10px'}}/>
    </div>
  </Card>
}