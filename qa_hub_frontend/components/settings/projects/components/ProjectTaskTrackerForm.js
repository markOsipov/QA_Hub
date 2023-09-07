import {observer} from "mobx-react-lite";
import {Accordion, AccordionDetails, FormControl, InputLabel, MenuItem} from "@mui/material";
import StyledAccordionSummary from "../../../primitives/StyledAccordeonSummary";
import Typography from "@mui/material/Typography";
import StyledSelect from "../../../primitives/StyledSelect";
import integrationsState from "../../../../state/integrations/IntegrationsState";
import {customTheme} from "../../../../styles/CustomTheme";

const ProjectTaskTrackerForm = observer(({project, setProject, ...props}) => {
  return  <Accordion
    style={{
      backgroundColor: "unset",
      border: `1px solid ${customTheme.palette.text.disabled}`,
      borderRadius: '4px',
      ...props.style
    }}
  >
    <StyledAccordionSummary>
      <Typography>Task tracker</Typography>
    </StyledAccordionSummary>
    <AccordionDetails style={{display: 'grid'}}>
      <FormControl sx={{ margin: "8px" }} size="small">
        <InputLabel style={{ color: customTheme.palette.text.faded }}>Type</InputLabel>
        <StyledSelect
          value={project.taskTracker?.type || ""}
          label="Task tracker"
          onChange={(event) => {
            setProject({
              ...project,
              taskTracker: {
                ...project.taskTracker || {},
                type: event.target.value || ""
              }
            })
          }}
        >
          {
            integrationsState.taskTrackerIntegrations.map((integration) =>
              <MenuItem key={integration.type} value={integration.type}>{integration.type}</MenuItem>
            )
          }
        </StyledSelect>
      </FormControl>
    </AccordionDetails>
  </Accordion>
})

export default ProjectTaskTrackerForm