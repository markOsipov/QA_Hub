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

    function getColors(logLevel){
        if (logLevel === "ERROR") {
            return {
                backgroundColor: "rgba(255, 0, 0, 0.03)",
                borderColor: "#d44e4f",
                color: "#d44e4f"
            }
        } else if (logLevel === "WARN") {
            return {
                backgroundColor: "rgba(255, 213, 0, 0.05)",
                borderColor: "rgba(255, 213, 0, 1)",
                color: "rgba(255, 213, 0, 1)"
            }
        } else if (logLevel === "DEBUG") {
            return {
                borderColor: "rgba(255, 255, 255, 0.4)",
                color: "rgba(255, 255, 255, 0.4)"
            }
        }
    }

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
                                    let colors = getColors(logEntry.level)
                                    return <StyledTableRow key={index} style={colors}>
                                        <StyledTableCell align="left">
                                            <label style={{ padding: "5px 9px"}}>{index + 1}</label>
                                        </StyledTableCell>

                                        <StyledTableCell align="center">
                                            <div style={{padding: "7px"}}>
                                                <label style={{border: "1px solid darkgray", borderRadius: "5px", padding: "5px", ...colors}}>{logEntry.level}</label>
                                            </div>
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