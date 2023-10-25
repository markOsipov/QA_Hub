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

  return <StyledTooltip title={"Search by test fullName or testcaseId" } enterDelay={800}>
    <div style={{minWidth: '50px', ...props.style}}>
      <StyledTextField value={filter.search}
                       size="tiny"
                       label="Filter"
                       style={{color: "white", width: '100%'}}
                       onKeyDown={handleEnterKeyPressed}
                       onChange ={(event) => {
                         testResultsFilterState.setFilter({
                           ...filter,
                           search: event.target.value
                         })
                         testResultsFilterState.setFilterChanged(true)
                       }}
      />
    </div>
  </StyledTooltip>
})

export default SearchFilter