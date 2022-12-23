import {Accordion, AccordionDetails, AccordionSummary, Card} from "@mui/material";
import projectState from "../../state/ProjectState";
import {observer} from "mobx-react-lite";
import {useEffect, useState} from "react";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const ProjectEditor = observer(() => {
    return <Card style={{marginTop: "15px", display: "grid"}}>
        <Accordion>
            <AccordionSummary
                style={{maxWidth: "min-content"}}
                expandIcon={<ExpandMoreIcon style={{color: "rgba(255,255,255,0.75)", marginLeft: "2px", fontSize: "30px"}} />}
                aria-controls="panel1a-content"
            >
                <Typography variant="h5" style={{marginBottom: "15px", marginLeft: "15px", marginTop: "15px"}}>Projects</Typography>
            </AccordionSummary>

            <AccordionDetails>
                <div style={{display: "flex"}}>
                {
                    projectState.projectsDetails.map(project =>
                        <Card key={project._id} style={{padding: "15px", width: "300px", margin: "15px", backgroundColor: "rgba(255, 255, 255, 0.05)"}} elevation="5">

                            <Typography variant="h6" style={{marginBottom: "10px"}}>{project.name}</Typography>

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
                    )
                }
                </div>
            </AccordionDetails>
        </Accordion>
    </Card>
})

export default ProjectEditor