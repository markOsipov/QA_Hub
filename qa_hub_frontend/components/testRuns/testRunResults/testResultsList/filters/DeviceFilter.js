import {customTheme} from "../../../../../styles/CustomTheme";
import StyledTooltip from "../../../../primitives/StyledTooltip";
import {createRef, useState} from "react";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import {Menu, MenuItem} from "@mui/material";
import ComputerIcon from "@mui/icons-material/Computer";
export default function DeviceFilter({filter, setFilter, setFilterChanged, runners, ...props}) {
  const [hovered, setHovered] = useState(false)
  const ref = createRef()
  const [anchorEl, setAnchorEl] = useState(null)

  const turnedOnStyle = {
    color: customTheme.palette.text.white,
    border: `1px solid ${customTheme.palette.text.white}`,
    borderRadius: '5px',
    backgroundColor: 'rgba(0, 0, 0, 0.9)'
  }

  const turnedOffStyle = {
    border: `1px solid ${customTheme.palette.text.white}`,
    opacity: '0.6',
    backgroundColor: hovered ? 'rgba(0, 0, 0, 0.9)' : '',
  }

  const getStyle = () => {
    if (!filter.deviceId) {
      return turnedOffStyle
    } else return turnedOnStyle
  }

  const getTooltipText = () => {
    if (filter.deviceId) {
      return `Only tests executed on the next device are shown: ${filter.deviceId}`
    } else return "Shows only tests executed on certain device if turned on"
  }

  return <>
    <FilterMenu
      filter={filter}
      setFilter={setFilter}
      runners={runners}
      anchorEl={anchorEl}
      setAnchorEl={setAnchorEl}
      setFilterChanged={setFilterChanged}
    />

    <StyledTooltip title={getTooltipText()} enterDelay={800}>
      <div
        ref={ref}
        onMouseUp={() => { setAnchorEl(ref.current) }}
        onMouseOver={() => { setHovered(true)}}
        onMouseLeave={() => { setHovered(false)}}

        style={{
          position: 'relative',
          height: '25px',
          width: '25px',
          display: 'grid',
          alignContent: 'center',
          justifyContent: 'center',
          borderRadius: '5px',
          cursor: 'pointer',
          ...getStyle(),
          ...props.style
        }}
      >
        <div style={{
          position: 'absolute',
          left: '-1',
          top: '-1',
          width: '25px',
          height: '25px',
          borderRadius: '5px',
          backgroundColor: hovered ? 'rgba(255, 255, 255, 0.08)' : ''}} />
        <PhoneIphoneIcon style={{height: '21px', width: '22px'}}/>
      </div>
    </StyledTooltip>
    </>
}


function FilterMenu({filter, setFilter, runners, anchorEl, setAnchorEl, setFilterChanged, ...props}) {
  const menuOpen = Boolean(anchorEl);
  const closeMenu = () => {
    setAnchorEl(null)
  }

  return <Menu
    anchorEl={anchorEl}
    open={menuOpen}
    onClose={closeMenu}
  >
    <div style={{display: 'grid', padding: '5px 15px'}}>
      {
        runners.map((runner, index) => {
          return <div key={index} style={{marginTop: index > 0 && '14px'}}>
            <div style={{display: 'flex', alignItems: 'center'}}>
              <ComputerIcon />
              <label style={{marginLeft: '4px'}}>{runner.name}</label>
            </div>
            <div style={{display: 'grid'}}>
              {
                (runner.simulators || []).map((simulator, index) => {
                  return <CustomMenuItem
                    key={index}
                    simulator={simulator}
                    filter={filter}
                    setFilter={setFilter}
                    setFilterChanged={setFilterChanged}
                  />
                })
              }
            </div>
          </div>
        })
      }
    </div>
  </Menu>
}

function CustomMenuItem({simulator, filter, setFilter, setFilterChanged, ...props}) {
  const [hovered, setHovered] = useState(false)

  const filterBySimulator = () => {
    if (filter.deviceId === simulator) {
      setFilter({ ...filter, deviceId: null })
    } else {
      setFilter({ ...filter, deviceId: simulator })
    }
    setFilterChanged(true)
  }

  const getStyle = () => {
    if (!filter.deviceId) {
      return {
        opacity: '0.7'
      }
    } else if (filter.deviceId === simulator) {
      return {
        opacity: '1'
      }
    } else return {
      opacity: '0.4'
    }
  }

  return <div
    style={{
      padding: '5px 10px',
      display: 'flex',
      alignItems: 'center',
      backgroundColor: hovered && 'rgba(255, 255, 255, 0.05)',
      ...getStyle(),
      ...props.style
    }}
    onMouseOver={() => { setHovered(true)}}
    onMouseLeave={() => { setHovered(false)}}
    onClick={filterBySimulator}
  >
      <PhoneIphoneIcon />
      <label>{simulator}</label>
  </div>
}