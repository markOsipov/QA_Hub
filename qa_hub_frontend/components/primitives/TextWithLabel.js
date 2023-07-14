import {customTheme} from "../../styles/CustomTheme";

export default function TextWithLabel ({value, label, ...props }) {

  return <div style={{
    borderRadius: '4px',
    border: "1px solid",
    padding: '12px',
    position: 'relative',
    borderColor: customTheme.palette.text.disabled,
    minHeight: "41px",
    ...(props.style)}}
  >
    <label style={{
      position: "absolute",
      top: '-10px',
      left: '5px',
      backgroundColor: "rgb(77 77 77)",
      paddingLeft: "6px",
      paddingRight: "6px",
      fontSize: "12px",
      paddingBottom: "0"
    }}>{label}</label>
    <label style={{
      color: customTheme.palette.text.white,
      fontSize: props.style.fontSize
    }}>{value}</label>
  </div>
}