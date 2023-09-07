import EditableTableCell from "../primitives/Table/EditableTableCell";
import {customTheme} from "../../styles/CustomTheme";
import {useEffect, useState} from "react";
import {getTaskStatus} from "../../requests/BlockerRequests";
import {observer} from "mobx-react-lite";
import projectIntegrationsState from "../../state/integrations/ProjectIntegrationsState";

const defaultStatus = "unknown"
const TaskStatusCell = observer(({blockedTest, onChangeCallback, onBlurCallback, ...props}) => {
  const [status, setStatus] = useState(defaultStatus)
  const [color, setColor] = useState(null)
  const taskTrackerInfo = projectIntegrationsState.taskTrackerInt || {}

  useEffect(() => {
    getTaskStatus(blockedTest.project, blockedTest.jiraIssue).then((data) => {
      setStatus(data?.data?.statusInfo?.statusName || defaultStatus)
      setColor(data?.data?.statusInfo?.statusColor || null)
    })
  }, [blockedTest])



  return <EditableTableCell
    value={blockedTest.jiraIssue}
    content={<TaskLink blockedTest={blockedTest} taskUrl={taskTrackerInfo.taskUrl}/>}
    contentStyle={{
      maxWidth: '80px',
      minWidth: '80px',
      justifyContent: 'end'
    }}
    afterContent={<StatusElement status={status} color={color} style={{flexGrow: '1.1', maxWidth: '50%', minWidth: 'max-content'}}/>}
    onChangeCallback={ onChangeCallback }
    onBlurCallback={ onBlurCallback }
    {...props}
  />
})

export default TaskStatusCell

function TaskLink({blockedTest, taskUrl, ...props}) {
  const [hover, setHover] = useState(false)

  return <a
    href={`${taskUrl}/${blockedTest.jiraIssue}`}
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
    {blockedTest.jiraIssue}
  </a>
}

function StatusElement({status, color, ...props}) {
  return <div style={{ ...props.style}}>
      <div
      style={{
        padding: '2px 6px',
        backgroundColor: color === 'green' ? statusColors.green : color === 'yellow' ? statusColors.yellow : status === defaultStatus ? statusColors.unknown : statusColors.other,
        marginLeft: '10px',
        borderRadius: '5px',
        display: 'grid',
        alignContent: 'center',
        width: 'max-content'
      }}
    >
      <label
        style={{
          fontWeight: 'bold',
          color: 'white',
          fontSize: '11px',
          position: 'relative',
          top: '1px'
        }}
      >{status.toUpperCase()}</label>
    </div>
  </div>
}

const statusColors = {
  green: customTheme.palette.success.main,
  yellow:  customTheme.palette.warning.main,
  other: '#0a2a57',
  unknown: customTheme.palette.text.disabledMore
}