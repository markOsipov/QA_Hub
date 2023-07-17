import {customTheme} from "../../styles/CustomTheme";

export default function TextWithLabel ({value, label, labelStyle, ...props }) {
  const style = labelStyle || { justifySelf: 'start', left: '5px'}

  return <div style={{
    display: 'grid',
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
      top: '-15px',
      backgroundColor: "rgb(77 77 77)",
      paddingLeft: "4px",
      paddingRight: "4px",
      fontSize: "15px",
      paddingBottom: "0",
      ...style
    }}>{label}</label>
    <label style={{
      color: customTheme.palette.text.white,
      fontSize: props.style.fontSize,
    }}>{value}</label>
  </div>
}