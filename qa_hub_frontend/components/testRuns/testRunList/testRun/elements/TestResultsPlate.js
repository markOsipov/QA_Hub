import {customTheme} from "../../../../../styles/CustomTheme";
import StatusBadge from "../../../../primitives/StatusBadge";
import TextWithLabel from "../../../../primitives/TextWithLabel";
import {useRouter} from "next/router";
import {useState} from "react";

export default function TestResultsPlate({testRun, progressBarWidth, ...props}) {
  const router = useRouter()

  if (testRun?.tests == null || !testRun.tests.testsCount) {
    return null
  }

  const totalWidth = progressBarWidth || 500
  const minWidth = 3

  const successCount = testRun.tests.successCount || 0
  const failsCount = testRun.tests.failsCount || 0
  const notFinishedCount = testRun.tests.testsCount - successCount - failsCount

  const successRelative = (successCount / testRun.tests.testsCount) * totalWidth
  const failsRelative = (failsCount / testRun.tests.testsCount) * totalWidth

  const failsWidth = failsCount > 0 ? Math.max(failsRelative, minWidth) : 0
  const successWidth = successCount > 0 ? Math.max(successRelative, minWidth) : 0
  const othersWidth = totalWidth - failsWidth - successWidth

  const totalBadgeValue = notFinishedCount > 0 ? `${successCount + failsCount}/${testRun.tests.testsCount} ` : testRun.tests.testsCount

  return <div style={{display: 'flex', flexDirection: 'column', width: 'max-content', ...props.style}}>
    <div style={{display: 'flex'}}>
      <TotalTestsBadge totalCount={totalBadgeValue} testRun={testRun} />

      <div style={{display: 'grid', alignItems: 'center'}}>
        <div style={{display: 'flex', width: `${totalWidth}px`, ...progressBarStyle}}>
          <div style={{ backgroundColor: customTheme.palette.success.main, width: `${successWidth}px`, ...progressBarStyle}}></div>
          <div style={{ backgroundColor: customTheme.palette.error.main, width: `${failsWidth}px`, ...progressBarStyle}}></div>
          <div style={{ backgroundColor: customTheme.palette.text.faded, width: `${othersWidth}px`, ...progressBarStyle}}></div>
        </div>
      </div>


      <div style={{display: 'flex', marginLeft: '15px', alignItems: 'center', position: 'relative', top: '-2px'}}>
        { successCount > 0 &&
          <SuccessfulTestsBadge successCount={successCount} testRun={testRun}/>
        }

        { failsCount > 0 &&
          <FailedTestsBadge failsCount={failsCount} testRun={testRun} style={{marginLeft: '5px'}}/>
        }
      </div>
    </div>

  </div>

}

const FailedTestsBadge = ({failsCount, testRun, ...props}) => {
  const [hovered, setHovered] = useState(false)
  const handleFailedTestsClick = () => {
    window.location.href = `/projects/${testRun.project}/testRuns/${testRun.testRunId}?statuses=FAILURE`
  }

  return <div
    style={{
      cursor: 'pointer',
      backgroundColor: hovered && 'rgba(255, 255, 266, 0.5)',
      display: 'grid',
      padding: '1px',
      placeItems: 'center',
      height: 'min-content',
      borderRadius: '5px',
      ...props.style
    }}

    onMouseOver={() => setHovered(true)}
    onMouseLeave={() => setHovered(false)}
    onBlur={() => setHovered(false)}
    onClick={handleFailedTestsClick}
  >
    <StatusBadge
      label={failsCount}
      variant={'error'}
      style={{cursor: 'pointer'}}
    />
  </div>
}

const SuccessfulTestsBadge = ({successCount, testRun, ...props}) => {
  const [hovered, setHovered] = useState(false)
  const handleSuccessTestsClick = () => {
    window.location.href = `/projects/${testRun.project}/testRuns/${testRun.testRunId}?statuses=SUCCESS`
  }

  return <div
    style={{
      cursor: 'pointer',
      backgroundColor: hovered && 'rgba(255, 255, 266, 0.5)',
      display: 'grid',
      padding: '1px',
      placeItems: 'center',
      height: 'min-content',
      borderRadius: '5px',
      ...props.style
    }}

    onMouseOver={() => setHovered(true)}
    onMouseLeave={() => setHovered(false)}
    onBlur={() => setHovered(false)}
    onClick={handleSuccessTestsClick}
  >
    <StatusBadge
      label={successCount}
      variant={'success'}
      style={{cursor: 'pointer'}}
    />
  </div>
}

const TotalTestsBadge = ({totalCount, testRun, ...props}) => {
  const [hovered, setHovered] = useState(false)
  const handleTotalTestsClick = () => {
    window.location.href = `/projects/${testRun.project}/testRuns/${testRun.testRunId}`
  }

  return <div
    style={{
      cursor: 'pointer',
      display: 'grid',
      padding: '4px',
      placeItems: 'center',
      height: 'min-content',
      borderRadius: '5px',
      marginRight: '12px',
      ...props.style
    }}

    onMouseOver={() => setHovered(true)}
    onMouseLeave={() => setHovered(false)}
    onBlur={() => setHovered(false)}
    onClick={handleTotalTestsClick}
  >
    <TextWithLabel label={'Total'} value={totalCount} variant={'neutral'}
                 labelStyle={{ justifySelf: 'center'}}
                 style={{
                   // borderColor: hovered ? 'white' : customTheme.palette.text.disabled,
                   backgroundColor: hovered && 'rgba(255, 255, 255, 0.07)',
                   padding: '3.5px 9px',
                   display: 'grid',
                   justifyItems: 'center',
                   minHeight: '20px',
                   minWidth: '50px',
                   opacity: '0.8',
                   cursor: 'pointer'
                 }}
    />
  </div>
}

const progressBarStyle = {
  minHeight: '10px',
  height: '10px'
}