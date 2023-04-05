import {
    Paper, Switch,
    Table,
    TableBody,
    TableContainer,
    TableHead,
} from "@mui/material";
import {StyledTableRow} from "../primitives/Table/StyledTableRow";
import {StyledTableCell} from "../primitives/Table/StyledTableCell";
import {observer} from "mobx-react-lite";
import projectState from "../../state/ProjectState";
import {getBlockedTests} from "../../requests/QAHubBackend";
import {useState, useEffect} from "react";
import FullNameTableHeaderCell from "./FullNameTableHeaderCell";
import BlockedTestTableRow from "./BlockedTestTableRow";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import AddBlockedTestModal from "./AddBlockedTestModal";


const BlockedTestsTable = observer(() => {
    let {selectedProject} = projectState
    const [blockedTests, setBlockedTests] = useState([])
    const [showFullName, setShowFullName] = useState(true)
    const [addBlockedTestModalOpen, setAddBlockedTestModalOpen] = useState(false)

    useEffect(() => {
        updateBlockedTestsList()
    }, [selectedProject])

    function updateBlockedTestsList() {
        getBlockedTests(selectedProject).then(blockedTestsResponse => {
            setBlockedTests(blockedTestsResponse.data)
        })
    }

    function handleOpenAddBlockedTestModal() {
        setAddBlockedTestModalOpen(true)
    }

    return <div>
        <Paper elevation={3} style={{margin: "15px", maxHeight: "calc(100vh - 165px)", overflowY: "auto", minWidth: "35vw" }}>
            <AddBlockedTestModal isOpen={addBlockedTestModalOpen} setIsOpen={setAddBlockedTestModalOpen} updateBlockedTestsList={updateBlockedTestsList} />
            <TableContainer style={{minWidth: "max-content"}}>
                <Table size="small" stickyHeader >
                    <TableHead style={{ height: "60px" }}>
                        <StyledTableRow>
                            <StyledTableCell align='center' style={{width: "50px"}}>№</StyledTableCell>
                            <StyledTableCell style={{width: "50px"}}/>
                            <StyledTableCell style={{width: "120px"}} align='center'>Trial</StyledTableCell>
                            <StyledTableCell style={{width: "200px"}} align='left'>TestcaseId</StyledTableCell>
                            <StyledTableCell style={{width: "200px"}} align='center'><label style={{position: "relative", left: "-25px"}}>Team</label></StyledTableCell>
                            <FullNameTableHeaderCell style={{width: "600px"}} showFullName={showFullName} setShowFullName={setShowFullName}/>
                            <StyledTableCell style={{minWidth: "400px"}} align='center'><label style={{position: "relative", left: "-25px"}}>Comment</label></StyledTableCell>
                            <StyledTableCell style={{width: "120px"}} align='center'><label style={{position: "relative", left: "-25px"}}>Issue</label></StyledTableCell>
                            <StyledTableCell style={{width: "150px"}} align='center'>Block date</StyledTableCell>
                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                        {
                            blockedTests.map((blockedTest, index) =>
                                <BlockedTestTableRow
                                    key={blockedTest._id}
                                    index={index}
                                    blockedTestForRow={blockedTest}
                                    showFullName={showFullName}
                                    setShowFullName={setShowFullName}
                                    updateBlockedTestsList={updateBlockedTestsList}
                                />
                            )
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
        <Button variant="contained"
                color="error"
                startIcon={<AddIcon />}
                onClick={handleOpenAddBlockedTestModal}
                style={{margin: "0 15px"}}
        >Add blocked test</Button>
    </div>
})

export default BlockedTestsTable