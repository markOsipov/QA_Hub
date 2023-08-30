import {
    Checkbox,
    FormControl, InputAdornment, InputLabel, Input, ListItemText, MenuItem, OutlinedInput,
    Paper, Select,
    Table,
    TableBody,
    TableContainer,
    TableHead,
} from "@mui/material";
import {useEffect, useState} from "react";
import {getLogs} from "../../requests/UtilsRequests";
import {StyledTableRow} from "../../components/primitives/Table/StyledTableRow";
import {StyledTableCell} from "../../components/primitives/Table/StyledTableCell";
import SearchIcon from '@mui/icons-material/Search';
import IconButton from "@mui/material/IconButton";
import SyncIcon from '@mui/icons-material/Sync';
import StyledSelect from "../primitives/StyledSelect";
import {customTheme} from "../../styles/CustomTheme";

function LogViewer() {
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
        search: ""
    })

    const [linesCount, setLinesCount] = useState(200)

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

    function refreshLogs() {
        getLogs(linesCount).then((data) => {
            if (data.data) {
                setLogs(data.data)
            }
        })
    }

    useEffect(() => {
        refreshLogs()
    }, [linesCount])

    function getColors(logLevel){
        if (logLevel === "ERROR") {
            return {
                borderColor: "#d44e4f",
                color: "#d44e4f"
            }
        } else if (logLevel === "WARN") {
            return {
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

    const handleLinesCountChange = (event) => {
        setLinesCount(event.target.value)
    }

    const handleSearch = (event) => {
        if (event.key === 'Enter') {
            setLogFilter({
                ...logFilter,
                search: event.target.value
            })
        }
    }

    return <div>
        <Paper style={{padding: "15px", marginBottom: "15px", paddingTop: "0"}}>
            <div style={{display: "flex"}}>
                <FormControl sx={{ m: 1, width: 300 }}>
                    <InputLabel style={{color: customTheme.palette.text.faded, position: "relative", top: "10px"}}>Log level</InputLabel>
                    <StyledSelect
                        multiple
                        value={logFilter.level}
                        onChange={handleLogLevelChange}
                        input={<OutlinedInput label="Log level"/>}
                        renderValue={(selected) => selected.join(', ')}
                        style={{backgroundColor: "rgba(255, 255, 255, 0.15)", paddingLeft: "8px"}}
                        size="small"
                    >
                        {logLevels.map((logLevel) => (
                            <MenuItem key={logLevel} value={logLevel}>
                                <Checkbox checked={logFilter.level.indexOf(logLevel) > -1} />
                                <ListItemText primary={logLevel} />
                            </MenuItem>
                        ))}
                    </StyledSelect>
                </FormControl>

                <div style={{display: "grid", alignSelf: "end", padding: "10px"}}>
                    <FormControl variant="standard" style={{width: "200px"}}>
                        <InputLabel style={{color: customTheme.palette.text.faded, paddingLeft: "8px"}}>
                            Search
                        </InputLabel>
                        <Input style={{backgroundColor: "rgba(255, 255, 255, 0.15)", height: '33px', paddingLeft: "8px"}}
                               endAdornment={
                                   <InputAdornment position="start">
                                       <SearchIcon/>
                                   </InputAdornment>
                               }
                               onKeyDown={handleSearch}
                        />
                    </FormControl>
                </div>

                <div style={{flexGrow: "2"}}></div>


                <div style={{display: "grid", alignSelf: "end", padding: "10px"}}>
                    <div style={{display: "flex"}}>

                        <FormControl style={{minWidth: "100px"}}>
                            <InputLabel style={{color: customTheme.palette.text.faded }}>Lines count</InputLabel>
                            <StyledSelect
                                style={{backgroundColor: "rgba(255, 255, 255, 0.10)"}}
                                value={linesCount}
                                label="Age"
                                onChange={handleLinesCountChange}
                                size="small"
                            >
                                {
                                    [10, 50, 100, 200, 500, 1000, 2000].map(value => {
                                        return  <MenuItem key={value} value={value}>{value}</MenuItem>
                                    })
                                }
                            </StyledSelect>
                        </FormControl>

                        <IconButton style={{
                            backgroundColor: customTheme.palette.error.main,
                            width: "35px", height: "35px",
                            borderRadius: "14px",
                            marginLeft: "10px"
                        }}
                                    onClick={refreshLogs}
                        >
                            <SyncIcon style={{fontSize: "27px", transform: "rotate(55deg)"}}/>
                        </IconButton>
                    </div>
                </div>
            </div>
        </Paper>
        <Paper>
            <TableContainer style={{}}>
                <Table size="small" stickyHeader >
                    <TableHead style={{ height: "60px" }}>
                        <StyledTableRow>
                            <StyledTableCell align='center' style={{maxWidth: "50px", width: "50px"}}>№</StyledTableCell>
                            <StyledTableCell style={{minWidth: "150px"}} align='center'>Level</StyledTableCell>
                            <StyledTableCell style={{minWidth: "200px"}} align='center'>Date</StyledTableCell>
                            <StyledTableCell align='left'>Message</StyledTableCell>
                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                        {
                            filteredLogs.map((logEntry, index) => {
                                    const colors = getColors(logEntry.level)
                                    const {date, time} = parseDate(logEntry.timestamp)
                                    const messageLines = (logEntry.message ?? "")
                                        .replace("\\", "")
                                        .split("\n")

                                    function getStyle() {
                                        if (messageLines.length > 15) {
                                            return {
                                                overflowY: "scroll",
                                                resize: "vertical",
                                                minHeight: "100px",
                                                maxHeight: (20 * messageLines.length + 25) + "px"
                                            }
                                            return {}
                                        }
                                    }

                                    return <StyledTableRow key={index} style={{backgroundColor: 'rgba(0, 0, 0, 0.85)', ...colors, }}>
                                        <StyledTableCell align="right" style={{padding: '0'}}>
                                            <label style={{color: customTheme.palette.text.disabled}}>{index + 1}</label>
                                        </StyledTableCell>

                                        <StyledTableCell align="center" style={{padding: '0'}}>
                                            <div style={{padding: "7px"}}>
                                                <label style={{border: "1px solid darkgray", borderRadius: "5px", padding: "2px 5px", ...colors}}>{logEntry.level}</label>
                                            </div>
                                        </StyledTableCell>

                                        <StyledTableCell align="center" style={{padding: '0'}}>
                                            <div style={{display: "flex"}}>
                                                <label>{date}</label>
                                                <label style={{marginLeft: '8px'}}>{time}</label>
                                            </div>
                                        </StyledTableCell>

                                        <StyledTableCell style={{paddingTop: "10px", width: "100%", padding: "0"}}>
                                            <div style={{maxHeight: "300px", ...getStyle()}}>
                                                <div style={{display: "flex", flexDirection: "column", whiteSpace: "pre-wrap", maxHeight: "300px", overflowY: "visible"}}>
                                                    {
                                                        messageLines.map((line, lineIndex) => {
                                                            return <label key={index + "_" + lineIndex} style={{fontFamily: 'monospace'}}>{line}</label>
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

export default LogViewer