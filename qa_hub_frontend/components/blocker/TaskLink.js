import {useState} from "react";

export default function TaskLink({blockedTest, taskUrl, ...props}) {
  const [hover, setHover] = useState(false)

  return <a
    href={`${taskUrl}/${blockedTest.tmsTask}`}
    target={'_blank'}
    rel="noreferrer"
    style={{
      padding: '5px',
      backgroundColor: hover && `rgba(255, 255, 255, 0.1)`,
      ...props.style
    }}
    onMouseOver={() => {setHover(true)}}
    onMouseLeave={() => {setHover(false)}}
  >
    {blockedTest.tmsTask}
  </a>
}