import {FormControl} from "@mui/material";
import {customTheme} from "../../../../styles/CustomTheme";
import React, {useEffect, useState} from "react";
import StyledTextField from "../../../primitives/StyledTextField";
import StyledFormControl from "../../../primitives/StyledFormControl";

export default function TagFilter({filter, setFilter, ...props}) {
  const handleTagChange = (event) => {
    setFilter(
      {
        ...filter,
        tag: event.target.value
      }
    )
  }

  return <StyledFormControl size={"tiny"}>
    <StyledTextField
      label="Tag"
      value={filter.tag || ''}
      style={{backgroundColor: customTheme.palette.background.input, ...props.style}}
      onChange={handleTagChange}
    />
  </StyledFormControl>
}