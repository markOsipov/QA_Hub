import StyledTooltip from "../../../../primitives/StyledTooltip";
import StyledTextField from "../../../../primitives/StyledTextField";
import testResultsFilterState from "../../../../../state/testResults/TestResultsFilterState";
import {observer} from "mobx-react-lite";

const SearchFilter = observer(({ applyFilters, ...props}) => {
  const filter = testResultsFilterState.filter
  const handleEnterKeyPressed = (event) => {
    if (event.key === 'Enter') {
      applyFilters()
    }
  }
  const handleValueChanged = (event) => {
    testResultsFilterState.setFilter(
      {
        ...filter,
        search: event.target.value
      }
    )
    testResultsFilterState.setFilterChanged(true)
  }

  return <StyledTooltip title={"Search by test's fullName, testcaseId or tag" } enterDelay={800}>
    <div style={{minWidth: '50px', ...props.style}}>
        <StyledTextField
          value={filter.search || ''}
          style={{color: "white", width: '100%'}}
          size="tiny"
          label="Filter"
          onKeyDown={handleEnterKeyPressed}
          onChange={handleValueChanged}
        />
    </div>
  </StyledTooltip>
})

export default SearchFilter