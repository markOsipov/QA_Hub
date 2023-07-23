import ComputerIcon from "@mui/icons-material/Computer";
import TextWithLabel from "../../../../primitives/TextWithLabel";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import SyncIcon from "@mui/icons-material/Sync";

export default function RunnersPlate({ testRun, ...props}) {
  return <div style={{display: "flex", ...props.style}}>
    { testRun.runners.length > 0 &&
      <div style={{display: "flex", alignItems: "center"}}>
        <ComputerIcon style={{fontSize: '20px'}}></ComputerIcon>
        <TextWithLabel
          value={testRun.runners.length}
          label={'Runners'}
          labelStyle={{ justifySelf: 'center'}}
          style={{...itemStyle}}
        />
      </div>
    }

    { testRun.config?.parallelThreads != null &&
      <div style={{display: "flex", alignItems: "center", marginLeft: "10px"}}>
        <PhoneIphoneIcon style={{fontSize: '20px'}}></PhoneIphoneIcon>
        <TextWithLabel
          value={testRun.config.parallelThreads}
          label={'Devices'}
          labelStyle={{ justifySelf: 'center'}}
          style={{...itemStyle}}
        />
      </div>
    }

    { testRun.config?.retries != null &&
      <div style={{display: "flex", alignItems: "center", marginLeft: "6px"}}>
        <SyncIcon style={{transform: 'scaleX(-1)', fontSize: '20px'}}></SyncIcon>
        <TextWithLabel
          value={testRun.config.retries}
          label={'Retries'}
          labelStyle={{ justifySelf: 'center'}}
          style={{...itemStyle}}
        />
      </div>
    }
  </div>
}

const itemStyle = {
  minWidth: "70px",
  width: "min-content",
  padding: "5px 7px 1px 7px",
  marginLeft: '4px',
  minHeight: 'unset',
  display: 'grid',
  justifyItems: 'center',
  fontSize: '12px'
}