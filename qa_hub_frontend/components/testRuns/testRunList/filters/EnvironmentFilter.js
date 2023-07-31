import {FormControl} from "@mui/material";
import {customTheme} from "../../../../styles/CustomTheme";
import React from "react";
import StyledTextField from "../../../primitives/StyledTextField";
import StyledFormControl from "../../../primitives/StyledFormControl";

export default function EnvironmentFilter({filter, setFilter, ...props}) {
  const handleEnvironmentFilterChange = (event) => {
    setFilter(
      {
        ...filter,
        environment: event.target.value
      }
    )
  }

  return <StyledFormControl size={"tiny"}>
    <StyledTextField
      label="Environment"
      value={filter.environment || ''}
      style={{backgroundColor: customTheme.palette.background.input, ...props.style}}
      onChange={handleEnvironmentFilterChange}
    />
  </StyledFormControl>
}