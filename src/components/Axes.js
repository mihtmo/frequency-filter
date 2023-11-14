import { useMemo } from "react";

const XAxis = ({ scale, domain, range, values }) => {
  
    const ticks = useMemo(() => {
        const width = range[1] - range[0];
        const pixelsPerTick = 10;
        // const ticksTarget = Math.max(1, Math.floor(width / pixelsPerTick));
        return values.map(value => ({
            value: value, 
            xOffset: scale(value)
        }))
    }, [domain.join('-'), range.join('-')]);

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
            stroke="white"
          />
          {ticks.map(({ value, xOffset }) => (
            <g
              key={value}
              transform={`translate(${xOffset}, 0)`}
            >
              <line
                y2="6"
                stroke="white"
              />
              <text
                key={value}
                fill='white'
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

const YAxis = ({ scale, domain, range }) => {

  const axisWidth = 40;

  const ticks = useMemo(() => {
    const height = range[1] - range[0];
    const pixelsPerTick = 20;
    const ticksTarget = Math.max(1, Math.floor(height / pixelsPerTick));
    return scale.ticks(ticksTarget).map(value => ({
        value: value, 
        yOffset: scale(value)
    }));
  }, [domain.join('-'), range.join('-')]);

  console.error(ticks)

  return (
      <svg className='yAxis'>
        <path
          d={[
            'M', axisWidth - 6, range[0],
            'H', axisWidth,
            'v', range[1],
            'H', axisWidth - 6,
          ].join(' ')}
          fill='none'
          stroke='white'
        />
        {ticks.map(({ value, yOffset }) => (
          <g
            key={value}
            transform={`translate(0, ${yOffset})`}
          >
            <line
              x1={`${axisWidth - 6}`}
              x2={`${axisWidth}`}
              stroke="white"
            />
            <text
              key={value}
              fill='white'
              style={{
                fontSize: "10px",
                textAnchor: "middle",
                transform: "translate(20px, .4em)"
              }}>
              { value }
            </text>
          </g>
        ))}
      </svg>
    )
}

export {XAxis, YAxis};