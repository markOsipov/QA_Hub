import {customTheme} from "../../../../../styles/CustomTheme";
import {createRef, useEffect, useState} from "react";
import {ListItemIcon, ListItemText, Menu, MenuItem} from "@mui/material";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import WarningIcon from '@mui/icons-material/Warning';
import {observer} from "mobx-react-lite";
import testResultsFilterState from "../../../../../state/testResults/TestResultsFilterState";
import testResultsState from "../../../../../state/testResults/TestResultsState";
import {countTestResults} from "../../../../../requests/testResults/TestResultsRequests";
const ErrorMessage = observer(({ message, ...props }) => {
  const {filter} = testResultsFilterState
  const {selectedTest, testResults} = testResultsState
  const ref = createRef()
  const [anchorEl, setAnchorEl] = useState(null)
  const menuOpen = Boolean(anchorEl);

  const [selectedText, setSelectedText] = useState(null)
  const [testsWithSimilarError, setTestsWithSimilarError] = useState(null)

  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setMouseX(event.clientX);
    setMouseY(event.clientY);
  }

  const calcHeight = () => {
    if (message.split("\n").length > 30) {
      return "500px"
    }
    return "max-content"
  }

  const handleSelect = (event) => {
    const selection = window.getSelection()

    if (!selection.toString()) return;

    if (selection.anchorNode.parentNode === ref.current || selection.focusNode.parentNode === ref.current) {
      const selected = selection.extentNode.textContent.slice(selection.anchorOffset, selection.focusOffset)
      setSelectedText(selected)
    }
  }

  const handleAddToFilterClick = () => {
    testResultsFilterState.setFilter({...filter, message: selectedText || message})
    testResultsFilterState.setFilterChanged(true)
  }

  const closeMenu = () => {
    setAnchorEl(null)
    setSelectedText(null)
  }

  useEffect(() => {
    if (menuOpen) {
      countTestResults(selectedTest.testRunId, {message: selectedText || message}).then((data) => {
        setTestsWithSimilarError(data.data.count)
      })
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
      resize: 'vertical',
      maxHeight: calcHeight(),
      overflowY: 'auto',
      ...props.style
    }}
  >
    <Menu
      anchorEl={anchorEl}
      open={menuOpen}
      onClose={closeMenu}
      anchorReference="anchorPosition"
      anchorPosition={{
        top: mouseY,
        left: mouseX,
      }}
      MenuListProps={{
        'aria-labelledby': 'basic-button',
      }}
    >
      <div style={{padding: '0 10px 10px 10px'}}>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <WarningIcon style={{ color: customTheme.palette.error.main }}/>

          {
            testsWithSimilarError >= 0 &&
            <label style={{marginLeft: '4px'}}>Similar errors: { testsWithSimilarError }</label>
          }

          {
            testsWithSimilarError < 0 &&
            <label style={{marginLeft: '4px'}}>Similar errors: Unknown</label>
          }
          
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
          <FilterAltIcon fontSize="small" style={{color: customTheme.palette.text.primary}}/>
        </ListItemIcon>
        <ListItemText>Add to filter</ListItemText>
      </MenuItem>
    </Menu>
    <div onClick={handleClick}>
      <label ref={ref} style={{whiteSpace: 'break-spaces', cursor: 'pointer'}}
      >{message}</label>
    </div>
  </div>
})

export default ErrorMessage