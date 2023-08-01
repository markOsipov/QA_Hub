import {observer} from "mobx-react-lite";
import {Accordion, AccordionDetails, Card} from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import {useEffect, useState} from "react";
import StyledAccordionSummary from "../../../primitives/StyledAccordeonSummary";
import TaskTrackerCard from "./TaskTrackerCard";
import NewTaskTrackerModal from "./NewTaskTrackerModal";
import {getTaskTrackerIntegrations, getTaskTrackerTypes} from "../../../../requests/integrations/TaskTrackerRequests";

const TaskTrackerEditor = observer(() => {
    const [isNewModalOpen, setIsNewModalOpen] = useState(false)

    const [types, setTypes] = useState([])
    const [integrations, setIntegrations] = useState([])


    useEffect(() => {
        updateTypes()
    }, [])

    useEffect(() => {
        updateIntegrations()
    }, [])

    const updateTypes = () => {
        getTaskTrackerTypes().then((data => {
            if (data?.data) {
                setTypes(data.data)
            }
        }))
    }

    const updateIntegrations = () => {
        getTaskTrackerIntegrations().then((data => {
            if (data?.data) {
                setIntegrations(data.data)
            }
        }))
    }

    const handleOpen = () => setIsNewModalOpen(true);

    return <Card style={{marginTop: "15px", display: "grid"}}>
        <NewTaskTrackerModal isOpen={isNewModalOpen} setIsOpen={setIsNewModalOpen} updateIntegrations={updateIntegrations} types={types} integrations={integrations}/>
        <Accordion>
            <StyledAccordionSummary
                style={{maxWidth: "max-content"}}
                aria-controls="panel1a-content"
            >
                <Typography variant="h5" style={{marginBottom: "15px", marginLeft: "15px", marginTop: "15px"}}>Task tracker Integrations</Typography>
            </StyledAccordionSummary>

            <AccordionDetails>
                <div style={{display: "flex", flexWrap:"wrap"}}>
                    {
                        integrations.map(integration =>
                            <TaskTrackerCard key={integration._id} integration={integration} updateIntegrations={updateIntegrations} types={types} integrations={integrations}/>
                        )
                    }
                </div>
                <div style={{display: "flex", margin: "15px 15px 0 15px"}}>
                    <Button variant="contained"
                            color="error"
                            startIcon={<AddIcon />}
                            onClick={handleOpen}
                    >Add Integration</Button>
                </div>
            </AccordionDetails>
        </Accordion>
    </Card>
})

export default TaskTrackerEditor