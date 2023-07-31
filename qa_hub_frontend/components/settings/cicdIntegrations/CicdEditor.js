import {observer} from "mobx-react-lite";
import {Accordion, AccordionDetails, Card} from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import {useEffect, useState} from "react";
import StyledAccordionSummary from "../../primitives/StyledAccordeonSummary";
import useSWR from "swr";
import {getCicdIntegrations, getCicdTypes} from "../../../requests/CICDRequests";
import CicdCard from "./CicdCard";
import NewCicdModal from "./NewCicdModal";

const CicdEditor = observer(() => {
    const [isNewCicdModalOpen, setIsNewCicdModalOpen] = useState(false)

    const [cicdTypes, setCicdTypes] = useState([])
    const [cicdIntegrations, setCicdIntegrations] = useState([])

    let cicdTypesResult = useSWR('getCicdTypes', getCicdTypes
    ,{
        revalidateOnFocus: false,
    })
    useEffect(() => {
        if (cicdTypesResult?.data?.data) {
            setCicdTypes(cicdTypesResult.data.data)
        }
    }, [cicdTypesResult])

    function updateCicdList() {
        getCicdIntegrations().then((data) => {
            if(data.data != null) {
                setCicdIntegrations(data.data)
            }
        })
    }

    let { data, error } = useSWR("getCicdIntegrations", updateCicdList, { refreshInterval: 60000 })

    const handleOpen = () => setIsNewCicdModalOpen(true);

    return <Card style={{marginTop: "15px", display: "grid"}}>
        <NewCicdModal isOpen={isNewCicdModalOpen} setIsOpen={setIsNewCicdModalOpen} updateCicdList={updateCicdList} cicdTypes={cicdTypes} cicdIntegrations={cicdIntegrations}/>
        <Accordion>
            <StyledAccordionSummary
                style={{maxWidth: "max-content"}}
                aria-controls="panel1a-content"
            >
                <Typography variant="h5" style={{marginBottom: "15px", marginLeft: "15px", marginTop: "15px"}}>CICD Integrations</Typography>
            </StyledAccordionSummary>

            <AccordionDetails>
                <div style={{display: "flex", flexWrap:"wrap"}}>
                    {
                        cicdIntegrations.map(cicd =>
                            <CicdCard key={cicd._id} cicd={cicd} updateCicdList={updateCicdList} cicdTypes={cicdTypes} cicdIntegrations={cicdIntegrations}/>
                        )
                    }
                </div>
                <div style={{display: "flex", margin: "15px 15px 0 15px"}}>
                    <Button variant="contained"
                            color="error"
                            startIcon={<AddIcon />}
                            onClick={handleOpen}
                    >Add CICD</Button>
                </div>
            </AccordionDetails>
        </Accordion>
    </Card>
})

export default CicdEditor