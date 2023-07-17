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
      top: '-14px',
      backgroundColor: "rgb(77 77 77)",
      paddingLeft: "5px",
      paddingRight: "5px",
      paddingBottom: "1px",
      fontSize: "14px",
      borderRadius: '5px',
      boxShadow: 'rgba(0, 0, 0, 0.1) 0px 1px 1px, rgba(0, 0, 0, 0.1) 0px 3px 3px',
      border: `1px solid ${customTheme.palette.text.disabled}`,
      ...style
    }}>{label}</label>
    <label style={{
      color: customTheme.palette.text.white,
      fontSize: props.style.fontSize,
      paddingTop: '6px',
    }}>{value}</label>
  </div>
}