import {useEffect, useRef} from "react";

export default function LogRow({ line, index, selectedLogRow, ...props }) {
  const ref = useRef(null);


  useEffect(() => {
    if (selectedLogRow === index) {
      ref.current?.scrollIntoView({ behavior: 'smooth', block: "center" });
    }
  }, [index, selectedLogRow])

  return <div style={{display: 'flex', ...props.style}} ref={ref}>
    <div style={{ width: '30px', minWidth: '30px', display: 'flex', justifyContent: 'end', marginRight: '15px'}}>
      <label style={{opacity: '0.4', fontFamily: 'monospace'}}>{index + 1}</label>
    </div>

    <label
      style={{
        whiteSpace: 'break-spaces',
        fontFamily: 'monospace',
        width: '100%',
        backgroundColor: index === selectedLogRow && 'yellow',
        color: index === selectedLogRow && 'black'
      }}
    >{line}</label>
  </div>
}