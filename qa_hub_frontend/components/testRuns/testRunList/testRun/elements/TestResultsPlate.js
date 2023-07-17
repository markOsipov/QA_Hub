import {customTheme} from "../../../../../styles/CustomTheme";
import StatusBadge from "../../../../primitives/StatusBadge";
import TextWithLabel from "../../../../primitives/TextWithLabel";

export default function TestResultsPlate({testRun, ...props}) {
  if (!testRun.tests.testsCount) {
    return null
  }

  const totalWidth = 500
  const minWidth = 3

  const successCount = testRun.tests.successCount || 0
  const failsCount = testRun.tests.failsCount || 0
  const notFinishedCount = testRun.tests.testsCount - successCount - failsCount

  const successRelative = (successCount / testRun.tests.testsCount) * totalWidth
  const failsRelative = (failsCount / testRun.tests.testsCount) * totalWidth


  const failsWidth = failsCount > 0 ? Math.max(failsRelative, minWidth) : 0
  const successWidth = successCount > 0 ? Math.max(successRelative, minWidth) : 0
  const othersWidth = totalWidth - failsWidth - successWidth

  const totalBadgeValue = notFinishedCount > 0 ? `${notFinishedCount}/${testRun.tests.testsCount} ` : testRun.tests.testsCount

  return <div style={{display: 'flex', flexDirection: 'column', width: 'max-content', ...props.style}}>
    <div style={{display: 'flex'}}>
      <div style={{display: 'grid', alignItems: 'center'}}>
        <div style={{display: 'flex', width: `${totalWidth}px`, ...progressBarStyle}}>
          <div style={{ backgroundColor: customTheme.palette.success.main, width: `${successWidth}px`, ...progressBarStyle}}></div>
          <div style={{ backgroundColor: customTheme.palette.error.main, width: `${failsWidth}px`, ...progressBarStyle}}></div>
          <div style={{ backgroundColor: customTheme.palette.text.faded, width: `${othersWidth}px`, ...progressBarStyle}}></div>
        </div>
      </div>


      <div style={{display: 'flex', marginLeft: '15px'}}>
        { successCount > 0 &&
          <StatusBadge label={successCount} variant={'success'} />
        }

        { failsCount > 0 &&
          <StatusBadge label={failsCount} variant={'error'} style={{marginLeft: '5px'}} />
        }

        {/*{ notFinishedCount > 0 &&*/}
        {/*  <StatusBadge label={notFinishedCount} variant={'neutral'} style={{marginLeft: '5px'}} />*/}
        {/*}*/}


        <TextWithLabel label={'total'} value={totalBadgeValue} variant={'neutral'}
                       style={{marginLeft: '12px', padding: '3.5px 9px', minWidth: '50px', display: 'grid', justifyItems: 'center', minHeight: '20px'}}
        />

      </div>
    </div>

  </div>

}

const progressBarStyle = {
  minHeight: '10px',
  height: '10px'
}