import {observer} from "mobx-react-lite";
import EditableTableCell from "../primitives/Table/EditableTableCell";
import {useState} from "react";
import projectIntegrationsState from "../../state/integrations/ProjectIntegrationsState";

const TestcaseIdCell = observer(({blockedTest, onChangeCallback, onBlurCallback, ...props}) => {
  const {tmsInt} = projectIntegrationsState

  return <EditableTableCell
    value={blockedTest.testcaseId}
    content={<TestcaseUrl blockedTest={blockedTest} testcaseUrl={tmsInt.testcaseUrl}/>}
    onChangeCallback={ onChangeCallback }
    onBlurCallback={ onBlurCallback }
  />
})

function TestcaseUrl({blockedTest, testcaseUrl, ...props}) {
  const [hover, setHover] = useState(false)

  return <a
    href={`${testcaseUrl}${blockedTest.testcaseId}`}
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
    {blockedTest.testcaseId}
  </a>
}


export default TestcaseIdCell