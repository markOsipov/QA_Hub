import {observer} from "mobx-react-lite";
import projectState from "../../state/ProjectState";
import {Paper} from "@mui/material";
import {useState, useEffect} from "react";
import {getTestRunForm} from "../../requests/TestRunFormsRequests";
import Typography from "@mui/material/Typography";
import EditTestRunFormModal from "./EditTestRunFormModal";
import Button from "@mui/material/Button";

const TestRunForm = observer(() => {
    let {selectedProject} = projectState
    const [isEditTestRunFormModalOpen, setIsEditTestRunFormModalOpen] = useState(false);
    const [params, setParams] = useState([])

    function loadTestRunForm() {
        getTestRunForm(selectedProject).then(response => {
            if (response.data?.params) {
                setParams(response.data?.params)
            }
        })
    }

    useEffect(() => {
        loadTestRunForm()
    }, [selectedProject])

    const handleEditFormClick = () => {
        setIsEditTestRunFormModalOpen(true)
    }

    return <Paper style={{padding: "15px"}}>
        <EditTestRunFormModal isOpen={isEditTestRunFormModalOpen} setIsOpen={setIsEditTestRunFormModalOpen} params={params} loadTestRunForm={loadTestRunForm}/>
        {
            params.length === 0 ? <Typography>No params configured for this project</Typography> : <div>{JSON.stringify(params)}</div>
        }

        <Button variant="contained"
                color="error"
                size="small"
                onClick={handleEditFormClick}
                style={{margin: "12px 8px 0 8px"}}
        >Configure</Button>
    </Paper>
})

export default TestRunForm