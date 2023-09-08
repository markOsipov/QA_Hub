import BlockedTestsTable from "../../../components/blocker/BlockedTestsTable";
import appState from "../../../state/AppState";
import {observer} from "mobx-react-lite";

const Blocker = observer(() => {
    appState.setTitle(`QA Hub: Blocker`)

    return (
        <BlockedTestsTable/>
    );
})

export default Blocker;