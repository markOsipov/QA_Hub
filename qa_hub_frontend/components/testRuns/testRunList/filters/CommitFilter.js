import {FormControl} from "@mui/material";
import {customTheme} from "../../../../styles/CustomTheme";
import React, {useEffect, useState} from "react";
import StyledTextField from "../../../primitives/StyledTextField";
import StyledFormControl from "../../../primitives/StyledFormControl";

export default function CommitFilter({filter, setFilter, ...props}) {
  const handleCommitChange = (event) => {
    setFilter(
      {
        ...filter,
        commit: event.target.value
      }
    )
  }

  return <StyledFormControl size={"tiny"}>
    <StyledTextField
      label="Commit"
      value={filter.commit || ''}
      style={{backgroundColor: customTheme.palette.background.input, minWidth: '150px', ...props.style}}
      onChange={handleCommitChange}
    />
  </StyledFormControl>
}