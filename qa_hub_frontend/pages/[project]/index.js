import {useRouter} from "next/router";

const ProjectPage = () => {
  const router = useRouter()

  return <>Project page: {router.query.project}</>
}

export default ProjectPage