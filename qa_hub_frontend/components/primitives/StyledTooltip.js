import {styled} from "@mui/material/styles";
import {Tooltip, tooltipClasses} from "@mui/material";

const StyledTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 'none',
    fontSize: "14px"
  },
})

export default StyledTooltip