import HomePageContent from "../../components/home/HomePageContent";
import {observer} from "mobx-react-lite";
import appState from "../../state/AppState";

const HomePage = observer(() => {
  appState.setTitle("QA Hub")

  return  <HomePageContent />
})

export default HomePage