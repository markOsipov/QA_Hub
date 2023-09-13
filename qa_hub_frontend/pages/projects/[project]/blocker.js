import BlockedTestsTable from "../../../components/blocker/BlockedTestsTable";
import appState from "../../../state/AppState";
import {observer} from "mobx-react-lite";
import {useEffect} from "react";

const Blocker = observer(() => {
    useEffect(() => {
        appState.setTitle(`QA Hub: Blocker`)
    }, [])

    return (
        <BlockedTestsTable/>
    );
})

export default Blocker;