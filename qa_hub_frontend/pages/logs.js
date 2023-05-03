import {
    Checkbox,
    FormControl, InputLabel, ListItemText, MenuItem, OutlinedInput,
    Paper, Select,
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
    const logLevels = [
        "DEBUG",
        "INFO",
        "WARN",
        "ERROR"
    ]

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

    function parseDate(timestamp) {
        let dateFormat = new Date(Number.parseInt(timestamp))
        let year = dateFormat.getFullYear()
        let month = dateFormat.getMonth()
        let day = dateFormat.getDay()

        let hours = dateFormat.getHours()
        let minutes = dateFormat.getMinutes()
        let seconds = dateFormat.getSeconds()
        let millis = dateFormat.getMilliseconds()

        let date = `${day}-${month}-${year}`
        let time = `${hours}:${minutes}:${seconds}:${millis}`

        return {date, time}
    }

    const handleLogLevelChange = (event) => {
        let value = event.target.value

        setLogFilter({
            ...logFilter,
            level:  typeof value === 'string' ? value.split(',') : value
        })
    }


    return <div style={{padding: "15px"}}>
        <Paper style={{padding: "15px", marginBottom: "15px"}}>
            <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel style={{color: "var(--faded-text-color)", position: "relative", top: "10px"}}>Log level</InputLabel>
                <Select
                    multiple
                    value={logFilter.level}
                    onChange={handleLogLevelChange}
                    input={<OutlinedInput label="Log level"/>}
                    renderValue={(selected) => selected.join(', ')}
                    style={{backgroundColor: "rgba(255, 255, 255, 0.15)", paddingLeft: "8px"}}
                >
                    {logLevels.map((logLevel) => (
                        <MenuItem key={logLevel} value={logLevel}>
                            <Checkbox checked={logFilter.level.indexOf(logLevel) > -1} />
                            <ListItemText primary={logLevel} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Paper>
        <Paper>
            <TableContainer style={{}}>
                <Table size="small" stickyHeader >
                    <TableHead style={{ height: "60px" }}>
                        <StyledTableRow>
                            <StyledTableCell align='center' style={{maxWidth: "50px", width: "50px"}}>№</StyledTableCell>
                            <StyledTableCell style={{minWidth: "100px"}} align='center'>Level</StyledTableCell>
                            <StyledTableCell style={{minWidth: "150px"}} align='center'>Date</StyledTableCell>
                            <StyledTableCell align='left'>Message</StyledTableCell>
                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                        {
                            filteredLogs.map((logEntry, index) => {
                                    const colors = getColors(logEntry.level)
                                    const {date, time} = parseDate(logEntry.timestamp)

                                    return <StyledTableRow key={index} style={colors}>
                                        <StyledTableCell align="left">
                                            <label style={{ padding: "5px 9px"}}>{index + 1}</label>
                                        </StyledTableCell>

                                        <StyledTableCell align="center">
                                            <div style={{padding: "7px"}}>
                                                <label style={{border: "1px solid darkgray", borderRadius: "5px", padding: "5px", ...colors}}>{logEntry.level}</label>
                                            </div>
                                        </StyledTableCell>

                                        <StyledTableCell align="center">
                                            <div style={{display: "flex", flexDirection:"column"}}>
                                                <label>{date}</label>
                                                <label>{time}</label>
                                            </div>
                                        </StyledTableCell>

                                        <StyledTableCell style={{paddingTop: "10px", paddingBottom: "10px"}}>
                                            <div style={{maxHeight: "300px", overflowY: "scroll"}}>
                                                <div style={{display: "flex", flexDirection: "column", whiteSpace: "pre-wrap", maxHeight: "300px", overflowY: "visible"}}>
                                                    {
                                                        logEntry.message
                                                            .replace("\\", "")
                                                            .split("\n").map((line, lineIndex) => {
                                                            return <label key={index + "_" + lineIndex} style={{}}>{line}</label>
                                                        })
                                                    }
                                                </div>
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