import ForkLeftIcon from "@mui/icons-material/ForkLeft";
import TextWithLabel from "../../../../primitives/TextWithLabel";
import CommitIcon from "@mui/icons-material/Commit";
import PublicIcon from "@mui/icons-material/Public";

export default function GitEnvPlate({testRun, ...props}) {
  return <div style={{display: "flex", ...props.style}}>
    { testRun.config?.branch != null &&
      <div style={{display: "flex", alignItems: "center"}}>
        <ForkLeftIcon/>
        <TextWithLabel
          value={testRun.config.branch}
          label={'Branch'}
          labelStyle={{ justifySelf: 'center'}}
          style={{...itemStyle}}
        />
      </div>
    }
    { testRun.config?.commit != null &&
      <div style={{display: "flex", alignItems: "center", marginLeft: "5px"}}>
        <CommitIcon style={{transform: 'rotate(90deg)'}}></CommitIcon>
        <TextWithLabel
          value={testRun.config.commit}
          label={'Commit'}
          labelStyle={{ justifySelf: 'center'}}
          style={{...itemStyle}}
        />
      </div>
    }

    { testRun.config?.environment != null &&
      <div style={{display: "flex", alignItems: "center", marginLeft: "10px"}}>
        <PublicIcon/>
        <TextWithLabel
          value={testRun.config.environment}
          label={'Environment'}
          labelStyle={{ justifySelf: 'center'}}
          style={{...itemStyle, marginLeft: '5px'}}
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