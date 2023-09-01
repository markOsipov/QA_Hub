import StyledFormControl from "../../primitives/StyledFormControl";
import StyledTextField from "../../primitives/StyledTextField";
import {customTheme} from "../../../styles/CustomTheme";
import React from "react";

export default function TakeLastFilter({filter, setFilter, ...props}) {
  const handleBranchChange = (event) => {
    setFilter(
      {
        ...filter,
        takeLast: Number.parseInt(event.target.value) || null
      }
    )
  }

  return <StyledFormControl size={"tiny"}>
    <StyledTextField
      label="Max testruns"
      value={filter.takeLast || ''}
      style={{backgroundColor: customTheme.palette.background.input, minWidth: '150px', ...props.style}}
      onChange={handleBranchChange}
    />
  </StyledFormControl>
}