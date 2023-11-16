import EditableTableCell from "../primitives/Table/EditableTableCell";
import {customTheme} from "../../styles/CustomTheme";
import {useEffect, useState} from "react";
import {getTaskStatus} from "../../requests/BlockerRequests";
import {observer} from "mobx-react-lite";
import projectIntegrationsState from "../../state/integrations/ProjectIntegrationsState";
import TaskLink from "./TaskLink";
import TaskStatus from "./TaskStatus";


const TaskStatusCell = observer(({blockedTest, onChangeCallback, onBlurCallback, ...props}) => {
  const [status, setStatus] = useState(null)
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
    afterContent={<TaskStatus status={status} color={color} style={{flexGrow: '1.1', maxWidth: '50%', minWidth: 'max-content'}}/>}
    onChangeCallback={ onChangeCallback }
    onBlurCallback={ onBlurCallback }
    {...props}
  />
})

export default TaskStatusCell


