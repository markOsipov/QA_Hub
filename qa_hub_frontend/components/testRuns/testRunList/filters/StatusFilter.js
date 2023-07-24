import StyledSelect from "../../../primitives/StyledSelect";
import {customTheme} from "../../../../styles/CustomTheme";
import {Checkbox, FormControl, InputLabel, ListItemText, MenuItem} from "@mui/material";
import {useEffect, useState} from "react";

export default function StatusFilter({filter, setFilter, ...props}) {
  const separator = ", "
  const options = ["CREATED", "PROCESSING", "FINISHED", "ERROR", "CANCELED"]

  const [statuses, setStatuses] = useState(filter.statuses || [])

  useEffect(() => {
    setFilter({
      ...filter, statuses: statuses
    })
  }, [statuses])

  const handleStatusChange = (event) => {
    const value = event.target.value
    setStatuses(
      typeof value === 'string' ? value.split(',') : value,
    );
  }

  return <FormControl size="small" style={{...props.style}}>
    <InputLabel style={{color: customTheme.palette.text.faded}}>Status</InputLabel>
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
    </FormControl>
}