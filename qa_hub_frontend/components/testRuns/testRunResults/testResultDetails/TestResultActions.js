
import {observer} from "mobx-react-lite";
import AddIcon from '@mui/icons-material/Add';
import pushModalState from "../../../../state/testRuns/PushModalState";
import StyledTooltip from "../../../primitives/StyledTooltip";
import CustomIconButton from "../../../primitives/CustomIconButton";
import {customTheme} from "../../../../styles/CustomTheme";
import CloseIcon from '@mui/icons-material/Close';
import {QaHubCookies, setCookie} from "../../../../utils/CookieHelper";

const TestResultActions = observer(({ testResult, ...props}) => {
  const {selectedTests} = pushModalState
  const handleAddClick = () => {
    const set = new Set([
      ...selectedTests,
      testResult.fullName
    ])
    const arr = Array.from(set)

    pushModalState.setSelectedTests(arr)
  }
  const handleRemoveClick = () => {
    const index = selectedTests.indexOf(testResult.fullName)
    const arrayCopy = Array.from(selectedTests)

    if (index >= 0) {
      arrayCopy.splice(index, 1)
    }

    pushModalState.setSelectedTests(arrayCopy)
  }

  return <div style={{display: 'flex', ...props.style}}>
    {
      !selectedTests.includes(testResult.fullName) &&
      <StyledTooltip title={"Add to next testrun"}>
        <div>
          <CustomIconButton
            action={handleAddClick}
            color={customTheme.palette.primary.main}
            icon={<AddIcon/>}
          />
        </div>
      </StyledTooltip>
    }

    {
      selectedTests.includes(testResult.fullName) &&
      <StyledTooltip title={"Remove from next testrun"}>
        <div>
          <CustomIconButton
            action={handleRemoveClick}
            color={customTheme.palette.text.disabled}
            icon={<CloseIcon/>}
          />
        </div>
      </StyledTooltip>
    }

  </div>
})

export default TestResultActions