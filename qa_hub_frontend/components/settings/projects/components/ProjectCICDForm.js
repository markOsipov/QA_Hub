import {observer} from "mobx-react-lite";
import {Accordion, AccordionDetails, FormControl, InputLabel, MenuItem} from "@mui/material";
import StyledAccordionSummary from "../../../primitives/StyledAccordeonSummary";
import Typography from "@mui/material/Typography";
import StyledSelect from "../../../primitives/StyledSelect";
import integrationsState from "../../../../state/IntegrationsState";
import StyledTextField from "../../../primitives/StyledTextField";
import {customTheme} from "../../../../styles/CustomTheme";

const ProjectCICDForm = observer(({project, setProject, ...props}) => {
  return <Accordion
    style={{
      backgroundColor: "unset",
      border: `1px solid ${customTheme.palette.text.disabled}`,
      borderRadius: '4px',
      ...props.style
    }}
  >
    <StyledAccordionSummary>
      <Typography>CICD</Typography>
    </StyledAccordionSummary>
    <AccordionDetails style={{display: 'grid'}}>
      <FormControl style={{margin: "8px"}} size="small">
        <InputLabel style={{ color: "var(--faded-text-color)" }}>Type</InputLabel>
        <StyledSelect
          value={project.cicd?.type || ""}
          label="Type"
          onChange={(event) => {
            setProject({
              ...project,
              cicd: {
                ...project.cicd || {},
                type: event.target.value || ""
              }
            })
          }}
        >
          {
            integrationsState.cicdIntegrations.map((integration) =>
              <MenuItem key={integration.cicdType} value={integration.cicdType}>{integration.cicdType}</MenuItem>
            )
          }
        </StyledSelect>
      </FormControl>
      <StyledTextField value={project.cicd?.project || ""}
                       size="small"
                       label="Project"
                       style={{color: "white", margin: "8px"}}
                       autoComplete='off'
                       onChange={(event) => {
                         setProject({
                           ...project,
                           cicd: {
                             ...project.cicd || {},
                             project: event.target.value || ""
                           }
                         })
                       }}
      />
      <StyledTextField value={project.cicd?.path || ""}
                       size="small"
                       label="Path"
                       style={{color: "white", margin: "8px"}}
                       autoComplete='off'
                       onChange={(event) => {
                         setProject({
                           ...project,
                           cicd: {
                             ...project.cicd || {},
                             path: event.target.value || ""
                           }
                         })
                       }}
      />
      <StyledTextField value={project.cicd?.jobId || ""}
                       size="small"
                       label="Path"
                       style={{color: "white", margin: "8px"}}
                       autoComplete='off'
                       onChange={(event) => {
                         setProject({
                           ...project,
                           cicd: {
                             ...project.cicd || {},
                             jobId: event.target.value || ""
                           }
                         })
                       }}
      />
    </AccordionDetails>
  </Accordion>
})

export default ProjectCICDForm