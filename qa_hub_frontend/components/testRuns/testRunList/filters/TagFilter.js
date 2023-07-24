import {FormControl} from "@mui/material";
import {customTheme} from "../../../../styles/CustomTheme";
import React, {useEffect, useState} from "react";
import StyledTextField from "../../../primitives/StyledTextField";

export default function TagFilter({filter, setFilter, ...props}) {
  const handleTagChange = (event) => {
    setFilter(
      {
        ...filter,
        tag: event.target.value
      }
    )
  }

  return <StyledTextField
    label="Tag"
    value={filter.tag || ''}
    style={{backgroundColor: customTheme.palette.background.input, ...props.style}}
    onChange={handleTagChange}
    size="small"
  />
}