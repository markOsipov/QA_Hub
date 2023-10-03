import {customTheme} from "../../styles/CustomTheme";

export default function TextWithLabel ({value, label, labelStyle, valueStyle, ...props }) {
  const style = labelStyle || { justifySelf: 'start', left: '5px'}

  return <div
    {...props}
    style={{
      display: 'grid',
      alignItems: 'center',
      borderRadius: '4px',
      border: "1px solid",
      padding:'5px 10px',
      minHeight: '35px',
      position: 'relative',
      borderColor: customTheme.palette.text.disabled,
      cursor: 'inherit',
      width: '100%',
      ...(props.style)
    }}
  >
    {
      label != null &&
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
        cursor: 'inherit',
        ...style
      }}>{label}</label>
    }
    <div
      style={{
        lineBreak: 'anywhere',
        paddingTop: '2px',
        paddingBottom: '2px',
      }}
    >
      <label style={{
        color: customTheme.palette.text.white,
        fontSize: props.style?.fontSize || '14px',
        minWidth: 'max-content',
        overflowX: 'hidden',
        cursor: 'inherit',
        ...valueStyle
      }}>{value}</label>
    </div>
  </div>
}