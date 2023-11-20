import {observer} from "mobx-react-lite";
import {customTheme} from "../../../../styles/CustomTheme";
import LabelIcon from "@mui/icons-material/Label";
import testResultsFilterState from "../../../../state/testResults/TestResultsFilterState";
import {useEffect, useState} from "react";

const TestResultTags = observer(({tags, ...props}) => {
  return  <div style={{display: 'flex', ...props.style}}>
    {
      (tags || []).map((tag, index) => {
        return <TestResultTag
          tag={tag}
          style={{
            marginLeft: '2px',
          }}
          key={index}
        />
      })
    }
  </div>
})

const TestResultTag = observer(({ tag, ...props}) => {
  const {filter} = testResultsFilterState

  const [color, setColor] = useState(customTheme.palette.text.faded)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    let filterTags = filter.tags || []
    if (filterTags.length === 0 ) {
      setColor(customTheme.palette.text.faded)
    } else if (filterTags.includes(tag)) {
      setColor(customTheme.palette.text.white)
    } else {
      setColor(customTheme.palette.text.disabled)
    }
  }, [filter])

  useEffect(() => {
    console.log(JSON.stringify(filter))
  }, [filter])

  const handleClick = () => {
    let filterTags = filter.tags || []

    if (!filterTags.includes(tag)) {
      testResultsFilterState.setFilter({
        ...filter, tags: [...filterTags, tag]
      })
    } else {
      let newTags = [...filterTags]
      newTags = newTags.filter(el => { return el !== tag })

      testResultsFilterState.setFilter({
        ...filter, tags: newTags
      })
    }
    testResultsFilterState.setFilterChanged(true)
  }

  return <div
    style={{
      display: 'flex',
      alignItems: 'center',
      color: color,
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
})

export default TestResultTags