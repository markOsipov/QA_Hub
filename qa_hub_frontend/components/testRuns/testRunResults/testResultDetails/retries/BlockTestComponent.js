import {observer} from "mobx-react-lite";
import AccessibleForwardIcon from "@mui/icons-material/AccessibleForward";
import {customTheme} from "../../../../../styles/CustomTheme";
import {useEffect, useState} from "react";
import blockerState from "../../../../../state/BlockerState";
import LockIcon from "@mui/icons-material/Lock";
import projectState from "../../../../../state/ProjectState";
import {useRouter} from "next/router";

const BlockTestComponent = observer(({testResult, qaComment, ...props}) => {
  const router = useRouter()
  const project = router.query.project
  const [hovered, setHovered] = useState(false)
  const [isBlocked, setIsBlocked] = useState(false)

  useEffect(() => {
    updateIsBlocked()
  }, [testResult])

  useEffect(() => {
    blockerState.updateBlockedTests(projectState.selectedProject)
  }, [])

  const updateIsBlocked = () => {
    const blocked = blockerState.blockedTests.findIndex((el) => { return el.fullName === testResult.fullName}) >= 0
    setIsBlocked(blocked)
  }

  const handleBlockTest = () => {
    let task = ""
    while (task !== null && task.length < 4) {
      task = prompt("The test will be blocked. Input the task for the task tracker:")
    }

    if (task !== null) {
      blockerState.blockTest(
        {
          fullName: testResult.fullName,
          testcaseId: testResult.testcaseId,
          project: project,
          comment: qaComment,
          tmsTask: task,
        },
        updateIsBlocked
      )
    }
  }

  return <div style={{display: 'flex', alignItems: 'center', ...props.style}}>
    <div style={{flexGrow: '1.1'}}></div>

    {
      isBlocked &&
      <div
        style={{
          display: 'flex',
          padding: '5px',
          alignItems: 'center',
        }}
      >
        <label style={{marginLeft: '3px', marginRight:'3px', color: customTheme.palette.text.disabled}}>Already blocked</label>
        <LockIcon style={{position: 'relative', top: '-1px', color: customTheme.palette.text.disabled}}/>
      </div>
    }

    { !isBlocked &&
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div
          style={{
            display: 'flex',
            padding: '5px',
            alignItems: 'center',
            backgroundColor: hovered && 'rgba(255, 255, 255, 0.05)',
            borderRadius: '3px',
            cursor: 'pointer'
        }}
          onMouseEnter={() => { setHovered(true)}}
          onMouseLeave={() => { setHovered(false) }}
          onClick={handleBlockTest}
        >
          <label style={{marginLeft: '3px', marginRight:'3px', cursor: 'pointer', color: customTheme.palette.text.faded}}>Call for a doctor</label>
          <AccessibleForwardIcon style={{position: 'relative', top: '-1px', color: customTheme.palette.text.primary}}/>
        </div>
      </div>
    }
  </div>
})

export default BlockTestComponent