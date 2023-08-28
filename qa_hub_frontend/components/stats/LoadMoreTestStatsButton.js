import {useState} from "react";
import {Card} from "@mui/material";

export default function LoadMoreTestStatsButton ({loadMoreSize, loadMoreTestStats, ...props }) {
  const [isHovered, setIsHovered] = useState(false)

  return <Card
    style={{
      padding: '12px 10px',
      display: 'grid',
      justifyContent: 'center',
      backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.09)' : 'rgba(255, 255, 255, 0.05)',
      cursor: 'pointer',
      ...props.style
    }}
    onMouseOver={() => {setIsHovered(true)}}
    onMouseLeave={() => {setIsHovered(false)}}
    onClick={loadMoreTestStats}
  >
    <label style={{  cursor: 'pointer'}}>{`Load ${loadMoreSize} more test stats`}</label>
  </Card>
}