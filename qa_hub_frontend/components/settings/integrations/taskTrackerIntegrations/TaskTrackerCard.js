import {useState} from "react";
import {Card, ListItemIcon, ListItemText, Menu, MenuItem} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Typography from "@mui/material/Typography";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EditTaskTrackerModal from "./EditTaskTrackerModal";
import TextWithLabel from "../../../primitives/TextWithLabel";
import {deleteTaskTrackerIntegration} from "../../../../requests/integrations/TaskTrackerRequests";

export default function TaskTrackerCard({integration, updateIntegrations, types, integrations, ...props}) {
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [showMoreButton, setShowMoreButton] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const menuOpen = Boolean(menuAnchor);

    const handleOpenMenu = (event) => {
        setMenuAnchor(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setMenuAnchor(null);
    };

    const handleDelete = () => {
        deleteTaskTrackerIntegration(integration["_id"]).then(() => {
            updateIntegrations()
        })
    }

    const handleEdit = () => {
        setIsEditModalOpen(true)
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
        <EditTaskTrackerModal isOpen={isEditModalOpen} setIsOpen={setIsEditModalOpen} updateIntegrations={updateIntegrations} types={types} integrations={integrations} integration={integration}/>
        <div style={{display: "flex", marginBottom: "10px"}}>
            <Typography variant="h6" style={{minWidth: "max-content"}}>{integration.type}</Typography>
            <div style={{width: "100%", flexGrow: "2"}}></div>
            <Menu
                anchorEl={menuAnchor}
                open={menuOpen}
                onClose={handleCloseMenu}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={handleEdit}>
                    <ListItemIcon>
                        <EditIcon fontSize="small" style={{color: "var(--primary-text-color)"}}/>
                    </ListItemIcon>
                    <ListItemText>Edit</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleDelete}>
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" style={{color: "var(--primary-text-color)"}}/>
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                </MenuItem>
            </Menu>
        </div>

        <TextWithLabel value={integration.baseUrl} label={"Base URL"} style={{margin: '15px 0 15px 0'}}/>
        <TextWithLabel value={integration.apiToken} label={"Api token"} style={{margin: '20px 0 15px 0'}}/>
        <TextWithLabel value={integration.login} label={"Login"} style={{margin: '20px 0 15px 0'}}/>
        <TextWithLabel value={integration.password} label={"Password"} style={{margin: '20px 0 15px 0'}}/>

    </Card>
}