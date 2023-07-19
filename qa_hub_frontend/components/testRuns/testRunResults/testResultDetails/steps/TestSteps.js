import TestStep from "./TestStep";

export default function TestSteps({ steps, margin, setSelectedStep, ...props }) {
  return <div style={{...props.style}}>
    {
      steps.map((step, index) => {
        return <TestStep
          key={index}
          step={step}
          margin={margin}
          setSelectedStep={setSelectedStep}
          style={{
            marginLeft: margin * 10 + 'px',
            marginTop: margin !== 0 || index === 0 ? '15px' : '15px',
          }}
        />
      })
    }
  </div>
}