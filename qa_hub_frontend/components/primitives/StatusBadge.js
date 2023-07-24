import {customTheme} from "../../styles/CustomTheme";

export default function StatusBadge({label, variant, ...props}) {
  const neutralLabels = ['created', 'waiting']
  const successLabels = ['success', 'finished']
  const processingLabels = ['processing']
  const errorLabels = ['error', 'failure']

  function getDefaultBackground() {
    let lowerCasedLabel = String(label).toLowerCase()

    if (variant === 'neutral' || neutralLabels.includes(lowerCasedLabel)) {
      return 'grey'

    } else if (variant === 'success' || successLabels.includes(lowerCasedLabel)) {
      return customTheme.palette.success.main

    } else if (variant === 'processing' || processingLabels.includes(lowerCasedLabel)) {
      return 'steelblue'

    } else if (variant === 'error' || errorLabels.includes(lowerCasedLabel)) {
      return customTheme.palette.error.main
    }
  }

  return <label
    {...props}
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
  >{String(label).toUpperCase()}</label>
}