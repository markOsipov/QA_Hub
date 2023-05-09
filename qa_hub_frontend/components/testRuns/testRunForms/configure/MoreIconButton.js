import IconButton from "@mui/material/IconButton";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import {Menu, MenuItem} from "@mui/material";
import {useState} from "react";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
function MoreIconButton({params, setParams, index}) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleOpenMenu = (event) => {
        setAnchorEl(event.currentTarget);
    }
    const handleCloseMenu = () => {
        setAnchorEl(null);
    }

    const swapElements = (firstIndex, secondIndex) => {
        let paramsCopy = params.slice()
        let firstEl = paramsCopy[firstIndex]
        paramsCopy[firstIndex] = paramsCopy[secondIndex]
        paramsCopy[secondIndex] = firstEl

        setParams(paramsCopy)
    }

    const handleMoveUp = () => {
        if (index !== 0) {
            swapElements(index, index - 1)
        }

        setAnchorEl(null);
    }

    const handleMoveDown = () => {
        if (index !== params.length - 1) {
            swapElements(index, index + 1)
        }

        setAnchorEl(null);
    }

    return <div>

        <IconButton style={{position: "absolute", right: "0", top: "0"}}
                    onClick={handleOpenMenu}
        >
            <MoreHorizIcon/>
        </IconButton>

        <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleCloseMenu}
        >
            <MenuItem onClick={handleMoveUp}>
                <ArrowDropUpIcon style={{marginRight: "8px"}}/>
                Move up
            </MenuItem>
            <MenuItem onClick={handleMoveDown}>
                <ArrowDropDownIcon style={{marginRight: "8px"}}/>
                Move down
            </MenuItem>
        </Menu>
    </div>
}

export default MoreIconButton