import {customTheme} from "../../../../../styles/CustomTheme";
import {createRef, useEffect, useRef, useState} from "react";
import Button from "@mui/material/Button";

export default function ErrorMessage({ message, ...props }) {
  const ref = createRef()
  const [anchorEl, setAnchorEl] = useState(null)

  const [selectedText, setSelectedText] = useState(null)
  const handleSelect = () => {
    const selection = window.getSelection()
    const { current: el } = ref

    if (!selection.toString()) return;

    if (selection.anchorNode.parentNode === ref.current || selection.focusNode.parentNode === ref.current) {
      const selected = selection.extentNode.textContent.slice(selection.anchorOffset, selection.focusOffset)
      setSelectedText(selected)
    }
  }

  const closeMenu = () => {
    setAnchorEl(null)
  }

  useEffect(() => {
    document.addEventListener('selectionchange', handleSelect);
  }, [handleSelect])

  useEffect(() => {
    return () => {
      document.removeEventListener('selectionchange', handleSelect);
    }
  }, [handleSelect])

  if (!message) return null

  return <div onBlur={() => { setSelectedText(null) }}>
    <div
      style={{
        padding: '10px',
        border: '1px solid',
        borderColor: customTheme.palette.error.main,
        borderRadius: '10px',
        backgroundColor: customTheme.palette.error.faded,
        width: 'max-content',

        display: 'grid',
        ...props.style
      }}
    >
      <label ref={ref} style={{whiteSpace: 'break-spaces'}}
      >{message}</label>
    </div>
  </div>
}