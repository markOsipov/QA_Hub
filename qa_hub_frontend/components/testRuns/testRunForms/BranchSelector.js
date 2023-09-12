import {useEffect, useState} from "react";
import {getBranches} from "../../../requests/testRuns/TestRunFormsRequests";
import Typography from "@mui/material/Typography";
import {FormControl, Input, Popper, TextField} from "@mui/material";
import {customTheme} from "../../../styles/CustomTheme";
import {Autocomplete} from "@mui/lab";
import StyledTextField from "../../primitives/StyledTextField";
import {observer} from "mobx-react-lite";

const BranchSelector = observer(({ project, branch, setBranch, ...props }) => {
  const [branches, setBranches] = useState([])
  useEffect(() => {
    getBranches(project).then( response => {
      if (response.data) {
        setBranches(response.data)
      }
    })
  }, [project])

  const CustomPopper = function (props) {
    return <Popper {...props} style={{border: `1px solid ${customTheme.palette.text.disabled}`, borderRadius: '5px'}}/>;
  };

  return<div style={{display: "flex", alignItems: "center", width: "max-content", marginBottom: "25px"}}>
    <div style={{width: "300px", display: "flex", justifyContent: "end"}}>
      <Typography style={{position: "relative", top: "1px"}}>BRANCH</Typography>
    </div>
    <div style={{minWidth: "50%", marginLeft: "15px"}}>
      <Autocomplete
        disablePortal
        options={branches}
        style={{ width: "700px" }}
        value={branch}
        isOptionEqualToValue={(option, value) =>  option === value }
        onChange={(event, newValue) => { setBranch(newValue)}}
        renderInput={(params) => <StyledTextField style={{backgroundColor: customTheme.palette.background.input}} {...params}/>}
        PopperComponent={CustomPopper}
      />
    </div>
  </div>
})

export default BranchSelector