import {observer} from "mobx-react-lite";
import alertState from "../../state/AlertState";
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import {customTheme} from "../../styles/CustomTheme";
import CloseIcon from '@mui/icons-material/Close';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import CustomIconButton from "../primitives/CustomIconButton";
import {styled} from "@mui/material/styles";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';

const AlertsView = observer(({...props}) => {
  const {alerts} = alertState

  if (alerts.length < 1) {
    return null
  }

  return <Stack style={{...props.style}}  sx={{ width: '300px' }} spacing={1}>
    <div style={{width: '100%', display: 'flex'}}>

      <div style={{flexGrow: '1.1'}}></div>

      <Button variant="contained"
              color="error"
              size="small"
              onClick={() => {alertState.setAlerts([])}}
              style={{height: '25px', marginLeft: '20px'}}
              endIcon={<DeleteIcon style={{position: 'relative', top: '-1px'}}/>}
      >Close all</Button>
    </div>
    {
      alerts.map((alert, index) => {
        return <CustomAlert key={index} alert={alert} index={index}/>
      })
    }
  </Stack>
})

const CustomAlert = observer(({ index, alert, ...props}) => {
  let backgroundColor
  let icon

  const iconStyle = {fontSize: '23px'}
  switch (alert.severity) {
    case 'success':
      backgroundColor = customTheme.palette.success.main
      icon = <CheckCircleIcon style={iconStyle}/>
      break;
    case 'error':
      backgroundColor = customTheme.palette.error.main
      icon = <CancelIcon style={iconStyle}/>
      break;
    case 'warning':
      backgroundColor = customTheme.palette.warning.main
      icon = <WarningIcon style={iconStyle}/>
      break;
    default:
      backgroundColor = customTheme.palette.primary.main
      icon = <InfoIcon style={iconStyle}/>
      break;
  }

  const closeAlert = () => {
    alertState.removeAlert(index)
  }

  // setTimeout(closeAlert, 10000);

  return <StyledAlert
    icon={<div style={{
      backgroundColor: backgroundColor,
      width: '40px',
      height: '40px',
      borderRadius: '5px',
      display: 'grid',
      alignContent: 'center',
      justifyContent: 'center'
    }}>{icon}</div>}
    severity={alert.severity || 'info'}
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyItems: 'center',
      backgroundColor: customTheme.palette.background.popup,
      border: '1px solid',
      padding: '0px 17px 0px 0px',
      borderColor: customTheme.palette.background.default,
      color: customTheme.palette.text.primary,
      fontSize: '35px',
      ...props.style
    }}
    action={<CustomIconButton icon={<CloseIcon/>} action={closeAlert} color={customTheme.palette.text.disabled}/>}
  >{alert.title}</StyledAlert>
})

export default AlertsView

const StyledAlert = styled((props) => (
  <Alert {...props}/>
))(({ theme, ...props }) => ({
  '& .MuiAlert-icon': {
    padding: '0',
    borderRadius: '5px'
  }
}));