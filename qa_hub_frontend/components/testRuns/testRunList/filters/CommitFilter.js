import {customTheme} from "../../../../styles/CustomTheme";
import StyledTextField from "../../../primitives/StyledTextField";
import StyledFormControl from "../../../primitives/StyledFormControl";

export default function CommitFilter({filter, setFilter, filterAndLoad, ...props}) {
  const handleEnterKeyPressed = (event) => {
    if (event.key === 'Enter') {
      filterAndLoad(filter)
    }
  }

  const handleCommitChange = (event) => {
    setFilter(
      {
        ...filter,
        commit: event.target.value
      }
    )
  }

  return <StyledFormControl size={"tiny"}>
    <StyledTextField
      label="Commit"
      value={filter.commit || ''}
      style={{backgroundColor: customTheme.palette.background.input, minWidth: '150px', ...props.style}}
      onChange={handleCommitChange}
      onKeyDown={handleEnterKeyPressed}
    />
  </StyledFormControl>
}