import {useState} from "react";
import {Card, ListItemIcon, ListItemText, Menu, MenuItem} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Typography from "@mui/material/Typography";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {deleteTmsIntegration} from "../../../../requests/integrations/TMSRequests";
import EditTmsModal from "./EditTMSModal";
import TextWithLabel from "../../../primitives/TextWithLabel";
import {customTheme} from "../../../../styles/CustomTheme";

export default function TmsCard({tms, updateTmsList, tmsTypes, tmsIntegrations, ...props}) {
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [showMoreButton, setShowMoreButton] = useState(false)
    const [isEditTmsModalOpen, setIsEditTmsModalOpen] = useState(false);

    const menuOpen = Boolean(menuAnchor);

    const handleOpenMenu = (event) => {
        setMenuAnchor(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setMenuAnchor(null);
    };

    const handleDeleteTms = () => {
        deleteTmsIntegration(tms["_id"]).then( () => {
                updateTmsList()
            }
        )
    }

    const handleEditTms = () => {
        setIsEditTmsModalOpen(true)
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
        <EditTmsModal isOpen={isEditTmsModalOpen} setIsOpen={setIsEditTmsModalOpen} updateTmsList={updateTmsList} tmsTypes={tmsTypes} tmsIntegrations={tmsIntegrations} tms={tms}/>
        <div style={{display: "flex", marginBottom: "10px"}}>
            <Typography variant="h6" style={{minWidth: "max-content"}}>{tms.tmsType}</Typography>
            <div style={{width: "100%", flexGrow: "2"}}></div>
            <Menu
                anchorEl={menuAnchor}
                open={menuOpen}
                onClose={handleCloseMenu}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={handleEditTms}>
                    <ListItemIcon>
                        <EditIcon fontSize="small" style={{color: customTheme.palette.text.primary}}/>
                    </ListItemIcon>
                    <ListItemText>Edit</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleDeleteTms}>
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" style={{color: customTheme.palette.text.primary}}/>
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                </MenuItem>
            </Menu>
        </div>

        <TextWithLabel value={tms.baseUrl} label={"Base URL"} style={{margin: '15px 0 15px 0'}}/>
        <TextWithLabel value={tms.apiUrl} label={"Base Api URL"} style={{margin: '20px 0 15px 0'}}/>
        <TextWithLabel value={tms.apiToken} label={"Api token"} style={{margin: '20px 0 15px 0'}}/>
        <TextWithLabel value={tms.login} label={"Login"} style={{margin: '20px 0 15px 0'}}/>
        <TextWithLabel value={tms.password} label={"Password"} style={{margin: '20px 0 15px 0'}}/>
    </Card>
}