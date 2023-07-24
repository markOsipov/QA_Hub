import {FormControl} from "@mui/material";
import {customTheme} from "../../../../styles/CustomTheme";
import React, {useEffect, useState} from "react";
import StyledTextField from "../../../primitives/StyledTextField";

export default function CommitFilter({filter, setFilter, ...props}) {
  const handleCommitChange = (event) => {
    setFilter(
      {
        ...filter,
        commit: event.target.value
      }
    )
  }

  return <StyledTextField
      label="Commit"
      value={filter.commit || ''}
      style={{backgroundColor: customTheme.palette.background.input, minWidth: '150px', ...props.style}}
      onChange={handleCommitChange}
      size="small"
    />
}