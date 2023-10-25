import StyledTooltip from "../../../../primitives/StyledTooltip";
import StyledTextField from "../../../../primitives/StyledTextField";
import testResultsFilterState from "../../../../../state/testResults/TestResultsFilterState";
import {observer} from "mobx-react-lite";

const SearchFilter = observer(({...props}) => {
  return <StyledTooltip title={"Search by test fullName or testcaseId" } enterDelay={800}>
    <div style={{minWidth: '50px', ...props.style}}>
      <StyledTextField value={testResultsFilterState.filter.search}
                       size="tiny"
                       label="Filter"
                       style={{color: "white", width: '100%'}}
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