export default function Mandala({ size = 200 }) {
  const rings = [
    { r: size * 0.45, opacity: 0.12, width: 1.5 },
    { r: size * 0.38, opacity: 0.18, width: 1.5 },
    { r: size * 0.30, opacity: 0.25, width: 2 },
    { r: size * 0.22, opacity: 0.35, width: 2 },
    { r: size * 0.14, opacity: 0.5, width: 2.5 },
    { r: size * 0.07, opacity: 0.7, width: 2 },
  ];

  const cx = size / 2;
  const cy = size / 2;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {rings.map((ring, i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={ring.r}
          fill="none"
          stroke="#C4456B"
          strokeWidth={ring.width}
          opacity={ring.opacity}
        />
      ))}
      <circle cx={cx} cy={cy} r={size * 0.025} fill="#C4456B" opacity={0.9} />
    </svg>
  );
}
