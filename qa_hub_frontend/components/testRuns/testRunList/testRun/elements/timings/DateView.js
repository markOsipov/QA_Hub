import TextWithLabel from "../../../../../primitives/TextWithLabel";

export default function DateView({value, label}) {

  return <TextWithLabel
    value={value}
    label={label}
    labelStyle={{ justifySelf: 'center'}}
    style={{...dateBadgeStyle, marginLeft: '10px'}}
  />
}

export const dateBadgeStyle = {
  fontSize: "12px",
  width: "max-content",
  padding: "5px 6px",
  minHeight: 'unset',
  minWidth: '70px',
  display: 'grid',
  justifyItems: 'center'
}