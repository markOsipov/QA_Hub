import {customTheme} from "../../../../../styles/CustomTheme";
import StyledTooltip from "../../../../primitives/StyledTooltip";
import {createRef, useState} from "react";
import {Menu, MenuItem} from "@mui/material";
import testResultsFilterState from "../../../../../state/testResults/TestResultsFilterState";
import {observer} from "mobx-react-lite";
import LabelIcon from "@mui/icons-material/Label";
import CloseIcon from "@mui/icons-material/Close";

const TagFilter = observer(({...props}) => {
  const [hovered, setHovered] = useState(false)
  const ref = createRef()
  const [anchorEl, setAnchorEl] = useState(null)

  const {tags} = testResultsFilterState.filter
  if ((tags || []).length === 0) return null

  return <>
    <FilterMenu
      anchorEl={anchorEl}
      setAnchorEl={setAnchorEl}
    />

    <StyledTooltip title={'Search by test tags'} enterDelay={800}>
      <div
        ref={ref}
        onMouseUp={() => { setAnchorEl(ref.current) }}
        onMouseOver={() => { setHovered(true)}}
        onMouseLeave={() => { setHovered(false)}}

        style={{
          position: 'relative',
          height: '25px',
          width: '25px',
          display: 'grid',
          alignContent: 'center',
          justifyContent: 'center',
          borderRadius: '5px',
          cursor: 'pointer',

          color: customTheme.palette.text.white,
          border: `1px solid ${customTheme.palette.text.white}`,
          backgroundColor: hovered ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.7)',
          ...props.style
        }}
      >
        <div style={{
          position: 'absolute',
          left: '-1',
          top: '-1',
          width: '25px',
          height: '25px',
          borderRadius: '5px',
          backgroundColor: hovered ? 'rgba(255, 255, 255, 0.08)' : ''}} />
        <LabelIcon
          style={{
            transform: 'rotate(180deg)',
            color: customTheme.palette.text.primary
          }}
        />
      </div>
    </StyledTooltip>
  </>
})


const FilterMenu = observer(({ anchorEl, setAnchorEl, ...props}) => {
  const {filter } = testResultsFilterState

  const menuOpen = Boolean(anchorEl);
  const closeMenu = () => {
    setAnchorEl(null)
  }

  return <Menu
    anchorEl={anchorEl}
    open={menuOpen}
    onClose={closeMenu}
  >
    <div style={{display: 'grid', padding: '5px 15px'}}>
      {
        (filter?.tags || []).map((tag, index) => {
          return <TagFilterItem
            key={index}
            tag={tag}
            anchorEl={anchorEl}
            setAnchorEl={setAnchorEl}
            style={{marginTop: index > 0 && '14px'}}
          />
        })
      }
    </div>
  </Menu>
})

const TagFilterItem = observer(({tag, anchorEl, setAnchorEl, ...props})  => {
  const {filter} = testResultsFilterState
  const [hovered, setHovered] = useState(false)

  const removeTagFromFilter = () => {
    let newTags = [...(filter.tags || [])]
    newTags = newTags.filter(el => { return el !== tag })

    testResultsFilterState.setFilter({
      ...filter, tags: newTags
    })
    testResultsFilterState.setFilterChanged(true)
  }

  return <div
    style={{
      display: 'flex',
      alignItems: 'center',
      padding: '3px 5px',
      cursor: 'pointer',

      ...props.style
    }}

  >
    <LabelIcon
      style={{
        transform: 'rotate(180deg)',
        color: customTheme.palette.text.disabled
      }}
    />
    <label style={{position: 'relative', top: '-1px', marginLeft: '2px', cursor: 'pointer'}}>{tag}</label>

    <div style={{flexGrow: '1'}}></div>

    <CloseIcon
      onClick={removeTagFromFilter}
      onMouseOver={() => {setHovered(true)}}
      onMouseLeave={() => {setHovered(false)}}
      style={{
        marginLeft: '15px',
        color: customTheme.palette.text.disabled,
        backgroundColor: hovered ? 'rgba(255, 255, 255, 0.09)' : 'unset',
      }}
    />
  </div>
})


export default TagFilter