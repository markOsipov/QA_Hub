import StyledSelect from "../../../primitives/StyledSelect";
import {customTheme} from "../../../../styles/CustomTheme";
import {Checkbox, ListItemText, MenuItem} from "@mui/material";
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

  return <StyledSelect
    value={statuses}
    style={{backgroundColor: customTheme.palette.background.input, minWidth: '150px', ...props.style}}
    onChange={handleStatusChange}
    renderValue={(selected) => selected.join(separator)}
    multiple
    size="small"
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
}