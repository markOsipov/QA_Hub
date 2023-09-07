import {useRouter} from "next/router";

export default function RootPage({...props}) {
  const router = useRouter()
  router.push("/projects")
  return <></>
}