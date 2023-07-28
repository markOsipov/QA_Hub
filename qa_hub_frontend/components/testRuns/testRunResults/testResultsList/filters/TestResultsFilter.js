import StatusFilter from "./StatusFilter";
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import {customTheme} from "../../../../../styles/CustomTheme";
import UnreviewedFilter from "./UnreviewedFilter";
import RetriesFilter from "./RetriesFilter";
import ErrorFilter from "./ErrorFilter";
import DeviceFilter from "./DeviceFilter";
import CustomIconButton from "../../../../primitives/CustomIconButton";

export default function TestResultsFilter({ filter, setFilter, filterAndLoad, filterChanged, setFilterChanged, runners, ...props }) {
  const handleSearchButtonClick = () => {
    filterAndLoad(filter)
    setFilterChanged(false)
  }

  const handleClearButtonClick = () => {
    filterAndLoad({})
    setFilterChanged(false)
  }

  return <div style={{overflowX: 'auto', ...props.style}}>
    <div style={{display: 'flex', alignItems: 'center', minWidth: 'max-content', paddingTop: '6px'}}>
      <div style={{flexGrow: '1.1'}}></div>
      <DeviceFilter filter={filter} setFilter={setFilter} setFilterChanged={setFilterChanged} style={{marginLeft: '5px'}} runners={runners}/>
      <ErrorFilter filter={filter} setFilter={setFilter} setFilterChanged={setFilterChanged} style={{marginLeft: '5px'}}/>
      <RetriesFilter filter={filter} setFilter={setFilter} setFilterChanged={setFilterChanged} style={{marginLeft: '5px'}}/>
      <UnreviewedFilter filter={filter} setFilter={setFilter} setFilterChanged={setFilterChanged} style={{marginLeft: '5px'}}/>
      <StatusFilter filter={filter} setFilter={setFilter} setFilterChanged={setFilterChanged} style={{marginLeft: '5px'}} />


      <div style={{position:'relative'}}>
        <CustomIconButton
          action={handleSearchButtonClick}
          icon={<SearchIcon/>}
        />
        {
          filterChanged &&
          <div style={{
            width: '5px',
            height: '5px',
            borderRadius: '5px',
            backgroundColor: 'red',
            left: 'calc(100% - 4px)',
            top: 'calc(100% - 4px)',
            position: 'absolute'
          }}
          />
        }
      </div>
      <CustomIconButton
        action={handleClearButtonClick}
        color={customTheme.palette.error.main}
        icon={<ClearIcon/>}
      />
    </div>
  </div>
}