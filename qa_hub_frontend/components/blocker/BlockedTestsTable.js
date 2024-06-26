import {
    Paper, Switch,
    Table,
    TableBody, TableCell,
    TableContainer, TableFooter,
    TableHead, TablePagination, TableRow,
} from "@mui/material";
import {StyledTableRow} from "../primitives/Table/StyledTableRow";
import {StyledTableCell} from "../primitives/Table/StyledTableCell";
import {observer} from "mobx-react-lite";
import {useState, useEffect} from "react";
import FullNameTableHeaderCell from "./FullNameTableHeaderCell";
import BlockedTestTableRow from "./BlockedTestTableRow";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import AddBlockedTestModal from "./AddBlockedTestModal";
import TablePaginationActions from "../primitives/Table/TablePaginationActions";
import blockerState from "../../state/BlockerState";
import TestHistoryModal from "../stats/testHistoryModal/TestHistoryModal";
import {useRouter} from "next/router";
import ImportContactsIcon from '@mui/icons-material/ImportContacts';

const BlockedTestsTable = observer(() => {
    const router = useRouter()

    const project = router.query.project
    let {blockedTests} = blockerState

    const [showFullName, setShowFullName] = useState(true)
    const [addBlockedTestModalOpen, setAddBlockedTestModalOpen] = useState(false)

    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(20)

    const [testHistoryModalOpen, setTestHistoryModalOpen] = useState(router.query.testHistory != null)
    const [selectedTestId, setSelectedTestId] = useState(router.query.testHistory || null)

    const openTestHistoryModal = (fullName) => {
        setSelectedTestId(fullName)
        router.query.testHistory = fullName
        router.replace(router).then(() => {
            setTestHistoryModalOpen(true)
        })
    }

    const closeTestHistoryModal = (fullName) => {
        delete router.query.testHistory
        router.replace(router).then(() => {
            setTestHistoryModalOpen(false)
            setSelectedTestId(null)
        })
    }

    useEffect(() => {
        blockerState.updateBlockedTests(project)
    }, [project])


    function handleOpenAddBlockedTestModal() {
        setAddBlockedTestModalOpen(true)
    }

    function handleChangePage(event, newPage) {
        setPage(newPage)
    }

    function handleChangeRowsPerPage(event) {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0)
    }

    return <div>
        <Paper elevation={3} style={{margin: "15px", maxHeight: "calc(100vh - 165px)", overflowY: "auto", minWidth: "35vw" }}>
            <AddBlockedTestModal isOpen={addBlockedTestModalOpen} setIsOpen={setAddBlockedTestModalOpen} />
            <TestHistoryModal isOpen={testHistoryModalOpen} onClose={closeTestHistoryModal} testcaseId={selectedTestId} />
            <TableContainer style={{}}>
                <Table size="small" stickyHeader >
                    <TableHead style={{ height: "60px" }}>
                        <StyledTableRow>
                            <StyledTableCell align='center' style={{width: "50px"}}>№</StyledTableCell>
                            <StyledTableCell style={{width: "50px"}}/>
                            <StyledTableCell style={{width: "120px"}} align='center'>Trial</StyledTableCell>
                            <StyledTableCell style={{width: "200px"}} align='left'>TestcaseId</StyledTableCell>
                            <StyledTableCell style={{width: "200px"}} align='center'><label style={{position: "relative", left: "-25px"}}>Team</label></StyledTableCell>
                            <FullNameTableHeaderCell style={{width: "600px"}} showFullName={showFullName} setShowFullName={setShowFullName}/>
                            <StyledTableCell style={{minWidth: "400px", maxWidth:'600px'}} align='center'><label style={{position: "relative", left: "-25px"}}>Comment</label></StyledTableCell>
                            <StyledTableCell style={{width: "235px", minWidth: "235px"}} align='center'><label style={{position: "relative", left: "-25px"}}>Task</label></StyledTableCell>
                            <StyledTableCell style={{width: "200px", minWidth: "150px"}} align='center'>Block date</StyledTableCell>
                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                        {
                            (rowsPerPage > 0
                                ? blockedTests.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                : blockedTests
                            ).map((blockedTest, index) => {
                                    return <BlockedTestTableRow
                                        key={blockedTest._id}
                                        index={index}
                                        blockedTestForRow={blockedTest}
                                        showFullName={showFullName}
                                        setShowFullName={setShowFullName}
                                        openTestHistoryModal={openTestHistoryModal}
                                    />
                                }
                            )
                        }
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <StyledTableCell style={{borderBottom: "1px solid rgba(224, 224, 224, 1)", maxWidth: "50px"}} colSpan={4}>
                                <div style={{display: 'flex'}}>
                                    <Button variant="contained"
                                            color="primary"
                                            size="small"
                                            startIcon={<ImportContactsIcon />}
                                            onClick={() => router.push(`/projects/${project}/blocker/history`)}
                                            style={{margin: "0 5px", width: "max-content"}}
                                    >History</Button>

                                    <Button variant="contained"
                                            color="error"
                                            size="small"
                                            startIcon={<AddIcon />}
                                            onClick={handleOpenAddBlockedTestModal}
                                            style={{margin: "0 5px", width: "max-content"}}
                                    >Add</Button>
                                </div>
                            </StyledTableCell>
                            <TablePagination
                                rowsPerPageOptions={[20, 50, 100, { label: 'All', value: -1 }]}

                                count={blockedTests.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                SelectProps={{
                                    inputProps: {
                                        'aria-label': 'rows per page',
                                    },
                                    native: true,
                                }}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                ActionsComponent={TablePaginationActions}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </Paper>
    </div>
})

export default BlockedTestsTable