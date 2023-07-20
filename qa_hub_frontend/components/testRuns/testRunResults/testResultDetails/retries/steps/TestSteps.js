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
            marginTop: '10px',
          }}
        />
      })
    }
  </div>
}