import {Paper} from "@mui/material";
import Typography from "@mui/material/Typography";
import Loader from "../../common/Loader";
import {customTheme} from "../../../styles/CustomTheme";
import StatusFilter from "../../testRuns/testRunList/filters/StatusFilter";
import TagFilter from "../../testRuns/testRunList/filters/TagFilter";
import BranchFilter from "../../testRuns/testRunList/filters/BranchFilter";
import CommitFilter from "../../testRuns/testRunList/filters/CommitFilter";
import EnvironmentFilter from "../../testRuns/testRunList/filters/EnvironmentFilter";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import TakeLastFilter from "./TakeLastFilter";

export default function StatsTestRunsFilter({ filter, setFilter, loadTestRuns, filterAndLoad, loading, ...props }) {

  return <Paper style={{padding: "15px", ...props.style}}>
    <div style={{display: 'flex', alignItems: 'center'}}>
      <Typography variant={'h5'}>{"Test stats by testruns"}</Typography>
      <div style={{flexGrow: '1.1'}}></div>
      {
        loading &&
        <Loader style={{alignSelf: 'center', color: customTheme.palette.text.disabled}}/>
      }

      <TagFilter filter={filter} setFilter={setFilter} style={{marginLeft: '15px', width: '120px'}}/>
      <BranchFilter filter={filter} setFilter={setFilter} style={{marginLeft: '15px'}}/>
      <EnvironmentFilter filter={filter} setFilter={setFilter} style={{marginLeft: '15px', width: '120px'}}/>
      <TakeLastFilter filter={filter} setFilter={setFilter} style={{marginLeft: '15px', width: '100px'}} />

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