import ForkLeftIcon from "@mui/icons-material/ForkLeft";
import TextWithLabel from "../../../../primitives/TextWithLabel";
import CommitIcon from "@mui/icons-material/Commit";
import PublicIcon from "@mui/icons-material/Public";

export default function GitEnvPlate({testRun, filter, filterAndLoad, ...props}) {
  const getOpacity = (fieldName) => {
    const opacityDefault = '0.6'
    const opacityFiltered = '1.0'

    return filter[fieldName] === testRun.config[fieldName] ? opacityFiltered :
      opacityDefault
  }
  const filterByFieldName = (fieldName) => {
    const fieldFilter = filter[fieldName]

    let newFieldValue = null
    if (fieldFilter !== testRun.config[fieldName]) {
      newFieldValue = testRun.config[fieldName]
    }

    const newFilterValue = {
      ...filter,
      [fieldName]: newFieldValue
    }

    filterAndLoad(newFilterValue)
  }


  return <div style={{display: "flex", ...props.style}}>
    { testRun.config?.branch != null &&
      <div
        style={{
          display: "flex",
          alignItems: "center",
          opacity: getOpacity('branch'),
          cursor: 'pointer'
        }}
      >
        <ForkLeftIcon/>
        <TextWithLabel
          value={testRun.config.branch}
          label={'Branch'}
          labelStyle={{ justifySelf: 'center', cursor: 'pointer'}}
          valueStyle={{cursor: 'pointer'}}
          style={{...itemStyle}}
          onClick={() => { filterByFieldName("branch") }}
        />
      </div>
    }
    { testRun.config?.commit != null &&
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginLeft: "5px",
          opacity: getOpacity('commit'),
          cursor: 'pointer'
        }}
      >
        <CommitIcon style={{transform: 'rotate(90deg)'}} />
        <TextWithLabel
          value={testRun.config.commit}
          label={'Commit'}
          labelStyle={{ justifySelf: 'center', cursor: 'pointer'}}
          valueStyle={{cursor: 'pointer'}}
          style={{...itemStyle}}
          onClick={() => { filterByFieldName("commit") }}
        />
      </div>
    }

    { testRun.config?.environment != null &&
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginLeft: "10px",
          opacity: getOpacity('environment'),
          cursor: 'pointer'
        }}
      >
        <PublicIcon/>
        <TextWithLabel
          value={testRun.config.environment}
          label={'Environment'}
          labelStyle={{ justifySelf: 'center', cursor: 'pointer'}}
          valueStyle={{cursor: 'pointer'}}
          style={{...itemStyle, marginLeft: '5px'}}
          onClick={() => { filterByFieldName("environment") }}
        />
      </div>
    }
  </div>
}

const itemStyle = {
  minWidth: "70px",
  width: "max-content",
  padding: "5px 6px",
  minHeight: 'unset',
  justifyItems: 'center',
  fontSize: '13px'
}