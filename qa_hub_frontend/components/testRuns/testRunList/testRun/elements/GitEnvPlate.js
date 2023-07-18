import ForkLeftIcon from "@mui/icons-material/ForkLeft";
import TextWithLabel from "../../../../primitives/TextWithLabel";
import CommitIcon from "@mui/icons-material/Commit";
import PublicIcon from "@mui/icons-material/Public";

export default function GitEnvPlate({testRun, ...props}) {
  return <div style={{display: "flex", ...props.style}}>
    <div style={{display: "flex", alignItems: "center"}}>
      <ForkLeftIcon></ForkLeftIcon>
      <TextWithLabel
        value={testRun.config.branch}
        label={'Branch'}
        labelStyle={{ justifySelf: 'center'}}
        style={{minWidth: "70px", width: "max-content", padding: "5px 6px", minHeight: 'unset', justifyItems: 'center'}}
      />
    </div>

    <div style={{display: "flex", alignItems: "center", marginLeft: "15px"}}>
      <CommitIcon style={{transform: 'rotate(90deg)'}}></CommitIcon>
      <TextWithLabel
        value={testRun.config.commit}
        label={'Commit'}
        labelStyle={{ justifySelf: 'center'}}
        style={{minWidth: "70px", width: "min-content", padding: "5px 6px", minHeight: 'unset',  justifyItems: 'center' }}
      />
    </div>

    <div style={{display: "flex", alignItems: "center", marginLeft: "20px"}}>
      <PublicIcon></PublicIcon>
      <TextWithLabel
        value={testRun.config.environment}
        label={'Environment'}
        labelStyle={{ justifySelf: 'center'}}
        style={{minWidth: "96px", width: "min-content", padding: "5px 6px", minHeight: 'unset', marginLeft: '4px', display: 'grid', justifyItems: 'center'}}
      />
    </div>
  </div>
}