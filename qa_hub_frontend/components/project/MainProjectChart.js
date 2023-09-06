import {Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend} from "recharts";
import {customTheme} from "../../styles/CustomTheme";
import {daysBetween, getDate} from "../../utils/DateTimeUtils";
import {add} from "date-fns";
import Typography from "@mui/material/Typography";
import {useEffect, useState} from "react";
import {getMainProjectMetrics} from "../../requests/metrics/MainProjectMetricsRequests";

export default function MainProjectChart({project, ...props}) {
  const [data, setData] = useState([])
  const [ticks, setTicks] = useState([])
  const [domain, setDomain] = useState([])

  useEffect(() => {
    getMainProjectMetrics(project).then(response => {
      const calculatedData = Array.from(response.data || [])
      calculatedData.forEach(el => {
        const date = new Date(el.date)
        date.setHours(0, 0, 0, 0)
        el.date = new Date(date)
      })

      setData(calculatedData)

      if (calculatedData.length > 0) {
        const startDate = calculatedData[0].date
        const endDate = calculatedData[calculatedData.length - 1].date

        setDomain([dataMin => dataMin, () => endDate.getTime()])
        setTicks(getTicks(startDate, endDate, 5))
      }
    })
  }, [project])

  const dateFormatter = date => {
    return getDate(date)
  };

  const colors = {
    manual: 'rgb(120,188,206)',
    auto: '#da2149',
    blocked: '#f2ab09'
  }

  const getTicks = (startDate, endDate, num) => {
    const diffDays = daysBetween(startDate, endDate);

    let current = startDate,
      velocity = Math.round(diffDays / (num - 1));

    const ticks = [startDate.getTime()];

    for (let i = 1; i < num - 1; i++) {
      ticks.push(add(current, { days: i * velocity }).getTime());
    }

    ticks.push(endDate.getTime());
    return ticks;
  };

  // const fillTicksData = (_ticks, data) => {
  //   const ticks = [..._ticks];
  //   const filled = [];
  //   let currentTick = ticks.shift();
  //   let lastData = null;
  //   for (const it of data) {
  //     if (ticks.length && it.date > currentTick && lastData) {
  //       filled.push({ ...lastData, ...{ date: currentTick } });
  //       currentTick = ticks.shift();
  //     } else if (ticks.length && it.date === currentTick) {
  //       currentTick = ticks.shift();
  //     }
  //
  //     filled.push(it);
  //     lastData = it;
  //   }
  //
  //   return filled;
  // }


  // const filledData = fillTicksData(ticks, data);

  const CustomTooltip = ({ active, payload, label }) => {
    const data = payload[0]?.payload

    if (active && payload && payload.length) {
      return (
        <div style={{backgroundColor: customTheme.palette.background.default, padding: '5px 25px'}}>
          <p>{getDate(label)}</p>
          <p style={{color: colors.manual}}>Manual: { data.manual }</p>
          <p style={{color: colors.auto}}>Auto: { data.auto }</p>
          <p style={{color: colors.blocked}}>Blocked: { data.blocked }</p>
        </div>
      )
    }
    return null
  }

  if (data.length === 0) {
    return  <>No data</>
  }

  return <div style={{...props.style}}>
    <Typography variant={'h6'}>Main project chart</Typography>

    <div style={{width: '100%', height: '500px', display: 'grid', justifyItems: 'center'}}>
      <ResponsiveContainer width="60%" height="100%">
        <AreaChart
          width={500}
          height={400}
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            XAxis
            dataKey="date"
            hasTick
            scale="time"
            tickFormatter={dateFormatter}
            type="number"
            domain={domain}
            ticks={ticks}
          />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />

          <Area type="monotone"
                dataKey="auto"
                stackId="1"
                stroke={colors.auto}
                fill={colors.auto}
                fillOpacity={0.5}
                strokeWidth={3}
                dot={{ stroke: 'white', strokeWidth: 1, r: 5,strokeDasharray:''}}
          />

          <Area type="monotone"
                dataKey="manual"
                stackId="1"
                stroke={colors.manual}
                fill={colors.manual}
                fillOpacity={0.15}
                strokeWidth={3}
                strokeOpacity={0.8}
                dot={{ stroke: 'white', strokeWidth: 1, r: 5,strokeDasharray:''}}
          />


          <Area type="monotone"
                dataKey="blocked"
                stackId="2"
                stroke={colors.blocked}
                fill={colors.blocked}
                fillOpacity={0.5}
                strokeWidth={3}
                dot={{ stroke: 'white', strokeWidth: 1, r: 5,strokeDasharray:''}}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
}

