import {customTheme} from "../../../../../styles/CustomTheme";
import StyledTooltip from "../../../../primitives/StyledTooltip";
import {createRef, useState} from "react";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import {Menu, MenuItem} from "@mui/material";
import ComputerIcon from "@mui/icons-material/Computer";
import testResultsFilterState from "../../../../../state/testResults/TestResultsFilterState";
import {observer} from "mobx-react-lite";

const DeviceFilter = observer(({runners, ...props}) => {
  const {filter} = testResultsFilterState

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
    if (!filter.deviceId && !filter.runner) {
      return turnedOffStyle
    } else return turnedOnStyle
  }

  const getTooltipText = () => {
    if (filter.deviceId) {
      return `Only tests executed on the next DEVICE are shown: ${filter.deviceId}`
    } else if (filter.runner) {
      return `Only tests executed on the next RUNNER are shown: ${filter.runner}`
    }
      return "Shows only tests executed on certain device or runner if turned on"
  }

  return <>
    <FilterMenu
      runners={runners}
      anchorEl={anchorEl}
      setAnchorEl={setAnchorEl}
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
        {
          filter.runner &&
          <ComputerIcon style={{height: '21px', width: '22px'}}/>
        }
        {
          !filter.runner &&
          <PhoneIphoneIcon style={{height: '21px', width: '22px'}}/>
        }
      </div>
    </StyledTooltip>
    </>
})


const FilterMenu = observer(({ runners, anchorEl, setAnchorEl, ...props}) => {
  const {filter, setFilter, setFilterChanged } = testResultsFilterState

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
          return <RunnerMenuItem
            key={index}
            runner={runner}
            anchorEl={anchorEl}
            setAnchorEl={setAnchorEl}
            style={{marginTop: index > 0 && '14px'}}
          />
        })
      }
    </div>
  </Menu>
})

const RunnerMenuItem = observer(({runner, anchorEl, setAnchorEl, ...props})  => {
  const {filter} = testResultsFilterState
  const [hovered, setHovered] = useState(false)

  const getStyle = () => {
    if (!filter.runner && !filter.deviceId) {
      return {
        opacity: '0.7'
      }
    } else if (filter.runner === runner.name || runner.simulators.includes(filter.deviceId)) {
      return {
        opacity: '1'
      }
    } else return {
      opacity: '0.4'
    }
  }
  const filterByRunner = () => {
    if (filter.runner === runner.name) {
      testResultsFilterState.setFilter({ ...filter, deviceId: null, runner: null })
    } else {
      testResultsFilterState.setFilter({ ...filter, deviceId: null, runner: runner.name })
    }
    testResultsFilterState.setFilterChanged(true)
  }

  return <div style={{...props.style}}>
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: hovered && 'rgba(255, 255, 255, 0.05)',
        padding: '5px 10px',
        ...getStyle(),
      }}
      onMouseOver={() => { setHovered(true)}}
      onMouseLeave={() => { setHovered(false)}}
      onClick={filterByRunner}
    >
      <ComputerIcon />
      <label style={{marginLeft: '4px'}}>{runner.name}</label>
    </div>
    <div style={{display: 'grid'}}>
      {
        (runner.simulators || []).map((simulator, index) => {
          return <SimulatorMenuItem
            key={index}
            simulator={simulator}
            runner={runner}
            style={{marginLeft: '18px'}}
          />
        })
      }
    </div>
  </div>
})

const SimulatorMenuItem = observer(({runner, simulator, ...props}) => {
  const {filter } = testResultsFilterState
  const [hovered, setHovered] = useState(false)

  const filterBySimulator = () => {
    if (filter.deviceId === simulator) {
      testResultsFilterState.setFilter({ ...filter, deviceId: null, runner: null })
    } else {
      testResultsFilterState.setFilter({ ...filter, deviceId: simulator, runner: null })
    }
    testResultsFilterState.setFilterChanged(true)
  }

  const getStyle = () => {
    if (!filter.deviceId && !filter.runner) {
      return {
        opacity: '0.7'
      }
    } else if (filter.deviceId === simulator || filter.runner === runner.name) {
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
})
export default DeviceFilter