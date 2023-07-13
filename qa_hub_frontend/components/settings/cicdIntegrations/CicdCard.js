import {useState} from "react";
import {Card, ListItemIcon, ListItemText, Menu, MenuItem} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Typography from "@mui/material/Typography";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {deleteCicdIntegration} from "../../../requests/CicdRequests";
import EditCicdModal from "./EditCicdModal";

export default function CicdCard({cicd, updateCicdList, cicdTypes, cicdIntegrations, ...props}) {
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [showMoreButton, setShowMoreButton] = useState(false)
    const [isEditCicdModalOpen, setIsEditCicdModalOpen] = useState(false);

    const menuOpen = Boolean(menuAnchor);

    const handleOpenMenu = (event) => {
        setMenuAnchor(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setMenuAnchor(null);
    };

    const handleDeleteCicd = () => {
        deleteCicdIntegration(cicd["_id"]).then( () => {
                updateCicdList()
            }
        )
    }

    const handleEditCicd = () => {
        setIsEditCicdModalOpen(true)
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
        <EditCicdModal isOpen={isEditCicdModalOpen} setIsOpen={setIsEditCicdModalOpen} updateCicdList={updateCicdList} cicdTypes={cicdTypes} cicdIntegrations={cicdIntegrations} cicd={cicd}/>
        <div style={{display: "flex", marginBottom: "10px"}}>
            <Typography variant="h6" style={{minWidth: "max-content"}}>{cicd.cicdType}</Typography>
            <div style={{width: "100%", flexGrow: "2"}}></div>
            <Menu
                anchorEl={menuAnchor}
                open={menuOpen}
                onClose={handleCloseMenu}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={handleEditCicd}>
                    <ListItemIcon>
                        <EditIcon fontSize="small" style={{color: "var(--primary-text-color)"}}/>
                    </ListItemIcon>
                    <ListItemText>Edit</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleDeleteCicd}>
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" style={{color: "var(--primary-text-color)"}}/>
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                </MenuItem>
            </Menu>
        </div>

        <div style={{display: "flex", width: "100%", marginBottom: "5px"}}>
            <Typography style={{width: "100px"}}>Base URL</Typography>
            <Typography>{cicd.baseUrl}</Typography>
        </div>

        <div style={{display: "flex", width: "100%", marginBottom: "5px"}}>
            <Typography style={{width: "100px"}}>Api token</Typography>
            <Typography>{cicd.apiToken}</Typography>
        </div>

        <div style={{display: "flex", width: "100%", marginBottom: "5px"}}>
            <Typography style={{width: "100px"}}>Login</Typography>
            <Typography>{cicd.login}</Typography>
        </div>

        <div style={{display: "flex", width: "100%", marginBottom: "5px"}}>
            <Typography style={{width: "100px"}}>Password</Typography>
            <Typography>{cicd.password}</Typography>
        </div>

    </Card>
}