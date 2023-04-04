import {Accordion, AccordionDetails, AccordionSummary, Box, Card} from "@mui/material";
import projectState from "../../../state/ProjectState";
import {observer} from "mobx-react-lite";
import Typography from "@mui/material/Typography";
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import {styled} from "@mui/material/styles";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Button from "@mui/material/Button";
import AddIcon from '@mui/icons-material/Add';
import {useState} from "react";
import NewProjectModal from "./NewProjectModal";

const ProjectEditor = observer(() => {
    const [isOpen, setIsOpen] = useState(false);
    const handleOpen = () => setIsOpen(true);

    const AccordionSummary = styled((props) => (
        <MuiAccordionSummary

            expandIcon={
                <KeyboardArrowRightIcon style={{color: "rgba(255,255,255,0.75)", fontSize: "32px"}} />
            }
            {...props}
        />
    ))(({ theme }) => ({
        '& .MuiAccordionSummary-expandIconWrapper': {
            marginLeft: "2px", position: "relative", top: "1px"
        },
        '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
            transform: 'rotate(90deg) translate(6px)',
        },
        '& .MuiAccordionSummary-content.Mui-expanded': {
            marginTop: '12px',
            marginBottom: '0'
        },
    }));

    return <Card style={{marginTop: "15px", display: "grid"}}>
        <NewProjectModal isOpen={isOpen} setIsOpen={setIsOpen}/>
        <Accordion>
            <AccordionSummary
                style={{maxWidth: "min-content"}}
                aria-controls="panel1a-content"
            >
                <Typography variant="h5" style={{marginBottom: "15px", marginLeft: "15px", marginTop: "15px"}}>Projects</Typography>
            </AccordionSummary>

            <AccordionDetails>
                <div style={{display: "flex", flexWrap:"wrap"}}>
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
                <div style={{display: "flex", margin: "15px 15px 0 15px"}}>
                    <Button variant="contained"
                            color="error"
                            startIcon={<AddIcon />}
                            onClick={handleOpen}
                    >Add project</Button>
                </div>
            </AccordionDetails>
        </Accordion>
    </Card>
})

export default ProjectEditor