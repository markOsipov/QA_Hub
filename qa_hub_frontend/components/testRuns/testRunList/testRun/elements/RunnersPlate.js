import ComputerIcon from "@mui/icons-material/Computer";
import TextWithLabel from "../../../../primitives/TextWithLabel";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import SyncIcon from "@mui/icons-material/Sync";

export default function RunnersPlate({ testRun, ...props}) {
  return <div style={{display: "flex", ...props.style}}>
    { testRun.runners.length > 0 &&
      <div style={{display: "flex", alignItems: "center"}}>
        <ComputerIcon></ComputerIcon>
        <TextWithLabel
          value={testRun.runners.length}
          label={'Runners'}
          style={{minWidth: "70px", width: "min-content", padding: "5px 6px", minHeight: 'unset', marginLeft: '4px', display: 'grid', justifyItems: 'center'}}
        />
      </div>
    }

    { testRun.parallelThreads != null &&
      <div style={{display: "flex", alignItems: "center", marginLeft: "14px"}}>
        <PhoneIphoneIcon></PhoneIphoneIcon>
        <TextWithLabel
          value={testRun.parallelThreads}
          label={'Devices'}
          style={{minWidth: "70px", width: "min-content", padding: "5px 6px", minHeight: 'unset', marginLeft: '4px', display: 'grid', justifyItems: 'center'}}
        />
      </div>
    }

    { testRun.retries != null &&
      <div style={{display: "flex", alignItems: "center", marginLeft: "10px"}}>
        <SyncIcon style={{transform: 'scaleX(-1)'}}></SyncIcon>
        <TextWithLabel
          value={testRun.retries}
          label={'Retries'}
          style={{minWidth: "70px", width: "min-content", padding: "5px 6px", minHeight: 'unset', marginLeft: '4px', display: 'grid', justifyItems: 'center'}}
        />
      </div>
    }
  </div>
}