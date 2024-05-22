import StyledFormControl from "../../primitives/StyledFormControl";
import StyledTextField from "../../primitives/StyledTextField";
import {customTheme} from "../../../styles/CustomTheme";
import React from "react";
import StyledTooltip from "../../primitives/StyledTooltip";

export default function SearchFilter({filter, setFilter, filterAndLoad, ...props}) {
  const handleEnterKeyPressed = (event) => {
    if (event.key === 'Enter') {
      filterAndLoad(filter)
    }
  }
  const handleSearchFilterChange = (event) => {
    setFilter(
      {
        ...filter,
        search: event.target.value
      }
    )
  }

  return <StyledTooltip title={'Search by fullName or testcaseId'}>
    <StyledFormControl size={"tiny"} autoComplete={'off'}>
      <StyledTextField
        label="Search"
        value={filter?.search || ''}
        autoComplete={'off'}
        style={{backgroundColor: customTheme.palette.background.input, minWidth: '120px', ...props.style}}
        onChange={handleSearchFilterChange}
        onKeyDown={handleEnterKeyPressed}
      />
    </StyledFormControl>
  </StyledTooltip>
}