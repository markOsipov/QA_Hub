import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import {Accordion, AccordionDetails, Card, ListItemIcon, ListItemText, Menu, MenuItem} from "@mui/material";
import {useState} from "react";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {deleteProject} from "../../../requests/ProjectRequests";
import projectState from "../../../state/ProjectState";
import EditProjectModal from "./EditProjectModal";
import TextWithLabel from "../../primitives/TextWithLabel";
import StyledAccordionSummary from "../../primitives/StyledAccordeonSummary";
import {customTheme} from "../../../styles/CustomTheme";

export default function ProjectCard({project, ...props}) {
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [showMoreButton, setShowMoreButton] = useState(false)
    const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);

    const menuOpen = Boolean(menuAnchor);

    const handleOpenMenu = (event) => {
        setMenuAnchor(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setMenuAnchor(null);
    };

    const handleDeleteProject = () => {
        deleteProject(project.name).then(() => {
            projectState.updateProjects()
        })
    }

    const handleEditProject = () => {
        setIsEditProjectModalOpen(true)
        handleCloseMenu();
    }

    return <Card style={{padding: "15px", width: "450px", margin: "15px", backgroundColor: "rgba(255, 255, 255, 0.05)", position: "relative"}} elevation={5}  {...props}
        onMouseOver={() => {setShowMoreButton(true)}}
        onMouseLeave={() => {setShowMoreButton(false)}}
    >
        {
            showMoreButton && (
                <IconButton style={{padding: "0", position: "absolute", right: "15px", top: "18px"}}
                            onClick={handleOpenMenu}
                >
                    <MoreHorizIcon fontSize="medium" style={{color: "white"}}/>
                </IconButton>
            )
        }
        <EditProjectModal isOpen={isEditProjectModalOpen} setIsOpen={setIsEditProjectModalOpen} project={project}/>
        <div style={{display: "flex", marginBottom: "10px"}}>
            <Typography variant="h6" style={{minWidth: "max-content"}}>{project.name}</Typography>
            <div style={{width: "100%", flexGrow: "2"}}></div>
            <Menu
                anchorEl={menuAnchor}
                open={menuOpen}
                onClose={handleCloseMenu}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={handleEditProject}>
                    <ListItemIcon>
                        <EditIcon fontSize="small" style={{color: "var(--primary-text-color)"}}/>
                    </ListItemIcon>
                    <ListItemText>Edit</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleDeleteProject}>
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" style={{color: "var(--primary-text-color)"}}/>
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                </MenuItem>
            </Menu>
        </div>

        <TextWithLabel label={'Platform'} value={project.platform} style={{margin: '15px 0 15px 0'}}></TextWithLabel>
        {
            project.cicd &&
            <Accordion style={{backgroundColor: "unset", border: `1px solid ${customTheme.palette.text.disabled}`, borderRadius: '4px'}}>
                <StyledAccordionSummary>
                    <Typography>CICD</Typography>
                </StyledAccordionSummary>
                <AccordionDetails>
                    <TextWithLabel label={'Type'} value={project.cicd.type} style={{marginTop: '10px'}}></TextWithLabel>
                    <TextWithLabel label={'Project'} value={project.cicd.project} style={{marginTop: '20px'}}></TextWithLabel>
                    <TextWithLabel label={'Path'} value={project.cicdPath} style={{marginTop: '20px'}}></TextWithLabel>
                </AccordionDetails>
            </Accordion>
        }

        {
          project.tms &&
          <Accordion style={{backgroundColor: "unset", border: `1px solid ${customTheme.palette.text.disabled}`, borderRadius: '4px', marginTop: '15px'}}>
              <StyledAccordionSummary>
                  <Typography>TMS</Typography>
              </StyledAccordionSummary>
              <AccordionDetails>
                  <TextWithLabel label={'Type'} value={project.tms.type} style={{marginTop: '10px'}}></TextWithLabel>
                  <TextWithLabel label={'Project'} value={project.tms.project} style={{marginTop: '20px'}}></TextWithLabel>
              </AccordionDetails>
          </Accordion>
        }

        {
          project.taskTracker &&
          <Accordion style={{backgroundColor: "unset", border: `1px solid ${customTheme.palette.text.disabled}`, borderRadius: '4px', marginTop: '15px'}}>
              <StyledAccordionSummary>
                  <Typography>Task tracker</Typography>
              </StyledAccordionSummary>
              <AccordionDetails>
                  <TextWithLabel label={'Type'} value={project.taskTracker.type}></TextWithLabel>
              </AccordionDetails>
          </Accordion>
        }

    </Card>
}