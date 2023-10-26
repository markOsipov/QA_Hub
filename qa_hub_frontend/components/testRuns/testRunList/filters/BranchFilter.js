import {FormControl} from "@mui/material";
import {customTheme} from "../../../../styles/CustomTheme";
import React from "react";
import StyledTextField from "../../../primitives/StyledTextField";
import StyledFormControl from "../../../primitives/StyledFormControl";

export default function BranchFilter({filter, setFilter, filterAndLoad, ...props}) {
  const handleEnterKeyPressed = (event) => {
    if (event.key === 'Enter') {
      filterAndLoad(filter)
    }
  }
  const handleBranchChange = (event) => {
    setFilter(
      {
        ...filter,
        branch: event.target.value
      }
    )
  }

  return <StyledFormControl size={"tiny"}>
    <StyledTextField
      label="Branch"
      value={filter.branch || ''}
      style={{backgroundColor: customTheme.palette.background.input, minWidth: '150px', ...props.style}}
      onChange={handleBranchChange}
      onKeyDown={handleEnterKeyPressed}
    />
  </StyledFormControl>
}