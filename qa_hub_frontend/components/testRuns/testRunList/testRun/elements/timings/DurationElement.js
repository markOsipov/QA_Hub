import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";

export default function DurationElement({ duration, ...props }) {
  return <div style={{display: 'flex', alignItems: "center", ...props.style}}>
    <AccessTimeFilledIcon></AccessTimeFilledIcon>
    <label style={{marginLeft: '3px'}}>{duration + ' min'}</label>
  </div>
}