import StatusFilter from "./StatusFilter";
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import {customTheme} from "../../../../../styles/CustomTheme";
import UnreviewedFilter from "./UnreviewedFilter";
import RetriesFilter from "./RetriesFilter";
import ErrorFilter from "./ErrorFilter";
import DeviceFilter from "./DeviceFilter";
import CustomIconButton from "../../../../primitives/CustomIconButton";
import testResultsFilterState from "../../../../../state/testResults/TestResultsFilterState";
import {observer} from "mobx-react-lite";
import {useState} from "react";
import Loader from "../../../../common/Loader";

const TestResultsFilter = observer(({filterAndLoad, filterLoading, runners, ...props }) => {
  const {filter,  filterChanged } = testResultsFilterState
  const handleSearchButtonClick = () => {
    filterAndLoad(filter)
    testResultsFilterState.setFilterChanged(false)
  }

  const handleClearButtonClick = () => {
    filterAndLoad({})
    testResultsFilterState.setFilterChanged(false)
  }

  return <div style={{overflowX: 'auto', ...props.style}}>
    <div style={{display: 'flex', alignItems: 'center', minWidth: 'max-content', paddingTop: '6px'}}>
      <div style={{flexGrow: '1'}}></div>

      <div style={{overflow: 'hidden', position: 'relative', top: '1px'}}>
        {
          filterLoading && <Loader style={{color: customTheme.palette.text.disabled, marginRight: '1px'}}/>
        }
      </div>

      <DeviceFilter style={{marginLeft: '5px'}} runners={runners}/>
      <ErrorFilter style={{marginLeft: '5px'}}/>
      <RetriesFilter style={{marginLeft: '5px'}}/>
      <UnreviewedFilter style={{marginLeft: '5px'}}/>
      <StatusFilter style={{marginLeft: '5px'}} />


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
})

export default TestResultsFilter