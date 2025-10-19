import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import {useState} from "react";

export default function RotatingArrowRight({ value, setValue, ...props}) {
    const [hovered, setHovered] = useState(false)

    return <div
        style={{
          backgroundColor: hovered ? 'rgba(255, 255, 255, 0.07)' : '',
          marginLeft: '5px',
          height: '21px',
          width: '21px'
        }}
        onClick={() => { setValue(!value) }}
        onMouseEnter={() => { setHovered(true)}}
        onMouseLeave={() => { setHovered(false)}}
      >
        <KeyboardArrowRightIcon
          style={{
            transform: value && 'rotate(90deg)',
            transition: 'all 0.1s linear',
          }}
        />
      </div>
}