import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import {Card, ListItemIcon, ListItemText, Menu, MenuItem} from "@mui/material";
import {useState} from "react";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {deleteProject, updateProject} from "../../../requests/QAHubBackend";
import projectState from "../../../state/ProjectState";
import NewProjectModal from "./NewProjectModal";
import EditProjectModal from "./EditProjectModal";

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

    return <Card style={{padding: "15px", width: "300px", margin: "15px", backgroundColor: "rgba(255, 255, 255, 0.05)"}} elevation={5}  {...props}
        onMouseOver={() => {setShowMoreButton(true)}}
        onMouseLeave={() => {setShowMoreButton(false)}}
    >
        <EditProjectModal isOpen={isEditProjectModalOpen} setIsOpen={setIsEditProjectModalOpen} project={project}/>
        <div style={{display: "flex", marginBottom: "10px"}}>
            <Typography variant="h6">{project.name}</Typography>
            <div style={{width: "100%", flexGrow: "2"}}></div>
            {
                showMoreButton && (
                    <IconButton style={{padding: "0"}}
                                onClick={handleOpenMenu}
                    >
                        <MoreHorizIcon fontSize="medium" style={{color: "white"}}/>
                    </IconButton>
                )
            }
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

        <div style={{display: "flex", width: "100%"}}>
            <Typography style={{width: "50%"}}>Platform</Typography>
            <Typography>{project.platform}</Typography>
        </div>

        <div style={{display: "flex", width: "100%"}}>
            <Typography style={{width: "50%"}}>Cicd project</Typography>
            <Typography>{project.cicdProjectId}</Typography>
        </div>

        <div style={{display: "flex", width: "100%"}}>
            <Typography style={{width: "50%"}}>Cicd path</Typography>
            <Typography>{project.cicdPath}</Typography>
        </div>

        <div style={{display: "flex", width: "100%"}}>
            <Typography style={{width: "50%"}}>Tms project</Typography>
            <Typography>{project.tmsProjectId}</Typography>
        </div>
    </Card>
}