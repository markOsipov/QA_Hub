import {Checkbox, ListItemText, MenuItem, Paper} from "@mui/material";
import Typography from "@mui/material/Typography";
import StatusFilter from "./StatusFilter";
import SearchIcon from '@mui/icons-material/Search';
import Button from "@mui/material/Button";
export default function TestRunsFilter({ filter, setFilter, loadTestRuns, ...props }) {


  return <Paper style={{padding: "15px", ...props.style}}>
    <div style={{display: 'flex', alignItems: 'center'}}>
      <Typography variant={'h5'}>TestRuns </Typography>
      <div style={{flexGrow: '1.1'}}></div>

      <StatusFilter filter={filter} setFilter={setFilter}/>

      <Button variant="contained"
              color="primary"
              size="small"
              onClick={loadTestRuns}
              style={{height: 'min-content', marginLeft: '10px'}}
              endIcon={<SearchIcon />}
      >Search</Button>
    </div>

  </Paper>
}