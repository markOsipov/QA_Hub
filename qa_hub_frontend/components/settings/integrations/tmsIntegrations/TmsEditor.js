import {observer} from "mobx-react-lite";
import {Accordion, AccordionDetails, Card} from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import {useEffect, useState} from "react";
import StyledAccordionSummary from "../../../primitives/StyledAccordeonSummary";
import useSWR from "swr";
import {getTmsIntegrations, getTmsTypes} from "../../../../requests/integrations/TMSRequests";
import TmsCard from "./TmsCard";
import NewTmsModal from "./NewTmsModal";

const TmsEditor = observer(() => {
    const [isNewTmsModalOpen, setIsNewTmsModalOpen] = useState(false)

    const [tmsTypes, setTmsTypes] = useState([])
    const [tmsIntegrations, setTmsIntegrations] = useState([])

    let tmsTypesResult = useSWR('getTmsTypes', getTmsTypes
    ,{
        revalidateOnFocus: false,
    })
    useEffect(() => {
        if (tmsTypesResult?.data?.data) {
            setTmsTypes(tmsTypesResult.data.data)
        }
    }, [tmsTypesResult])

    function updateTmsList() {
        getTmsIntegrations().then((data) => {
            if(data.data != null) {
                setTmsIntegrations(data.data)
            }
        })
    }

    let { data, error } = useSWR("getTmsIntegrations", updateTmsList, { refreshInterval: 60000 })

    const handleOpen = () => setIsNewTmsModalOpen(true);

    return <Card style={{marginTop: "15px", display: "grid"}}>
        <NewTmsModal isOpen={isNewTmsModalOpen} setIsOpen={setIsNewTmsModalOpen} updateTmsList={updateTmsList} tmsTypes={tmsTypes} tmsIntegrations={tmsIntegrations}/>
        <Accordion>
            <StyledAccordionSummary
                style={{maxWidth: "max-content"}}
                aria-controls="panel1a-content"
            >
                <Typography variant="h5" style={{marginBottom: "15px", marginLeft: "15px", marginTop: "15px"}}>Test management systems</Typography>
            </StyledAccordionSummary>

            <AccordionDetails>
                <div style={{display: "flex", flexWrap:"wrap"}}>
                    {
                        tmsIntegrations.map(tms =>
                            <TmsCard key={tms._id} tms={tms} updateTmsList={updateTmsList} tmsTypes={tmsTypes} tmsIntegrations={tmsIntegrations}/>
                        )
                    }
                </div>
                <div style={{display: "flex", margin: "15px 15px 0 15px"}}>
                    <Button variant="contained"
                            color="error"
                            startIcon={<AddIcon />}
                            onClick={handleOpen}
                    >Add TMS</Button>
                </div>
            </AccordionDetails>
        </Accordion>
    </Card>
})

export default TmsEditor