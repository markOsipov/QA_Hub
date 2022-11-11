import {
    Paper, Switch,
    Table,
    TableBody,
    TableContainer,
    TableFooter,
    TableHead,
    TablePagination,
    TableRow
} from "@mui/material";
import {StyledTableRow} from "../primitives/Table/StyledTableRow";
import {StyledTableCell} from "../primitives/Table/StyledTableCell";
import {observer} from "mobx-react-lite";
import projectState from "../../state/ProjectState";
import useSWR from "swr";
import {editBlockedTest, getBlockedTests, unblockTest} from "../../requests/QAHubBackend";
import React, {useEffect} from "react";
import LockOpenIcon from '@mui/icons-material/LockOpen';
import IconButton from "@mui/material/IconButton";
import {customTheme} from "../../styles/CustomTheme";


const BlockedTestsTable = observer(() => {
    const { selectedProject } = projectState

    let { data, error } = useSWR(selectedProject, getBlockedTests, { refreshInterval: 15000 } )

    const [blockedTests, setBlockedTests] = React.useState([])
    useEffect(() => {
        if (data?.data?.length > 0) {
            setBlockedTests(data.data)
        }
    }, [data])

    function handleUnblockButtonClick(blockedTest) {
        unblockTest(blockedTest).then( response => {
            if (response.data.deletedCount > 0) {
                getBlockedTests(selectedProject).then(blockedTestsResponse => {
                    setBlockedTests(blockedTestsResponse.data)
                })
            }
        })
    }

    function handleSwitchTrial(blockedTest, event) {
        const editedTest = {
            ...blockedTest,
            allowTrialRuns: event.target.checked
        }
        editBlockedTest(editedTest).then(response => {
            if (response.data.modifiedCount > 0) {
                getBlockedTests(selectedProject).then(blockedTestsResponse => {
                    setBlockedTests(blockedTestsResponse.data)
                })
            }
        })
    }

    if (error) return <div>Failed to receive blocked tests: { JSON.stringify(error, null, 2) }</div>
    if (!data) return <div>Blocked tests are loading </div>

    return <Paper elevation={3} style={{margin: "15px", maxHeight: "calc(100vh - 165px)", overflowY: "auto", minWidth: "35vw" }}>
        <TableContainer>
            <Table size="small" stickyHeader >
                <TableHead style={{ height: "60px" }}>
                    <StyledTableRow>
                        <StyledTableCell align='center' style={{width: "50px"}}>№</StyledTableCell>
                        <StyledTableCell style={{width: "50px"}}></StyledTableCell>
                        <StyledTableCell align='center'>Trial</StyledTableCell>
                        <StyledTableCell style={{width: "100px"}} align='center'>TestcaseId</StyledTableCell>
                        <StyledTableCell align='center'>Teams</StyledTableCell>
                        <StyledTableCell align='center'>FullName</StyledTableCell>
                        <StyledTableCell align='center'>Comment</StyledTableCell>
                        <StyledTableCell align='center'>Issue</StyledTableCell>
                        <StyledTableCell style={{width: "200px"}} align='center'>Block date</StyledTableCell>
                    </StyledTableRow>
                </TableHead>
                <TableBody>
                    {
                        blockedTests.map((blockedTest, index) =>
                            <StyledTableRow key={blockedTest._id} style={{ height: "45px"}}>
                                <StyledTableCell align="left">
                                    <label style={{ padding: "5px 9px"}}>{index + 1}</label>
                                </StyledTableCell>

                                <StyledTableCell align="left">
                                    <IconButton className="hover-highlight"
                                                style={{color: customTheme.palette.text.light, borderRadius: "2px"}}
                                                onClick={() => { handleUnblockButtonClick(blockedTest) }}
                                    >
                                        <LockOpenIcon></LockOpenIcon>
                                    </IconButton>
                                </StyledTableCell>

                                <StyledTableCell align="center">
                                    <Switch
                                        checked={blockedTest.allowTrialRuns}
                                        onChange={ (event) => { handleSwitchTrial(blockedTest, event) } }
                                    />
                                </StyledTableCell>

                                <StyledTableCell align="center">
                                    <label style={{ padding: "5px 9px" }}>{blockedTest.testcaseId}</label>
                                </StyledTableCell>

                                <StyledTableCell align="center">Teams WIP</StyledTableCell>

                                <StyledTableCell align="left">
                                    <label style={{padding: "5px 9px"}}>{blockedTest.fullName}</label>
                                </StyledTableCell>

                                <StyledTableCell align="left">{blockedTest.comment}</StyledTableCell>

                                <StyledTableCell align="center">{blockedTest.jiraIssue}</StyledTableCell>

                                <StyledTableCell align="center">{blockedTest.blockDate}</StyledTableCell>
                            </StyledTableRow>
                        )
                    }
                </TableBody>
            </Table>
        </TableContainer>
    </Paper>
})

export default BlockedTestsTable