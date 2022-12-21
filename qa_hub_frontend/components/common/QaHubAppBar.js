import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import AdbIcon from '@mui/icons-material/Adb';
import SettingsIcon from '@mui/icons-material/Settings';
import ProjectSelector from "./ProjectSelector";
import {useRouter} from "next/router";

const pages = ['blocker', 'statistics', 'metrics'];

function QaHubAppBar() {
    const router = useRouter()

    return (
        <AppBar position="static">
            <Container style={{maxWidth: "100vw", paddingLeft: "10px"}}>
                <Toolbar disableGutters>
                    <AdbIcon sx={{ display: { xs: 'none', md: 'flex', fontSize: "45px" }, mr: 1 }} />
                    <div>
                        <Typography
                            variant="h6"
                            noWrap
                            component="a"
                            href="/"
                            sx={{
                                mr: 2,
                                display: { xs: 'none', md: 'flex' },
                                fontWeight: 700,
                            }}
                        >
                            QA Hub
                        </Typography>
                        <Typography>{router.asPath}</Typography>
                    </div>


                    <ProjectSelector style={{ marginLeft: "5px", marginRight: "20px" }}/>

                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                            <Button
                                key={page}
                                sx={{ my: 2, color: 'white', display: 'block' }}
                                href={`/${page}`}
                            >
                                {page}
                            </Button>
                        ))}
                    </Box>

                    <Box>
                        <Tooltip title="Open settings">
                            <IconButton href="/settings">
                                <SettingsIcon fontSize="large" style={{color: "white"}}/>
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default QaHubAppBar;