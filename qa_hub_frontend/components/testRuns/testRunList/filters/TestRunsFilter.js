import {Checkbox, ListItemText, MenuItem, Paper} from "@mui/material";
import Typography from "@mui/material/Typography";
import StatusFilter from "./StatusFilter";
import SearchIcon from '@mui/icons-material/Search';
import Button from "@mui/material/Button";
import CommitFilter from "./CommitFilter";
import BranchFilter from "./BranchFilter";
import EnvironmentFilter from "./EnvironmentFilter";
import TagFilter from "./TagFilter";
import Loader from "../../../common/Loader";
import {customTheme} from "../../../../styles/CustomTheme";
export default function TestRunsFilter({ filter, setFilter, loadTestRuns, filterAndLoad, title, loading, ...props }) {

  return <Paper style={{padding: "15px", ...props.style}}>
    <div style={{display: 'flex', alignItems: 'center'}}>
      <Typography variant={'h5'}>{title || "TestRuns"}</Typography>
      <div style={{flexGrow: '1.1'}}></div>
      {
        loading &&
        <Loader style={{alignSelf: 'center', color: customTheme.palette.text.disabled}}/>
      }
      <StatusFilter filter={filter} setFilter={setFilter} style={{marginLeft: '15px'}} />
      <TagFilter    filter={filter} setFilter={setFilter} style={{marginLeft: '15px', width: '120px'}}/>
      <BranchFilter filter={filter} setFilter={setFilter} style={{marginLeft: '15px'}}/>
      <CommitFilter filter={filter} setFilter={setFilter} style={{marginLeft: '15px', width: '120px'}}/>
      <EnvironmentFilter filter={filter} setFilter={setFilter} style={{marginLeft: '15px', width: '120px'}}/>

      <Button variant="contained"
              color="primary"
              size="small"
              onClick={() => {filterAndLoad(filter)}}
              style={{height: 'min-content', marginLeft: '20px'}}
              endIcon={<SearchIcon />}
      >Search</Button>

      <Button variant="contained"
              color="error"
              size="small"
              onClick={() => {filterAndLoad({})}}
              style={{height: 'min-content', marginLeft: '10px'}}
      >Clear</Button>
    </div>
  </Paper>
}