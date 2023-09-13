import HomePageContent from "../../components/home/HomePageContent";
import {observer} from "mobx-react-lite";
import appState from "../../state/AppState";
import {useEffect} from "react";

const HomePage = observer(() => {

  useEffect(() => {
    appState.setTitle("QA Hub")
  }, [])

  return  <HomePageContent />
})

export default HomePage