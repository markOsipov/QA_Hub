import StatusFilter from "./StatusFilter";
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import {customTheme} from "../../../../../styles/CustomTheme";
import {useState} from "react";
import UnreviewedFilter from "./UnreviewedFilter";

export default function TestResultsFilter({ filter, setFilter, filterAndLoad, ...props }) {
  const [searchIconHovered, setSearchIconHovered] = useState(false)
  const [clearIconHovered, setClearIconHovered] = useState(false)

  return <div style={{...props.style}}>
    <div style={{display: 'flex', alignItems: 'center'}}>
      <div style={{flexGrow: '1.1'}}></div>

      <UnreviewedFilter filter={filter} setFilter={setFilter} style={{marginLeft: '8px'}}/>
      <StatusFilter filter={filter} setFilter={setFilter} style={{marginLeft: '8px'}} />

      <div
        onClick={() => {filterAndLoad(filter)}}
        onMouseOver={() => {setSearchIconHovered(true)}}
        onMouseLeave={() => {setSearchIconHovered(false)}}
        style={{
          backgroundColor: customTheme.palette.primary.main,
          height: '25px',
          width: '25px',
          marginLeft: '10px',
         ...customIconButtonBackgroundStyle
        }}
      >
        <div style={{
          ...customIconButtonHoverLayerStyle,
          backgroundColor: searchIconHovered ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0)'
        }}></div>
        <SearchIcon style={{color: customTheme.palette.text.primary, zIndex:'20'}} />
      </div>

      <div
        onClick={() => {filterAndLoad(filter)}}
        onMouseOver={() => {setClearIconHovered(true)}}
        onMouseLeave={() => {setClearIconHovered(false)}}
        style={{
          backgroundColor: customTheme.palette.error.main,
          height: '25px',
          width: '25px',
          marginLeft: '10px',
          ...customIconButtonBackgroundStyle
        }}
      >
        <div style={{
          ...customIconButtonHoverLayerStyle,
          backgroundColor: clearIconHovered ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0)'
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