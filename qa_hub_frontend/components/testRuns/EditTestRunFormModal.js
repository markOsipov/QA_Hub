import {Box, Modal} from "@mui/material";
import Typography from "@mui/material/Typography";
import {useEffect, useState} from "react";
import Button from "@mui/material/Button";
import {getParamTypes, getTestRunForm, upsertTestRunForm} from "../../requests/TestRunFormsRequests";
import projectState from "../../state/ProjectState";
import {observer} from "mobx-react-lite";
import {modalStyle} from "../../styles/ModalStyle";
import ConfigureParamCard from "./ConfigureParamCard";

const EditTestRunFormModal = observer(({isOpen, setIsOpen, params, loadTestRunForm}) => {
    let {selectedProject} = projectState
    const [editedParams, setEditedParams] = useState(params)
    const [paramTypes, setParamTypes] = useState([])

    const defaultNewParam = {
        name: "",
        type: "text",
        value: "",
        options: [],
        description: "",
        readOnly: false,
    }

    useEffect(() => {
        if (isOpen) {
            setEditedParams(params)
            getParamTypes(projectState).then(response => {
                if (response.data) {
                    setParamTypes(response.data)
                }
            })
        }
    }, [isOpen])

    useEffect(() => {
        console.log(JSON.stringify(editedParams))
    }, [editedParams])

    const handleClose = () => {
        setIsOpen(!confirm("Close modal window?"))
    }

    const handleAddNewParamClick = () => {
        setEditedParams([
            ...editedParams,
            defaultNewParam
        ])
    }
    const handleUpdateTestRunFormClick = () => {
        if (editedParams.find(param => { return param.name === "" })) {
            alert("Parameter name couldn't be empty")
        } else {
            const body = {
                project: selectedProject,
                params: editedParams
            }

            upsertTestRunForm(body).then(() => {
                loadTestRunForm()
                setIsOpen(false)
            })
        }
    }

    const updateParam = (param, index) => {
        console.log("Updating param")
        const currentParams = [...editedParams]
        currentParams[index] = param

        setEditedParams(currentParams)
    }

    return <Modal
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
    >
        <Box sx={modalStyle}>
            <Typography id="modal-modal-title" variant="h6" component="h2" style={{marginBottom: "10px"}}>
                Editing test run form
            </Typography>

            {
                editedParams.map((param, index) => {
                    return <ConfigureParamCard key={ "param_" + param.name } param={param} index={index} params={editedParams} setParams={setEditedParams} paramTypes={paramTypes}/>
                })
            }

            <div style={{display: "flex", width: "max-content"}}>
                <Button variant="contained"
                        color="primary"
                        onClick={handleAddNewParamClick}
                        style={{margin: "12px 8px 0 8px"}}
                >Add param</Button>

                <Button variant="contained"
                        color="error"
                        onClick={handleUpdateTestRunFormClick}
                        style={{margin: "12px 8px 0 8px"}}
                >Save changes</Button>
            </div>
        </Box>
    </Modal>
})

export default EditTestRunFormModal;