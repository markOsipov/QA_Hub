import {customTheme} from "../../../styles/CustomTheme";
import CloseIcon from "@mui/icons-material/Close";
import CustomIconButton from "../../primitives/CustomIconButton";
import StyledTooltip from "../../primitives/StyledTooltip";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import {observer} from "mobx-react-lite";
import pushModalState from "../../../state/testRuns/PushModalState";

const PushTestRunPopup = observer(({ testRun, ...props }) => {
  const {selectedTests} = pushModalState

  const handleCancelClick = () => {
    pushModalState.setSelectedTests([])
  }

  const handleStartClick = () => {
    pushModalState.open(testRun, true)
  }

  return <div style={{ ...props.style }}>
    <div style={{
      position: 'relative',
      backgroundColor: customTheme.palette.background.popup,
      display: 'flex',
      borderRadius: '5px'
    }}>
      <div style={{display: "flex", alignContent: 'center', justifyContent: 'center', position: 'relative', padding: '8px 12px'}}>
        <label style={{alignSelf: 'center', fontSize: '30px'}}>{selectedTests.length}</label>
        <label
          style={{
            alignSelf: 'center',
            textAlign: 'center',
            fontSize: '14px',
            width: '90px',
            marginLeft: '5px'
          }}
        >{`SELECTED TEST${selectedTests.length === 1 ? '' : 'S'}`}</label>

        <div style={{display: 'flex', alignSelf:'center', marginLeft: '5px'}}>
          <StyledTooltip title={"Start"}>
            <div>
              <CustomIconButton
                action={handleStartClick}
                color={customTheme.palette.primary.main}
                icon={<PlayArrowIcon />}
              />
            </div>
          </StyledTooltip>

          <StyledTooltip title={"Cancel"}>
            <div>
              <CustomIconButton
                action={handleCancelClick}
                color={customTheme.palette.error.main}
                icon={<CloseIcon />}
              />
            </div>
          </StyledTooltip>
        </div>
      </div>
    </div>
  </div>
})

export default PushTestRunPopup