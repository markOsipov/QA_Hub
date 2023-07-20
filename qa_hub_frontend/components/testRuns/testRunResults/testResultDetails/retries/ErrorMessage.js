import {customTheme} from "../../../../../styles/CustomTheme";
import {createRef, useEffect, useRef, useState} from "react";

export default function ErrorMessage({ message, ...props }) {
  const ref = createRef()
  const handleSelect = () => {
    const selection = window.getSelection()
    if (!selection.toString()) return;
    const selectedText = selection.extentNode.textContent.slice(selection.anchorOffset, selection.focusOffset)

    console.log(selectedText)
  }

  useEffect(() => {
    document.addEventListener('select', handleSelect);
  }, [handleSelect])

  useEffect(() => {
    return () => {
      document.removeEventListener('select', handleSelect);
    }
  }, [handleSelect])



  if (!message) return null

  return  <div
    rootRef={ref}
    style={{
      padding: '10px',
      border: '1px solid',
      borderColor: customTheme.palette.error.main,
      borderRadius: '10px',
      backgroundColor: customTheme.palette.error.faded,
      width: 'max-content',

      display: 'grid',
      ...props.style
    }}>
      {
        message.split("\n").map((line, index) => {
          return <label key={index} style={{whiteSpace: 'break-spaces'}}>{line}</label>
        })
      }
    </div>
}