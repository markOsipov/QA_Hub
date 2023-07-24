import {FormControl} from "@mui/material";
import {customTheme} from "../../../../styles/CustomTheme";
import React from "react";
import StyledTextField from "../../../primitives/StyledTextField";

export default function EnvironmentFilter({filter, setFilter, ...props}) {
  const handleEnvironmentFilterChange = (event) => {
    setFilter(
      {
        ...filter,
        environment: event.target.value
      }
    )
  }

  return <FormControl size="small">
    <StyledTextField
      label="Environment"
      value={filter.environment || ''}
      style={{backgroundColor: customTheme.palette.background.input, ...props.style}}
      onChange={handleEnvironmentFilterChange}
      size="small"
    />
  </FormControl>
}