import {observer} from "mobx-react-lite";
import {Accordion, AccordionDetails, FormControl, InputLabel, MenuItem} from "@mui/material";
import StyledAccordionSummary from "../../../primitives/StyledAccordeonSummary";
import Typography from "@mui/material/Typography";
import StyledSelect from "../../../primitives/StyledSelect";
import integrationsState from "../../../../state/integrations/IntegrationsState";
import StyledTextField from "../../../primitives/StyledTextField";
import {customTheme} from "../../../../styles/CustomTheme";

const ProjectTMSForm = observer(({project, setProject, ...props}) => {
  return  <Accordion
    style={{
      backgroundColor: "unset",
      border: `1px solid ${customTheme.palette.text.disabled}`,
      borderRadius: '4px',
      ...props.style
    }}
  >
    <StyledAccordionSummary>
      <Typography>TMS</Typography>
    </StyledAccordionSummary>
    <AccordionDetails style={{display: 'grid'}}>
      <FormControl sx={{margin: "8px" }} size="small">
        <InputLabel style={{ color: customTheme.palette.text.faded }}>Type</InputLabel>
        <StyledSelect
          value={project.tms?.type || ""}
          label="Platform"
          onChange={(event) => {
            setProject({
              ...project,
              tms: {
                ...project.tms || {},
                type: event.target.value || ""
              }
            })
          }}
        >
          {
            integrationsState.tmsIntegrations.map((integration) =>
              <MenuItem key={integration.tmsType} value={integration.tmsType}>{integration.tmsType}</MenuItem>
            )
          }
        </StyledSelect>
      </FormControl>

      <StyledTextField value={project.tms?.project || ""}
                       size="small"
                       label="Project"
                       style={{color: "white", margin: "8px"}}
                       autoComplete='off'
                       onChange={(event) => {
                         setProject({
                           ...project,
                           tms: {
                             ...project.tms || {},
                             project: event.target.value || ""
                           }
                         })
                       }}
      />
    </AccordionDetails>
  </Accordion>
})

export default ProjectTMSForm