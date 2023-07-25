import StatusFilter from "./StatusFilter";
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import {customTheme} from "../../../../../styles/CustomTheme";
import {useEffect, useState} from "react";
import UnreviewedFilter from "./UnreviewedFilter";
import RetriesFilter from "./RetriesFilter";
import ErrorFilter from "./ErrorFilter";
import DeviceFilter from "./DeviceFilter";

export default function TestResultsFilter({ filter, setFilter, filterAndLoad, filterChanged, setFilterChanged, ...props }) {
  const [searchIconHovered, setSearchIconHovered] = useState(false)
  const [clearIconHovered, setClearIconHovered] = useState(false)

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
      <DeviceFilter filter={filter} setFilter={setFilter} setFilterChanged={setFilterChanged} style={{marginLeft: '5px'}}/>
      <ErrorFilter filter={filter} setFilter={setFilter} setFilterChanged={setFilterChanged} style={{marginLeft: '5px'}}/>
      <RetriesFilter filter={filter} setFilter={setFilter} setFilterChanged={setFilterChanged} style={{marginLeft: '5px'}}/>
      <UnreviewedFilter filter={filter} setFilter={setFilter} setFilterChanged={setFilterChanged} style={{marginLeft: '5px'}}/>
      <StatusFilter filter={filter} setFilter={setFilter} setFilterChanged={setFilterChanged} style={{marginLeft: '5px'}} />

      <div
        onClick={handleSearchButtonClick}
        onMouseOver={() => {setSearchIconHovered(true)}}
        onMouseLeave={() => {setSearchIconHovered(false)}}
        style={{
          backgroundColor: customTheme.palette.primary.main,
          height: '25px',
          width: '25px',
          marginLeft: '10px',
          position: 'relative',
         ...customIconButtonBackgroundStyle
        }}
      >
        <div style={{
          ...customIconButtonHoverLayerStyle,
          backgroundColor: searchIconHovered ? 'rgba(255, 255, 255, 0.08)' : ''
        }}></div>
        <SearchIcon style={{color: customTheme.palette.text.primary, zIndex:'20'}} />
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

      <div
        onClick={handleClearButtonClick}
        onMouseOver={() => {setClearIconHovered(true)}}
        onMouseLeave={() => {setClearIconHovered(false)}}
        style={{
          backgroundColor: customTheme.palette.error.main,
          height: '25px',
          width: '25px',
          marginLeft: '6px',
          ...customIconButtonBackgroundStyle
        }}
      >
        <div style={{
          ...customIconButtonHoverLayerStyle,
          backgroundColor: clearIconHovered ? 'rgba(255, 255, 255, 0.08)' : ''
        }}></div>
        <ClearIcon style={{color: customTheme.palette.text.primary, zIndex:'20'}} />
      </div>
    </div>
  </div>
}

const customIconButtonBackgroundStyle= {
  borderRadius: '5px',
  display: 'grid',
  alignContent: 'center',
  justifyContent: 'center',
  position: 'relative',
  cursor: 'pointer'
}

const customIconButtonHoverLayerStyle = {
  position: "absolute",
  width: '100%',
  height: '100%',
  borderRadius: '5px',
  zIndex: '10'
}

const iconStyle = {
  marginLeft: '5px',

  height: '25px',
  width: '25px',
  borderRadius: '5px',
  display: 'grid',
  alignContent: 'center',
  justifyContent: 'center'
}