import {FormControl} from "@mui/material";
import {customTheme} from "../../../../styles/CustomTheme";
import React from "react";
import StyledTextField from "../../../primitives/StyledTextField";

export default function BranchFilter({filter, setFilter, ...props}) {
  const handleBranchChange = (event) => {
    setFilter(
      {
        ...filter,
        branch: event.target.value
      }
    )
  }

  return <FormControl size="small">
    <StyledTextField
      label="Branch"
      value={filter.branch || ''}
      style={{backgroundColor: customTheme.palette.background.input, minWidth: '150px', ...props.style}}
      onChange={handleBranchChange}
      size="small"
    />
  </FormControl>
}