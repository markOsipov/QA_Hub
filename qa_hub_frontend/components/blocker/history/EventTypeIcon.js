import StyledTooltip from "../../primitives/StyledTooltip";
import CustomIconButton from "../../primitives/CustomIconButton";
import {customTheme} from "../../../styles/CustomTheme";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import EditIcon from "@mui/icons-material/Edit";

const EventTypeIcon = ({eventType, ...props}) => {
  switch (eventType) {
    case 'block':
      return <StyledTooltip title={'Blocked'}>
        <div>
          <CustomIconButton
            color={customTheme.palette.error.main}
            icon={<LockIcon />}
          />
        </div>
      </StyledTooltip>
    case 'unblock':
      return <StyledTooltip title={'Unblocked'}>
        <div>
          <CustomIconButton
            color={customTheme.palette.success.main}
            icon={<LockOpenIcon />}
          />
        </div>
      </StyledTooltip>
    case 'edit':
      return <StyledTooltip title={'Edited'}>
        <div>
          <CustomIconButton
            color={customTheme.palette.warning.main}
            icon={<EditIcon />}
          />
        </div>
      </StyledTooltip>
    default:
      return <></>
  }
}

export default EventTypeIcon