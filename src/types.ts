export interface SensorData {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  minRange: number;
  maxRange: number;
  icon: string;
  color: string;
  history: { time: string; value: number }[];
  lastUpdated: string;
}

export interface SmartDevice {
  id: string;
  name: string;
  status: 'ON' | 'OFF';
  mode: 'AUTO' | 'MANUAL';
  icon: string;
  color: string;
  schedule: string | null;
  automationRule: string | null;
  lastToggled: string;
}

export interface WeatherInfo {
  location: string;
  temp: number;
  condition: string;
  conditionCode: string; // e.g. 'sunny', 'rainy', 'cloudy', 'windy', 'storm'
  humidity: number;
  windSpeed: number;
  rainProb: number;
  pressure: number;
  uvIndex: number;
  aqi: number;
  sunrise: string;
  sunset: string;
}

export interface ForecastDay {
  day: string;
  tempMin: number;
  tempMax: number;
  condition: string;
  conditionCode: string;
  rainProb: number;
}

export interface ForecastHour {
  time: string;
  temp: number;
  conditionCode: string;
  rainProb: number;
}

export interface EnergyData {
  solarGeneration: number; // in kW
  batteryPercentage: number; // %
  powerConsumption: number; // in kW
  history: {
    time: string;
    solar: number;
    battery: number;
    consumption: number;
  }[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'alert' | 'success';
  time: string;
  read: boolean;
}

export interface AIRecommendation {
  id: string;
  trigger: string;
  recommendation: string;
  reason: string;
  targetDevice: string;
  suggestedState: 'ON' | 'OFF' | 'AUTO';
  implemented: boolean;
}
