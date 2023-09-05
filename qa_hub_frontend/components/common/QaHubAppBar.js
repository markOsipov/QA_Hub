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
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import {useEffect, useState} from "react";
import {observer} from "mobx-react-lite";
import projectState from "../../state/ProjectState";
import {customTheme} from "../../styles/CustomTheme";

const pages = ['blocker', 'statistics', 'testRuns'];

const QaHubAppBar = observer(() => {
  const router = useRouter()
  const project = projectState.selectedProject
  const projects = projectState.projects

  const [labelElements, setLabelElements] = useState(
    router.asPath
      .split("?")[0]
      .split("/")
      .filter( el => el !== '' )
  )

  useEffect(() => {
    const changeLabelElements = (e) => {
      setLabelElements(
        e.split("?")[0]
        .split("/")
        .filter(el => el !== '')
      )
    }
    router.events.on("routeChangeStart", changeLabelElements);

    return () => {
      router.events.off("routeChangeStart", changeLabelElements);
    };
  }, [router.events]);

  return (
    <AppBar position="static">
      <Container style={{maxWidth: "100vw", paddingLeft: "10px"}}>
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: 'none', md: 'flex', fontSize: "45px" }, mr: 1 }} />
          <div>
            <QAHubTitle style={{width: 'min-content'}}/>
            <div style={{display: 'flex'}}>

              {
                labelElements.map((pathElement, index) => {
                  return <div key={index} style={{display: 'flex'}}>
                    <label style={{margin: '0 4px'}}>/</label>
                    <LabelElement
                      pathElement={pathElement}
                      href={"/" + labelElements.slice(0, index + 1).join("/")}
                    />
                  </div>
                })
              }
            </div>
          </div>

          {
            projects.length > 0 && project !== null && projects.includes(router.query.project) &&
            <div style={{display: 'flex', alignItems: 'center'}}>
              <ProjectSelector style={{ marginLeft: "12px", marginRight: "20px" }}/>

              <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                {pages.map((page) => (
                  <Button
                    key={page}
                    sx={{ my: 2, color: 'white', display: 'block' }}
                    href={`/projects/${project}/${page}`}
                  >
                    {page}
                  </Button>
                ))}
              </Box>
            </div>
          }

          <div style={{flexGrow: '1'}}></div>

          <Box>
            <Tooltip title="Open logs">
              <IconButton href="/logs">
                <TextSnippetIcon fontSize="large" style={{color: "white"}}/>
              </IconButton>
            </Tooltip>
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
})

const LabelElement = ({pathElement, href, ...props}) => {
  const [hovered, setHovered] = useState(false)
  return <a
    onMouseOver={() => {setHovered(true)}}
    onMouseLeave={() => {setHovered(false)}}
    onBlur={() => {setHovered(false)}}
    href={href}
    style={{
      cursor: 'pointer',
      textDecoration:  hovered && 'underline'
    }}
    {...props}
  >{pathElement}</a>
}

const QAHubTitle=({...props}) => {
  const [hovered, setHovered] = useState(false)

  return <Typography
    onMouseOver={() => {setHovered(true)}}
    onMouseLeave={() => {setHovered(false)}}
    onBlur={() => {setHovered(false)}}

    variant="h6"
    noWrap
    component="a"
    href="/"
    sx={{
      mr: 2,
      display: { xs: 'none', md: 'flex' },
      fontWeight: 700,
    }}
    style={{
      padding: '0px 6px',
      backgroundColor: hovered && customTheme.palette.background.hoverHighlight,
      ...props.style
    }}
  >
    QA Hub
  </Typography>
}

export default QaHubAppBar;