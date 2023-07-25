import StyledSelect from "../../../../primitives/StyledSelect";
import {customTheme} from "../../../../../styles/CustomTheme";
import {Checkbox, ListItemText, MenuItem} from "@mui/material";
import {useEffect, useState} from "react";
import StyledInputLabel from "../../../../primitives/StyledInputLabel";
import StyledFormControl from "../../../../primitives/StyledFormControl";

export default function StatusFilter({filter, setFilter,setFilterChanged, ...props}) {
  const separator = ", "
  const options = ["WAITING", "PROCESSING", "SUCCESS", "FAILURE"]

  const [statuses, setStatuses] = useState(filter.statuses || [])

  useEffect(() => {
    setFilter({
      ...filter, statuses: statuses
    })
  }, [statuses])

  useEffect(() => {
    setStatuses(filter.statuses || [])
  }, [filter.statuses])

  const handleStatusChange = (event) => {
    const value = event.target.value
    setStatuses(
      typeof value === 'string' ? value.split(',') : value,
    )
    setFilterChanged(true)
  }

  return <StyledFormControl size={"tiny"} style={{...props.style}}>
    <StyledInputLabel>Status</StyledInputLabel>
    <StyledSelect
      value={statuses}
      style={{backgroundColor: customTheme.palette.background.input, minWidth: '150px'}}
      onChange={handleStatusChange}
      renderValue={(selected) => selected.join(separator)}
      multiple
    >
      {
        (options).map(option => (
          <MenuItem key={option} value={option}>
            <Checkbox checked={(statuses).indexOf(option) > -1} />
            <ListItemText primary={option} />
          </MenuItem>
        ))
      }
    </StyledSelect>
  </StyledFormControl>
}