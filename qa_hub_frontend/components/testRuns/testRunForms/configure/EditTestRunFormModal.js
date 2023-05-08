import {Box, Modal} from "@mui/material";
import Typography from "@mui/material/Typography";
import {useEffect, useState} from "react";
import Button from "@mui/material/Button";
import {getParamTypes, upsertTestRunForm} from "../../../../requests/TestRunFormsRequests";
import projectState from "../../../../state/ProjectState";
import {observer} from "mobx-react-lite";
import {modalStyle} from "../../../../styles/ModalStyle";
import ConfigureParamCard from "./ConfigureParamCard";

const EditTestRunFormModal = observer(({isOpen, setIsOpen, params, loadTestRunForm}) => {
    let {selectedProject} = projectState
    const testRunFormParamsViewId = "edit-test-run-form-params"

    const [editedParams, setEditedParams] = useState(params)
    const [paramTypes, setParamTypes] = useState([])

    const defaultNewParam = {
        name: "",
        type: "text",
        value: '',
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

        setTimeout(function() {
            const testRunFormParamsView = document.getElementById(testRunFormParamsViewId)
            testRunFormParamsView.scroll({
                top: testRunFormParamsView.scrollHeight,
                behavior: "smooth"
            })
        }, 100)
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

    return <Modal
        open={isOpen}
        onClose={handleClose}
    >
        <Box sx={modalStyle} style={{paddingRight: "5px", minWidth: "70vw", marginBottom: "20px"}} >
            <Typography id="modal-modal-title" variant="h6" component="h2" style={{marginBottom: "10px"}}>
                Editing test run form
            </Typography>

            <div style={{maxHeight: "88vh", overflowY: "auto", paddingRight: "10px"}} id={testRunFormParamsViewId}>
                {
                    editedParams.map((param, index) => {
                        return <ConfigureParamCard key={ "param_" + index } param={param} index={index} params={editedParams} setParams={setEditedParams} paramTypes={paramTypes}/>
                    })
                }
            </div>

            <div style={{display: "flex", width: "max-content", marginTop: "15px"}}>
                <Button variant="contained"
                        color="error"
                        onClick={handleUpdateTestRunFormClick}
                        style={{margin: "0"}}
                >Save changes</Button>

                <Button variant="contained"
                        color="primary"
                        onClick={handleAddNewParamClick}
                        style={{margin: "0"}}
                >Add param</Button>
            </div>

        </Box>
    </Modal>
})

export default EditTestRunFormModal;