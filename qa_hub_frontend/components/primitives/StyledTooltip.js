import {styled} from "@mui/material/styles";
import {Tooltip, tooltipClasses} from "@mui/material";

const StyledTooltip = styled(({ className, maxWidth, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }}>{props.children}</Tooltip>
))(({ ...props }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    fontSize: "14px",
    maxWidth: props.maxWidth || "500px",
    backgroundColor: 'rgba(10, 10, 10, 0.65)'
  },

  [`& .${tooltipClasses.arrow}`]: {
    color: 'rgba(10, 10, 10, 0.65)'
  },
}))




export default StyledTooltip