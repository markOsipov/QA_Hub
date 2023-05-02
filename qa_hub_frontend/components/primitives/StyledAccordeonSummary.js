import {styled} from "@mui/material/styles";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import MuiAccordionSummary from "@mui/material/AccordionSummary";

const StyledAccordionSummary = styled((props) => (
    <MuiAccordionSummary

        expandIcon={
            <KeyboardArrowRightIcon style={{color: "rgba(255,255,255,0.75)", fontSize: "32px"}} />
        }
        {...props}
    />
))(({ theme }) => ({
    '& .MuiAccordionSummary-expandIconWrapper': {
        marginLeft: "2px", position: "relative", top: "1px"
    },
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg) translate(6px)',
    },
    '& .MuiAccordionSummary-content.Mui-expanded': {
        marginTop: '12px',
        marginBottom: '0'
    },
}))

export default StyledAccordionSummary