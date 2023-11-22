import {useEffect, useState} from "react";
import {customTheme} from "../../../../../styles/CustomTheme";
import StyledTooltip from "../../../../primitives/StyledTooltip";
import LabelIcon from "@mui/icons-material/Label";

const TestRunTags = ({tags, filter, setFilter, filterAndLoad, ...props}) => {
  return  <div
    style={{
      display: 'flex',
      flexWrap: 'wrap',
      maxWidth: '45%',
      justifyContent: 'end',
      ...props.style}}
  >
    {
      (tags || []).map((tag, index) => {
        return <TestRunTag
          tag={tag}
          style={{
            marginLeft: '2px',
          }}
          filter={filter}
          setFilter={setFilter}
          filterAndLoad={filterAndLoad}
          key={index}
        />
      })
    }
  </div>
}

const TestRunTag = ({ tag, filter, setFilter, filterAndLoad, ...props}) => {
  const [isFiltered, setIsFiltered] = useState(filter.tag === tag)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    let filterTag = filter.tag || ""

    if (filterTag === tag) {
      setIsFiltered(true)
    } else {
      setIsFiltered(false)
    }
  }, [filter, tag])

  const handleClick = () => {
    let filterTag = filter.tag || ""
    let newFilter = {}

    if (filterTag.length === 0 || !filterTag === tag) {
      newFilter = { ...filter, tag: tag }
      setFilter(newFilter)
    } else {
      newFilter = { ...filter, tag: null }
      setFilter(newFilter)
    }

    filterAndLoad(newFilter)
  }

  return <StyledTooltip title={isFiltered ? `Remove tag ${tag} from filter` : `Filter testruns by tag: ${tag}`}>
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        color:  filter.tag === tag ? customTheme.palette.text.white : customTheme.palette.text.faded,
        padding: '3px 5px',
        cursor: 'pointer',
        backgroundColor: hovered ? 'rgba(255, 255, 255, 0.09)' : 'unset',
        ...props.style
      }}
      onClick={handleClick}
      onMouseOver={() => {setHovered(true)}}
      onMouseLeave={() => {setHovered(false)}}
    >
      <LabelIcon
        style={{
          transform: 'rotate(180deg)',
          color: customTheme.palette.text.disabled
        }}
      />
      <label style={{position: 'relative', top: '-1px', marginLeft: '2px', cursor: 'pointer'}}>{tag}</label>
    </div>
  </StyledTooltip>
}

export default TestRunTags