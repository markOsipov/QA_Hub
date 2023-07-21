import {
  Card,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextareaAutosize,
  useRadioGroup
} from "@mui/material";
import {useEffect, useState} from "react";
import {getQaReview, postQaReview} from "../../../../../requests/testResults/TestReviewRequests";
import SaveIcon from '@mui/icons-material/Save';
import {styled} from "@mui/material/styles";
import {customTheme} from "../../../../../styles/CustomTheme";
import IconButton from "@mui/material/IconButton";
import EditIcon from '@mui/icons-material/Edit';
export default function QaResolutionPanel({ testResult, ...props}) {
  const defaultReview = {
    testRunId: testResult.testRunId,
    fullName: testResult.fullName,
    qaComment: "",
    qaResolution: "Unreviewed"
  }

  const [qaReview, setQaReview] = useState(defaultReview)
  const [editing, setEditing] = useState(false)

  const refreshQaReview = () => {
    getQaReview(testResult.testRunId, testResult.fullName).then((data) => {
      setQaReview(data.data || defaultReview)
    })
  }

  useEffect(() => {
    refreshQaReview()
  }, [testResult.fullName, testResult.testRunId])

  const updateResolution = (event) => {
    postQaReview(testResult.testRunId, testResult.fullName, null, event.target.value).then((data) =>
      setQaReview(data?.data || defaultReview)
    )
  }

  const updateComment = () => {
    postQaReview(testResult.testRunId, testResult.fullName, qaReview.qaComment, qaReview.qaResolution).then((data) =>
      setQaReview(data?.data || defaultReview)
    )
    setEditing(false)
  }

  const handleShiftEnterKeysPressed = (event) => {
    if (event.shiftKey && event.key === 'Enter') {
      updateComment()
    }
  }

  if (!qaReview) {
    return null
  }

  return <Card
    style={{
      padding: '15px',
      width: 'max-content',
      minWidth: 'max-content',
      display: 'grid',
      height: 'min-content',
      backgroundColor: 'rgba(255, 255, 255, 0.04)',
      ...props.style
    }}
  >
    <FormControl>
      <RadioGroup row value={qaReview.qaResolution} onChange={updateResolution}>
        <ReviewFormControlLabel value="Unreviewed" unreviewed={'true'} control={<Radio />} label="Unreviewed"/>
        <ReviewFormControlLabel value="PassedLocally" control={<Radio />} label="Passed locally" />
        <ReviewFormControlLabel value="NeedRepair" control={<Radio />} label="Need repair" />
        <ReviewFormControlLabel value="TechProblem" control={<Radio />} label="Tech issue" />
        <ReviewFormControlLabel value="Bug" control={<Radio />} label="Bug" />
      </RadioGroup>
    </FormControl>
    <div style={{display: 'flex', marginTop: '5px', alignItems: 'center'}}>
      <TextareaAutosize
        value={qaReview.qaComment}
        onChange={(event) => {setQaReview({ ...qaReview, qaComment: event.target.value || "" })}}
        onKeyDown={handleShiftEnterKeysPressed}
        disabled={!editing}
        style={{
          width: '100%',
          height: '40px',
          minHeight: '40px',
          resize: 'vertical',
          fontFamily: 'unset',
          padding: '5px'
      }}
      />
      {
        !editing &&
        <IconButton
          style={{
            marginLeft: '5px',
            width: '45px',
            height: '45px',
            alignSelf: 'center',
            borderRadius: '5px'
          }}
          onClick={() => { setEditing(true)} }
        >
          <EditIcon style={{fontSize: '22px',}}  />
        </IconButton>
      }

      {
        editing &&
        <IconButton
          style={{
            marginLeft: '5px',
            width: '45px',
            height: '45px',
            alignSelf: 'center',
            borderRadius: '5px'
          }}
          onClick={() => {updateComment()}}
        >
          <SaveIcon style={{fontSize: '24px',}}  />
        </IconButton>
      }

    </div>
  </Card>
}

const StyledFormControlLabel = styled((props) => (
  <FormControlLabel {...props} />
))(({ theme, checked, unreviewed }) => ({

  ".MuiFormControlLabel-label":  {
    backgroundColor: checked && (unreviewed === 'true' ? customTheme.palette.error.main : customTheme.palette.text.disabledMore),
    padding: '2px 10px',
    color: checked && 'rgba(255, 255, 255, 0.95)',
    borderRadius: '5px',
    fontSize: '15px',
  }
}));

function ReviewFormControlLabel({unreviewed, ...props}) {
  const radioGroup = useRadioGroup();

  let checked = false;

  if (radioGroup) {
    checked = radioGroup.value === props.value;
  }

  return <StyledFormControlLabel checked={checked} unreviewed={unreviewed} {...props} />;
}