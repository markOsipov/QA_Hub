import ComputerIcon from "@mui/icons-material/Computer";
import {customTheme} from "../../../../styles/CustomTheme";
import {useState} from "react";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";

export default function RunnersDetailsPlate({ testRun, ...props }) {
  const [selectedRunner, setSelectedRunner] = useState(null)

  const handleSelectRunnerClick = (runner) => {
    if (runner.name === selectedRunner?.name) {
      setSelectedRunner(null)
    } else {
      setSelectedRunner(runner)
    }
  }

  return <div style={{display: 'flex', ...props.style}}>
    <div style={{display: 'flex', flexDirection: 'column'}}>
      <label
        style={{
          backgroundColor: "rgb(77 77 77)",
          borderRadius: '5px',
          border: `1px solid ${customTheme.palette.text.disabled}`,
          width: 'min-content',
          padding: '1px 8px 3px 6px'
        }}
      >Runners</label>

      <div style={{display: 'flex', flexDirection: 'column', width: 'max-content',  marginTop: '15px'}}>
        {
          testRun.runners.map((runner) => {
            return <div
              key={runner.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '7px',
                opacity: selectedRunner?.name === runner.name ? '1' : selectedRunner == null ? '0.6' : '0.4'
              }}
              onClick={() => { handleSelectRunnerClick(runner) }}
            >
              <ComputerIcon style={{position: 'relative', top: '1px'}}/>
              <label
                style={{
                  marginLeft: '8px',
                  padding: '6px 8px',
                  border: selectedRunner?.name === runner.name ? `1px solid ${customTheme.palette.text.faded}` : `1px solid ${customTheme.palette.text.disabled}`,
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >{runner.name}</label>
            </div>
          })
        }
      </div>

    </div>

    { selectedRunner != null &&
      <div style={{display: 'flex', flexDirection: 'column', marginLeft: '28px'}}>
        <label
          style={{
            backgroundColor: "rgb(77 77 77)",
            borderRadius: '5px',
            border: `1px solid ${customTheme.palette.text.disabled}`,
            width: 'max-content',
            padding: '1px 8px 3px 6px'
          }}
        >Devices on {selectedRunner.name}</label>

        <div style={{display: 'flex', flexDirection: 'column', width: 'max-content', paddingRight: '15px', marginTop: '15px', maxHeight: '200px', overflowY: 'auto'}}>
          {
            selectedRunner.simulators.map((simulator) => {
              return <div
                key={simulator}
                style={{display: 'flex', alignItems: 'center',  marginBottom: '7px',}}
              >
                <PhoneIphoneIcon style={{position: 'relative', top: '1px'}}/>
                <label
                  style={{
                    marginLeft: '8px',
                    padding: '6px 8px',
                    border: `1px solid ${customTheme.palette.text.disabled}`,
                    borderRadius: '5px',
                    cursor: 'pointer',
                    opacity: '0.6',
                    minWidth: '335px'
                  }}
                >{simulator}</label>
              </div>
            })
          }
        </div>
      </div>
    }

    {
      selectedRunner == null &&
      <div style={{display: 'flex', flexDirection: 'column', marginLeft: '28px'}}>
        <label
          style={{
            backgroundColor: "rgb(77 77 77)",
            borderRadius: '5px',
            border: `1px solid ${customTheme.palette.text.disabled}`,
            width: 'max-content',
            padding: '1px 8px 3px 6px'
          }}
        >Devices</label>
        <label style={{marginTop: '20px', minWidth: '379px'}}>No selected runner</label>
      </div>
    }
  </div>


}