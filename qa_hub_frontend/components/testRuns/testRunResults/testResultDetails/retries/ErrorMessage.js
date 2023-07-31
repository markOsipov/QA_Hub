import {customTheme} from "../../../../../styles/CustomTheme";
import {createRef, useEffect, useState} from "react";
import {ListItemIcon, ListItemText, Menu, MenuItem} from "@mui/material";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import WarningIcon from '@mui/icons-material/Warning';
export default function ErrorMessage({ message, testResults, setTestResults, filter, setFilter, setFilterChanged, ...props }) {
  const ref = createRef()
  const [anchorEl, setAnchorEl] = useState(null)
  const menuOpen = Boolean(anchorEl);

  const [selectedText, setSelectedText] = useState(null)
  const [testsWithSimilarError, setTestsWithSimilarError] = useState(null)
  const handleSelect = (event) => {
    const selection = window.getSelection()

    if (!selection.toString()) return;

    if (selection.anchorNode.parentNode === ref.current || selection.focusNode.parentNode === ref.current) {
      const selected = selection.extentNode.textContent.slice(selection.anchorOffset, selection.focusOffset)
      setSelectedText(selected)
    }
  }

  const handleAddToFilterClick = () => {
    setFilter({...filter, message: selectedText || message})
    setFilterChanged(true)
  }

  const closeMenu = () => {
    setAnchorEl(null)
    setSelectedText(null)
  }

  useEffect(() => {
    if (menuOpen) {
      setTestsWithSimilarError(testResults.filter(el => {
        return el.message?.includes(selectedText || message)
      }).length)
    }
  }, [menuOpen])

  useEffect(() => {
    document.addEventListener('selectionchange', handleSelect);
  }, [handleSelect])

  useEffect(() => {
    return () => {
      document.removeEventListener('selectionchange', handleSelect);
    }
  }, [handleSelect])

  if (!message) return null

  return <div
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
    <Menu
      anchorEl={anchorEl}
      open={menuOpen}
      onClose={closeMenu}
      MenuListProps={{
        'aria-labelledby': 'basic-button',
      }}
    >
      <div style={{padding: '0 10px 10px 10px'}}>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <WarningIcon style={{ color: customTheme.palette.error.main }}/>
          <label style={{marginLeft: '4px'}}>Similar errors: { testsWithSimilarError - 1 }</label>
        </div>

        { selectedText &&
          <div style={{display: 'flex', alignItems: 'center', marginTop: '12px'}}>
            <label style={{marginLeft: '4px', opacity: '0.8'}}>Containing:</label>
            <label style={{marginLeft: '6px', opacity: '0.6'}}>{ selectedText }</label>
          </div>
        }
      </div>

      <MenuItem onClick={handleAddToFilterClick}>
        <ListItemIcon>
          <FilterAltIcon fontSize="small" style={{color: "var(--primary-text-color)"}}/>
        </ListItemIcon>
        <ListItemText>Add to filter</ListItemText>
      </MenuItem>
    </Menu>
    <div onMouseUp={() => { setAnchorEl(ref.current) }}>
      <label ref={ref}    style={{whiteSpace: 'break-spaces', cursor: 'pointer'}}
      >{message}</label>
    </div>
  </div>
}