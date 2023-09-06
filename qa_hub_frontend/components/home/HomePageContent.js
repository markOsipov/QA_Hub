import {observer} from "mobx-react-lite";
import projectState from "../../state/ProjectState";
import Typography from "@mui/material/Typography";
import {Card, Paper} from "@mui/material";
import Stack from "@mui/material/Stack";
import {useState} from "react";
import {customTheme} from "../../styles/CustomTheme";
import {useRouter} from "next/router";
import GoToSettingsStub from "../stubs/GoToSettingsStub";

const HomePageContent = observer(() => {
  const {projects} = projectState

  if (projects.length === 0) {
    return <GoToSettingsStub />
  }

  return <div style={{padding:'10px'}}>

    <Typography variant={'h6'} style={{marginBottom: '10px'}}> QA Hub projects</Typography>

    <Stack spacing={1}>
      {
        projects.map((project, index) => {
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
    router.push(`/projects/${project}`)
  }

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
    <Typography variant={'h6'}>{project}</Typography>
  </Card>
}

export default HomePageContent