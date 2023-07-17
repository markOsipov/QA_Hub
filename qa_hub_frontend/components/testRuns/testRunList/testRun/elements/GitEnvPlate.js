import ForkLeftIcon from "@mui/icons-material/ForkLeft";
import TextWithLabel from "../../../../primitives/TextWithLabel";
import CommitIcon from "@mui/icons-material/Commit";
import PublicIcon from "@mui/icons-material/Public";

export default function GitEnvPlate({testRun, ...props}) {
  return <div style={{display: "flex", ...props.style}}>
    <div style={{display: "flex", alignItems: "center"}}>
      <ForkLeftIcon></ForkLeftIcon>
      <TextWithLabel
        value={testRun.branch}
        label={'Branch'}
        style={{minWidth: "70px", width: "max-content", padding: "5px 6px", minHeight: 'unset', }}
      />
    </div>

    <div style={{display: "flex", alignItems: "center", marginLeft: "12px"}}>
      <CommitIcon style={{transform: 'rotate(90deg)'}}></CommitIcon>
      <TextWithLabel
        value={testRun.commit}
        label={'Commit'}
        style={{minWidth: "70px", width: "min-content", padding: "5px 6px", minHeight: 'unset', }}
      />
    </div>

    <div style={{display: "flex", alignItems: "center", marginLeft: "12px"}}>
      <PublicIcon></PublicIcon>
      <TextWithLabel
        value={testRun.environment}
        label={'Environment'}
        style={{minWidth: "96px", width: "min-content", padding: "5px 6px", minHeight: 'unset', marginLeft: '4px', display: 'grid', justifyItems: 'center'}}
      />
    </div>
  </div>
}