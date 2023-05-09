import {customTheme} from "./CustomTheme";

export const textAreaStyle = {
    padding: "10px",
    resize: "vertical", width: "100%", height: "100px", maxHeight: "max-content", minHeight: "100px",
    color: customTheme.palette.text.primary,
    backgroundColor: customTheme.palette.background.textArea,
    fontFamily:"sans-serif", fontSize: "15px", lineHeight: "1.6",
    overflow: "auto"
}