
import ForkLeftIcon from "@mui/icons-material/ForkLeft";
import CommitIcon from "@mui/icons-material/Commit";
import PublicIcon from "@mui/icons-material/Public";
import ComputerIcon from "@mui/icons-material/Computer";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import SyncIcon from "@mui/icons-material/Sync";
import {customTheme} from "../../../../../styles/CustomTheme";
import StyledTooltip from "../../../../primitives/StyledTooltip";
import {useEffect, useState} from "react";

export default function TestRunConfigFilterable({testRun, filter, setFilter, filterAndLoad, ...props}) {
  const marginBottom = '14px'
  const iconWidth = '20px'

  const [lastSearchFilter, setLastSearchFilter] = useState(filter)
  useEffect(() => {
    setLastSearchFilter(filter)
  }, [testRun])

  const filterByClick = (fieldName) => {
    const alreadyFiltered = filter[fieldName] === testRun.config[fieldName]
    const newFilterValue = {
      ...filter,
      [fieldName]: alreadyFiltered ? null : testRun.config[fieldName]
    }
    setFilter(newFilterValue)
    filterAndLoad(newFilterValue)
  }

  return <div style={{display: 'flex', flexDirection: 'column', height: 'min-content', opacity: '0.8', ...props.style}}>

    <div style={{display: 'flex', marginBottom: marginBottom}}>
      <StyledTooltip title={'Commit'} placement="bottom-end" arrow>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0 6px 0 4px',
            border: (lastSearchFilter.commit === testRun.config.commit) && `1px solid ${customTheme.palette.text.primary}`,
            backgroundColor: (lastSearchFilter.commit === testRun.config.commit) && `black`,
            borderRadius: '3px',
            cursor: 'pointer',
          }}
          onClick={() => {filterByClick("commit")}}
        >
          <CommitIcon style={{ cursor: 'pointer'}}></CommitIcon>
          <label style={{marginLeft: '2px',  cursor: 'pointer'}}>{testRun.config.commit}</label>
        </div>
      </StyledTooltip>

      <StyledTooltip title={'Branch'} placement="bottom-end" arrow>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginLeft: '4px',
            padding: '0 6px 0 2px',
            border: (lastSearchFilter.branch === testRun.config.branch) && `1px solid ${customTheme.palette.text.primary}`,
            backgroundColor: (lastSearchFilter.branch === testRun.config.branch) && `black`,
            borderRadius: '3px',
            cursor: 'pointer'
          }}
          onClick={() => {filterByClick("branch")}}
        >
          <ForkLeftIcon style={{ cursor: 'pointer'}}/>
          <label style={{marginLeft: '2px', cursor: 'pointer'}}>{testRun.config.branch}</label>
        </div>
      </StyledTooltip>
    </div>

    <div style={{display: 'flex', marginBottom: marginBottom, paddingLeft: '6px'}}>
      <StyledTooltip title={'Active runners'} placement="bottom-end" arrow>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <ComputerIcon style={{minWidth: iconWidth}} />
          <label style={{marginLeft: '5px'}}>{testRun.runners.length}</label>
        </div>
      </StyledTooltip>

      <StyledTooltip title={'Parallel devices'} placement="bottom-end" arrow>
        <div style={{display: 'flex', alignItems: 'center', marginLeft: '12px'}}>
          <PhoneIphoneIcon style={{minWidth: iconWidth}}/>
          <label style={{marginLeft: '5px'}}>{testRun.config.parallelThreads}</label>
        </div>
      </StyledTooltip>

      <StyledTooltip title={'Retries'} placement="bottom-end" arrow>
        <div style={{display: 'flex', alignItems: 'center', marginLeft: '12px'}}>
          <SyncIcon style={{transform: 'scaleX(-1)', minWidth: iconWidth}} />
          <label style={{marginLeft: '5px'}}>{testRun.config.retries}</label>
        </div>
      </StyledTooltip>
    </div>

    <div style={{width: "min-content"}}>
      <StyledTooltip title={'Environment'} placement="bottom-end" arrow>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: marginBottom,
            padding: '0 10px 0 6px',
            border: (lastSearchFilter.environment === testRun.config.environment) && `1px solid ${customTheme.palette.text.primary}`,
            backgroundColor: (lastSearchFilter.environment === testRun.config.environment) && `black`,
            borderRadius: '3px',
            cursor: 'pointer'
          }}
          onClick={() => {filterByClick("environment")}}
        >
          <PublicIcon style={{ cursor: 'pointer'}}/>
          <label style={{marginLeft: '7px', cursor: 'pointer'}}
          >{testRun.config.environment}</label>
        </div>
      </StyledTooltip>
    </div>
  </div>
}