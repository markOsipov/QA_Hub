import {observer} from "mobx-react-lite";
import projectState from "../../state/ProjectState";
import Typography from "@mui/material/Typography";
import {Card, Paper} from "@mui/material";
import Stack from "@mui/material/Stack";
import {useState} from "react";
import {customTheme} from "../../styles/CustomTheme";
import {useRouter} from "next/router";
import GoToSettingsStub from "../stubs/GoToSettingsStub";
import AndroidIcon from '@mui/icons-material/Android';
import AppleIcon from '@mui/icons-material/Apple';
import EngineeringIcon from '@mui/icons-material/Engineering';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

const HomePageContent = observer(() => {
  const {projectsDetails} = projectState

  if (projectsDetails.length === 0) {
    return <GoToSettingsStub />
  }

  return <div style={{padding:'10px'}}>

    <Typography variant={'h6'} style={{marginBottom: '10px'}}> QA Hub projects</Typography>

    <Stack spacing={1}>
      {
        projectsDetails.map((project, index) => {
          return <HomePageProjectCard key={index} project={project}/>
        })
      }
    </Stack>
  </div>
})

const HomePageProjectCard = ({project, ...props}) => {
  const router = useRouter()
  const [hovered, setHovered] = useState(false)

  const handleProjectClick = () => {
    router.push(`/projects/${project.name}`)
  }

  const platformIcon = project.platform === 'ios' ? <AppleIcon /> :
    project.platform === 'android' ? <AndroidIcon /> :
      project.platform === 'backend' ? <EngineeringIcon /> : <MoreHorizIcon />

  return <Card
    onMouseOver={() => { setHovered(true)}}
    onMouseLeave={() => { setHovered(false)}}
    onBlur={() => {setHovered(false)}}
    onClick={handleProjectClick}
    style={{
      cursor: 'pointer',
      padding: '15px',
      backgroundColor: hovered && customTheme.palette.background.hoverHighlight,
      ...props.style
    }}
    {...props}
  >
    <div style={{display: 'flex', alignItems: 'center'}}>
      {
        platformIcon
      }
      <Typography variant={'h5'} style={{marginLeft: '10px'}}>{project.name}</Typography>
    </div>
  </Card>
}

export default HomePageContent