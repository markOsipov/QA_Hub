import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import {Card, ListItemIcon, ListItemText, Menu, MenuItem} from "@mui/material";
import {useState} from "react";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {deleteProject} from "../../../requests/ProjectRequests";
import projectState from "../../../state/ProjectState";
import EditProjectModal from "./EditProjectModal";
import TextWithLabel from "../../primitives/TextWithLabel";

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
        <TextWithLabel label={'Cicd project'} value={project.cicdProjectId} style={{margin: '15px 0 15px 0'}}></TextWithLabel>
        <TextWithLabel label={'Cicd path'} value={project.cicdPath} style={{margin: '15px 0 15px 0'}}></TextWithLabel>
        <TextWithLabel label={'Tms project'} value={project.tmsProjectId} style={{margin: '15px 0 15px 0'}}></TextWithLabel>

    </Card>
}