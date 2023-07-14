import {customTheme} from "../../styles/CustomTheme";

export default function StatusBadge({label, variant, ...props}) {
  const neutralLabels = ['created', 'waiting']
  const successLabels = ['success', 'finished']
  const processingLabels = ['processing']
  const errorLabels = ['error', 'failure']

  function getDefaultBackground() {
    let lowerCasedLabel = label.toLowerCase()

    if (neutralLabels.includes(lowerCasedLabel)) {

      return 'grey'
    } else if (successLabels.includes(lowerCasedLabel)) {

      return customTheme.palette.success.main
    } else if (processingLabels.includes(lowerCasedLabel)) {

      return 'steelblue'
    } else if (errorLabels.includes(lowerCasedLabel)) {

      return customTheme.palette.error.main
    }
  }

  return <label
    style={{
      borderRadius: "5px",
      border: "1px solid",
      borderColor: customTheme.palette.text.faded,
      width: "max-content",
      padding: "3px 7px",
      fontWeight: "bold",
      backgroundColor: getDefaultBackground(),
      color: customTheme.palette.text.white,
      height: 'min-content',
      ...props.style
    }}
  >{label.toUpperCase()}</label>
}