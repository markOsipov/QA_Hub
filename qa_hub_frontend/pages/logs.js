import {
    Paper,
    Table,
    TableBody,
    TableContainer,
    TableHead,
} from "@mui/material";
import {useEffect, useState} from "react";
import useSWR from "swr";
import {getLogs} from "../requests/UtilsRequests";
import {StyledTableRow} from "../components/primitives/Table/StyledTableRow";
import {StyledTableCell} from "../components/primitives/Table/StyledTableCell";

function Logs() {
    const [logs, setLogs] = useState([])
    const [filteredLogs, setFilteredLogs] = useState([])

    const [logFilter, setLogFilter] = useState({
        level: [],
        search: null
    })

    const [linesCount, setLinesCount] = useState(200)
    const [refreshInterval, setRefreshInterval] = useState(null)

    let { data, error } = useSWR(linesCount, getLogs, { refreshInterval: refreshInterval, revalidateOnFocus: false })
    useEffect(() => {
        if (data) {
            setLogs(data.data)
        }
    }, [data])

    useEffect(() => {
        let filtered = logs
        if (logFilter.level && logFilter.level.length > 0) {
            filtered = filtered.filter(logEntry => { return logFilter.level.includes(logEntry.level) })
        }

        if (logFilter.search) {
            filtered = filtered.filter(logEntry => {
                return logEntry.message.includes(logFilter.search)
            })
        }

        setFilteredLogs(filtered)
    }, [logFilter, logs])

    return <div style={{padding: "15px"}}>
        <Paper style={{padding: "15px", marginBottom: "15px"}}>Filters</Paper>
        <Paper>
            <TableContainer style={{}}>
                <Table size="small" stickyHeader >
                    <TableHead style={{ height: "60px" }}>
                        <StyledTableRow>
                            <StyledTableCell align='center' style={{maxWidth: "50px", width: "50px"}}>№</StyledTableCell>
                            <StyledTableCell style={{minWidth: "150px"}} align='center'>Level</StyledTableCell>
                            <StyledTableCell align='left'>Message</StyledTableCell>
                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                        {
                            filteredLogs.map((logEntry, index) => {
                                    return <StyledTableRow key={index}>
                                        <StyledTableCell align="left">
                                            <label style={{ padding: "5px 9px"}}>{index + 1}</label>
                                        </StyledTableCell>

                                        <StyledTableCell align="center">
                                            <label style={{border: "1px solid darkgray", borderRadius: "5px", padding: "5px"}}>{logEntry.level}</label>
                                        </StyledTableCell>

                                        <StyledTableCell style={{ height: "100%", width: "100%", overflowY: "scroll"}}>
                                            <div style={{display: "flex", flexDirection: "column", whiteSpace: "pre-wrap"}}>
                                                {
                                                    logEntry.message
                                                        .replace("\\", "")
                                                        .split("\n").map((line, lineIndex) => {
                                                        return <label key={index + "_" + lineIndex} style={{}}>{line}</label>
                                                    })
                                                }
                                            </div>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                }
                            )
                        }
                    </TableBody>
                </Table>
            </TableContainer>

        </Paper>
    </div>
}

export default Logs