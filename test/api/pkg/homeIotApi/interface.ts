// @ts-nocheck
/* eslint-disable */
export interface LightingSummary {
  zones?: LightingZone[];
  zoneStatus?: LightingZoneStatus[];
}
export interface LightingZone {
  id?: string;
  name?: string;
  deviceId?: number;
  deviceType?: "dimmer" | "switch";
  zone?: string;
}
export interface LightingZoneStatus {
  id?: string;
  name?: string;
  lastUpdate?: string;
  level?: number;
}
export interface TemperatureSummary {
  zones?: TemperatureZone[];
  zoneStatus?: TemperatueZoneStatus[];
}
export interface TemperatureZone {
  id: number; // the unique identifier for the zone
  name: string;
  inputPosition?: number;
  outputPosition?: number;
  zone?: string;
}
export interface TemperatueZoneStatus {
  id: string; // the unique identifier for the zone
  name?: string; // the name of the zone
  value: number; // the temperature in the zone
  units?: "celsius" | "fahrenheit"; // the temperature units
  timestamp: string; // the timestamp when the temperature was measured
}
export interface ApiResponse {
  code?: number;
  message?: string;
}
export interface HeaterState {
  id?: string;
  state?: string;
}
export interface DeviceState {
  id?: string;
  name?: string;
  lastUpdate?: string;
  level?: number;
}
export interface ForecastResponse {
  city?: City;
  values?: Forecast[];
}
export interface Forecast {
  date?: string;
  pressure?: number;
  humidity?: number;
  windSpeed?: number;
  clouds?: number;
  temperature?: ForecastTemperature;
  weather?: WeatherForecast;
}
export interface City {
  id?: number;
  name?: string;
  lat?: number;
  lon?: number;
  country?: string;
}
export interface ForecastTemperature {
  low?: number;
  high?: number;
  morning?: number;
  day?: number;
  evening?: number;
  night?: number;
}
export interface WeatherForecast {
  summary?: string;
  description?: string;
  icon?: string;
}
export interface DeviceRegistrationInfo {
  uri?: string;
  id?: string;
}
