import {useRouter} from "next/router";
import {Paper} from "@mui/material";
import Typography from "@mui/material/Typography";
import MainProjectChart from "../../../components/project/MainProjectChart";
import {observer} from "mobx-react-lite";
import appState from "../../../state/AppState";

const ProjectPage = observer(({...props}) => {
  const router = useRouter()
  const project = router.query.project

  appState.setTitle(`QA Hub: ${project}`)

  return <Paper elevation={3} style={{padding: '15px', margin: '10px', ...props.style}}>
    <Typography variant={'h5'}>Project: {project}</Typography>
    <MainProjectChart project={project} style={{marginTop: '10px'}}/>
  </Paper>
})

export default ProjectPage