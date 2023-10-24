import {useRef} from "react";

const Pointer = ({coordX, pointerTitle}) => {
  const ref = useRef(null)

  return <div style={{position: 'absolute', height: '100%', width: '1px', backgroundColor: 'cyan', top: '0', left: `${coordX}px`}}>
    {
      ref !== null &&
      <div
        style={{
          display: 'grid',
          width: 'max-content',
          position: 'relative',
          left: `-${ref.current?.clientWidth || 110}px`,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          padding: '10px'
        }}
        ref={ref}
      >
        <div style={{display: 'flex', width: '100%'}}>
          <label style={{width: '50%'}}>Passed:</label>
          <label style={{width: '50%', marginLeft: '15px', display: 'flex', placeContent: 'end'}}>{pointerTitle.time}s</label>
        </div>
        <div style={{display: 'flex', width: '100%'}}>
          <label style={{width: '50%'}}>Left:</label>
          <label style={{width: '50%', marginLeft: '15px', display: 'flex', placeContent: 'end'}}>{pointerTitle.untilEnd}s</label>
        </div>

      </div>
    }

  </div>
}
export default Pointer