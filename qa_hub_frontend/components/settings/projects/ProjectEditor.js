import {Accordion, AccordionDetails, AccordionSummary, Box, Card} from "@mui/material";
import projectState from "../../../state/ProjectState";
import {observer} from "mobx-react-lite";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import AddIcon from '@mui/icons-material/Add';
import {useState} from "react";
import NewProjectModal from "./NewProjectModal";
import ProjectCard from "./ProjectCard";
import StyledAccordionSummary from "../../primitives/StyledAccordeonSummary";

const ProjectEditor = observer(() => {
    const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
    const handleOpen = () => setIsNewProjectModalOpen(true);

    return <Card style={{marginTop: "15px", display: "grid"}}>
        <NewProjectModal isOpen={isNewProjectModalOpen} setIsOpen={setIsNewProjectModalOpen}/>
        <Accordion>
            <StyledAccordionSummary
                style={{maxWidth: "min-content"}}
                aria-controls="panel1a-content"
            >
                <Typography variant="h5" style={{marginBottom: "15px", marginLeft: "15px", marginTop: "15px"}}>Projects</Typography>
            </StyledAccordionSummary>

            <AccordionDetails>
                <div style={{display: "flex", flexWrap:"wrap"}}>
                {
                    projectState.projectsDetails.map(project =>
                        <ProjectCard key={project._id} project={project} />
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