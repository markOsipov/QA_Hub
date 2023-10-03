import {observer} from "mobx-react-lite";
import {Accordion, AccordionDetails, Card, FormControl, InputLabel, MenuItem} from "@mui/material";
import StyledAccordionSummary from "../../../primitives/StyledAccordeonSummary";
import Typography from "@mui/material/Typography";
import StyledSelect from "../../../primitives/StyledSelect";
import {customTheme} from "../../../../styles/CustomTheme";
import {useEffect, useState} from "react";
import Button from "@mui/material/Button";
import StyledTextField from "../../../primitives/StyledTextField";
import IconButton from "@mui/material/IconButton";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";

const ProjectOtherIntsForm = observer(({project, setProject, ...props}) => {
  const emptyIntegration = {
    type: "",
    project: project.name,
    intInfo: {},
    projectFields: [],
    sharedFields: []
  }
  const integrations = project.otherInts.active

  useEffect(() => {
    setProject(
      {
        ...project,
        otherInts: {
          all: project.otherInts.all,
          active: integrations
        }
      }
    )
  }, [integrations])

  const handleAddIntegration = () => {
    setProject(
      {
        ...project,
        otherInts: {
          all: project.otherInts.all,
          active: [...integrations, emptyIntegration]
        }
      }
    )
  }

  const setIntegration = (index, integration) => {
    let newProject = { ...project }

    newProject.otherInts.active[index] = integration
    setProject(newProject)
  }

  const removeIntegration = (index) => {
    let newProject = { ...project }
    newProject.otherInts.active.splice(index, 1)

    console.log( JSON.stringify(newProject.otherInts.active))
    setProject(newProject)
  }

  return <Accordion
    style={{
      backgroundColor: "unset",
      border: `1px solid ${customTheme.palette.text.disabled}`,
      borderRadius: '4px',
      ...props.style
    }}
  >
    <StyledAccordionSummary>
      <Typography>Other</Typography>
    </StyledAccordionSummary>

    <AccordionDetails style={{display: 'grid'}}>
      {
        project.otherInts.active.map((activeInt, index ) => {
          return <OtherIntCard
            key={index}
            index={index}
            integration={activeInt}
            project={project}
            setIntegration={setIntegration}
            removeIntegration={removeIntegration}
            emptyIntegration={emptyIntegration}
            style={{marginBottom: "10px"}}
          />
        })
      }
      {
        project.otherInts.active.length < project.otherInts.all.length && project.otherInts.active.find(el => el.type === emptyIntegration.type) == null || true &&

        <div style={{display: 'flex'}}>
          <Button variant="contained"
            color="error"
            size="small"
            onClick={handleAddIntegration}
            style={{height: 'min-content'}}
                  startIcon={<AddIcon style={{position: 'relative', top: "-1px"}} />}
          >Add</Button>
        </div>
      }

    </AccordionDetails>
  </Accordion>
})

const OtherIntCard = ({index, integration, project, setIntegration, emptyIntegration, removeIntegration, ...props}) => {
  const changeIntType = (integrationType) => {
    const integration = project.otherInts.all.find(el => {return el.type === integrationType})
    if (integration) {
      console.log("FOUND")
      setIntegration(index, {
        ...emptyIntegration,
        ...integration
      })
    } else {
      console.log("NOT FOUND")
      setIntegration(index, {
        ...emptyIntegration
      })
    }
  }

  const setIntegrationField = (field, value) => {
    let intInfo = {...integration.intInfo}
    intInfo[field] = value

    setIntegration(index, {
      ...integration,
      intInfo: intInfo
    })
  }


  return <Card style={{padding: '10px 15px', backgroundColor: 'rgba(255, 255, 255, 0.03)', display: 'flex', flexDirection: 'column', ...props.style}}>
    <div style={{display: 'flex', alignItems: 'center'}}>
      <Typography variant={'h6'} style={{marginBottom: '5px'}}>{integration.type || "New integration"}</Typography>
      <div style={{flexGrow: '1.1'}}></div>
      <IconButton style={{
        backgroundColor: customTheme.palette.error.main,
        width: "23px", height: "23px",
        borderRadius: "6px",
        marginLeft: "13px",
        top: "-2px"
      }}
        onClick={()=> {removeIntegration(index)}}
      >
        <DeleteIcon style={{fontSize: "21px"}}/>
      </IconButton>

    </div>

    <FormControl sx={{ margin: "8px" }} size="small">
      <InputLabel style={{ color: customTheme.palette.text.faded }}>Type</InputLabel>
      <StyledSelect
        value={integration.type}
        label="Task tracker"
        onChange={(event) => {
          changeIntType(event.target.value)
        }}
      >
        {
          project.otherInts.all.map((integration) =>
            <MenuItem key={integration.type} value={integration.type}>{integration.type}</MenuItem>
          )
        }
        <MenuItem value={""}>---</MenuItem>
      </StyledSelect>
    </FormControl>
    {
      (integration.projectFields || []).map((field, index) => {
        return <StyledTextField key={index} value={integration.intInfo[field] ?? ""}
                         size="small"
                         label={field}
                         style={{color: "white", margin: "8px"}}
                         autoComplete='off'
                         onChange={(event) => {
                           setIntegrationField(field, event.target.value)
                         }}
        />
      })
    }
  </Card>
}

export default ProjectOtherIntsForm