export type HeatBand = "Low" | "Moderate" | "High";

export type CityHeat = {
  temperature: number; // °C
  humidity: number;    // %
  wbgt: number;        // estimated °C
  band: HeatBand;
  time: string;
};

// NEA heat-stress bands
export function bandFor(wbgt: number): HeatBand {
  if (wbgt >= 33) return "High";
  if (wbgt >= 31) return "Moderate";
  return "Low";
}

// Simplified WBGT estimate from temperature and humidity
// (Australian Bureau of Meteorology formula, shade conditions)
export function estimateWbgt(tempC: number, humidity: number) {
  const vapourPressure =
    (humidity / 100) * 6.105 * Math.exp((17.27 * tempC) / (237.7 + tempC));
  return 0.567 * tempC + 0.393 * vapourPressure + 3.94;
}

export async function fetchCityHeat(lat: number, lon: number): Promise<CityHeat> {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,relative_humidity_2m&timezone=auto`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Weather request failed (${res.status})`);
  const json = await res.json();

  const temperature: number = json.current.temperature_2m;
  const humidity: number = json.current.relative_humidity_2m;
  const wbgt = Math.round(estimateWbgt(temperature, humidity) * 10) / 10;

  return { temperature, humidity, wbgt, band: bandFor(wbgt), time: json.current.time };
}