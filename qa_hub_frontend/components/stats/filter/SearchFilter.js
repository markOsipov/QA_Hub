import StyledFormControl from "../../primitives/StyledFormControl";
import StyledTextField from "../../primitives/StyledTextField";
import {customTheme} from "../../../styles/CustomTheme";
import React from "react";

export default function SearchFilter({filter, setFilter, ...props}) {
  const handleSearchFilterChange = (event) => {
    setFilter(
      {
        ...filter,
        search: event.target.value
      }
    )
  }

  return <StyledFormControl size={"tiny"} autocomplete={'off'}>
    <StyledTextField
      label="Search"
      value={filter.search || ''}
      style={{backgroundColor: customTheme.palette.background.input, minWidth: '120px', ...props.style}}
      onChange={handleSearchFilterChange}
    />
  </StyledFormControl>
}