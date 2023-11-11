import { useMemo } from "react";
import * as d3 from "d3-scale";

const XAxis = ({ domain, range }) => {

    const ticks = useMemo(() => {
        const xScale = d3.scaleSymlog().domain(domain).range(range).constant(30);
        const width = range[1] - range[0];
        const pixelsPerTick = 10;
        const ticksTarget = Math.max(1, Math.floor(width / pixelsPerTick));
        console.log(xScale.ticks(ticksTarget).map(value => ({
            value, 
            xOffset: xScale(value)
        })))
        const values = [0, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000]
        return values.map(value => ({
            value: value, 
            xOffset: xScale(value)
        }))
    }, [domain.join('-'), range.join('-')]);

    console.log(ticks)

    return (
        <svg className='xAxis'>
          <path
            d={[
              "M", range[0], 6,
              "v", -6,
              "H", range[1],
              "v", 6,
            ].join(" ")}
            fill="none"
            stroke="black"
          />
          {ticks.map(({ value, xOffset }) => (
            <g
              key={value}
              transform={`translate(${xOffset}, 0)`}
            >
              <line
                y2="6"
                stroke="black"
              />
              <text
                key={value}
                style={{
                  fontSize: "10px",
                  textAnchor: "middle",
                  transform: "translateY(20px)"
                }}>
                { value }
              </text>
            </g>
          ))}
        </svg>
      )
}

const YAxis = () => {
    return (
        <div id='yAxis'> goodbye </div>
    )
}

export {XAxis, YAxis};