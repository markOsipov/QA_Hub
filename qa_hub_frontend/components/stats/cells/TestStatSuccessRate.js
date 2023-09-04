import {customTheme} from "../../../styles/CustomTheme";

export default function TestStatSuccessRate({testStat, width, ...props}) {
  const successRate = Number.parseInt(testStat.successRate * 100)

  return <div style={{display: 'flex', flexDirection:'column', height: 'max-content', width: width || '100px',...props.style}}>
    <div style={{display: 'flex', width: '100%'}}>
      <label style={{color: customTheme.palette.text.disabled}}>{testStat.successRuns }/{testStat.totalRuns}</label>
      <div style={{flexGrow:'1.1'}}></div>
      <label>{successRate}%</label>

    </div>

    <div style={{display: 'flex', width: width || '100px', height: '2px', alignSelf: 'center', marginTop: '3px'}}>
      <div style={{backgroundColor: customTheme.palette.success.main, height: '100%', width: `${successRate}%`}}></div>
      <div style={{backgroundColor: customTheme.palette.error.main, height: '100%', width: `${100 - successRate}%`}}></div>
    </div>
  </div>
}