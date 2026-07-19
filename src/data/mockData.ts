import { SensorData, SmartDevice, WeatherInfo, ForecastDay, ForecastHour, EnergyData, NotificationItem, AIRecommendation } from '../types';

export const initialSensors: SensorData[] = [
  {
    id: 'temp',
    name: 'Air Temperature',
    value: 26.8,
    unit: '°C',
    status: 'normal',
    minRange: 18,
    maxRange: 32,
    icon: 'Thermometer',
    color: 'from-orange-500 to-red-500',
    lastUpdated: 'Just now',
    history: [
      { time: '00:00', value: 21.2 },
      { time: '04:00', value: 19.8 },
      { time: '08:00', value: 23.4 },
      { time: '12:00', value: 28.5 },
      { time: '16:00', value: 29.1 },
      { time: '20:00', value: 24.6 },
      { time: '22:00', value: 26.8 },
    ]
  },
  {
    id: 'humidity',
    name: 'Air Humidity',
    value: 62,
    unit: '%',
    status: 'normal',
    minRange: 40,
    maxRange: 80,
    icon: 'Droplets',
    color: 'from-blue-400 to-indigo-500',
    lastUpdated: 'Just now',
    history: [
      { time: '00:00', value: 75 },
      { time: '04:00', value: 82 },
      { time: '08:00', value: 68 },
      { time: '12:00', value: 54 },
      { time: '16:00', value: 51 },
      { time: '20:00', value: 59 },
      { time: '22:00', value: 62 },
    ]
  },
  {
    id: 'soil',
    name: 'Soil Moisture',
    value: 22, // Low soil moisture, should trigger warning
    unit: '%',
    status: 'warning',
    minRange: 30,
    maxRange: 70,
    icon: 'Sprout',
    color: 'from-amber-600 to-emerald-700',
    lastUpdated: '2 mins ago',
    history: [
      { time: '00:00', value: 38 },
      { time: '04:00', value: 35 },
      { time: '08:00', value: 31 },
      { time: '12:00', value: 28 },
      { time: '16:00', value: 25 },
      { time: '20:00', value: 23 },
      { time: '22:00', value: 22 },
    ]
  },
  {
    id: 'light',
    name: 'Light Intensity',
    value: 450,
    unit: 'Lux',
    status: 'normal',
    minRange: 200,
    maxRange: 1200,
    icon: 'Sun',
    color: 'from-yellow-400 to-orange-500',
    lastUpdated: 'Just now',
    history: [
      { time: '00:00', value: 0 },
      { time: '04:00', value: 10 },
      { time: '08:00', value: 380 },
      { time: '12:00', value: 920 },
      { time: '16:00', value: 740 },
      { time: '20:00', value: 120 },
      { time: '22:00', value: 450 },
    ]
  },
  {
    id: 'co2',
    name: 'CO₂ Levels',
    value: 820,
    unit: 'ppm',
    status: 'normal',
    minRange: 400,
    maxRange: 1200,
    icon: 'Wind',
    color: 'from-teal-400 to-emerald-600',
    lastUpdated: '5 mins ago',
    history: [
      { time: '00:00', value: 580 },
      { time: '04:00', value: 610 },
      { time: '08:00', value: 720 },
      { time: '12:00', value: 850 },
      { time: '16:00', value: 890 },
      { time: '20:00', value: 840 },
      { time: '22:00', value: 820 },
    ]
  },
  {
    id: 'rain',
    name: 'Precipitation Sensor',
    value: 0.0,
    unit: 'mm',
    status: 'normal',
    minRange: 0,
    maxRange: 10,
    icon: 'CloudRain',
    color: 'from-cyan-400 to-blue-600',
    lastUpdated: 'Just now',
    history: [
      { time: '00:00', value: 0 },
      { time: '04:00', value: 0 },
      { time: '08:00', value: 0 },
      { time: '12:00', value: 0 },
      { time: '16:00', value: 0 },
      { time: '20:00', value: 0 },
      { time: '22:00', value: 0 },
    ]
  }
];

export const initialDevices: SmartDevice[] = [
  {
    id: 'water-pump',
    name: 'Main Water Pump',
    status: 'OFF',
    mode: 'AUTO',
    icon: 'Activity',
    color: 'blue',
    schedule: '06:00 AM - 08:00 AM',
    automationRule: 'Soil Moisture < 30%',
    lastToggled: 'Today, 08:00 AM'
  },
  {
    id: 'irrigation',
    name: 'Drip Irrigation System',
    status: 'OFF',
    mode: 'AUTO',
    icon: 'Layers',
    color: 'emerald',
    schedule: '05:00 PM - 06:00 PM',
    automationRule: 'Soil Moisture < 35%',
    lastToggled: 'Yesterday, 05:00 PM'
  },
  {
    id: 'cooling-fan',
    name: 'Cooling Fans',
    status: 'ON',
    mode: 'AUTO',
    icon: 'Wind',
    color: 'cyan',
    schedule: null,
    automationRule: 'Air Temp > 28°C',
    lastToggled: 'Today, 11:30 AM'
  },
  {
    id: 'exhaust-fan',
    name: 'Air Ventilation Fan',
    status: 'OFF',
    mode: 'AUTO',
    icon: 'RefreshCw',
    color: 'teal',
    schedule: 'Every 2 Hours (10m)',
    automationRule: 'CO₂ > 1000ppm',
    lastToggled: 'Today, 08:00 PM'
  },
  {
    id: 'grow-light',
    name: 'Auxiliary Grow Lights',
    status: 'ON',
    mode: 'MANUAL',
    icon: 'Lightbulb',
    color: 'yellow',
    schedule: '06:00 PM - 10:00 PM',
    automationRule: 'Light Intensity < 300 Lux',
    lastToggled: 'Today, 06:00 PM'
  },
  {
    id: 'window-controller',
    name: 'Automatic Greenhouse Shutter',
    status: 'OFF',
    mode: 'AUTO',
    icon: 'Maximize2',
    color: 'purple',
    schedule: null,
    automationRule: 'Air Temp > 27°C & Rain = 0',
    lastToggled: 'Today, 09:15 AM'
  },
  {
    id: 'misting',
    name: 'Fogger / Misting System',
    status: 'OFF',
    mode: 'AUTO',
    icon: 'CloudRain',
    color: 'indigo',
    schedule: null,
    automationRule: 'Humidity < 50%',
    lastToggled: 'Today, 02:45 PM'
  }
];

export const defaultWeather: WeatherInfo = {
  location: 'Greenhouse Zone A, CA',
  temp: 26.8,
  condition: 'Partly Cloudy',
  conditionCode: 'cloudy',
  humidity: 62,
  windSpeed: 12.4,
  rainProb: 15,
  pressure: 1012,
  uvIndex: 4,
  aqi: 42,
  sunrise: '06:14 AM',
  sunset: '08:22 PM'
};

export const defaultHourlyForecast: ForecastHour[] = [
  { time: '10:00', temp: 24, conditionCode: 'sunny', rainProb: 0 },
  { time: '12:00', temp: 27, conditionCode: 'sunny', rainProb: 5 },
  { time: '14:00', temp: 29, conditionCode: 'cloudy', rainProb: 10 },
  { time: '16:00', temp: 28, conditionCode: 'cloudy', rainProb: 15 },
  { time: '18:00', temp: 26, conditionCode: 'cloudy', rainProb: 15 },
  { time: '20:00', temp: 23, conditionCode: 'cloudy', rainProb: 10 },
  { time: '22:00', temp: 22, conditionCode: 'cloudy', rainProb: 5 },
  { time: '00:00', temp: 20, conditionCode: 'cloudy', rainProb: 5 },
  { time: '02:00', temp: 19, conditionCode: 'rainy', rainProb: 40 },
  { time: '04:00', temp: 18, conditionCode: 'rainy', rainProb: 85 },
  { time: '06:00', temp: 18, conditionCode: 'rainy', rainProb: 90 },
  { time: '08:00', temp: 21, conditionCode: 'storm', rainProb: 95 },
];

export const defaultWeeklyForecast: ForecastDay[] = [
  { day: 'Today', tempMin: 18, tempMax: 29, condition: 'Partly Cloudy', conditionCode: 'cloudy', rainProb: 15 },
  { day: 'Sunday', tempMin: 17, tempMax: 21, condition: 'Heavy Rain / Storm', conditionCode: 'storm', rainProb: 95 },
  { day: 'Monday', tempMin: 16, tempMax: 22, condition: 'Light Showers', conditionCode: 'rainy', rainProb: 70 },
  { day: 'Tuesday', tempMin: 18, tempMax: 25, condition: 'Cloudy with Sun', conditionCode: 'cloudy', rainProb: 20 },
  { day: 'Wednesday', tempMin: 19, tempMax: 28, condition: 'Clear Skies', conditionCode: 'sunny', rainProb: 0 },
  { day: 'Thursday', tempMin: 20, tempMax: 29, condition: 'Sunny & Hot', conditionCode: 'sunny', rainProb: 0 },
  { day: 'Friday', tempMin: 18, tempMax: 27, condition: 'Partly Cloudy', conditionCode: 'cloudy', rainProb: 10 },
];

export const initialEnergy: EnergyData = {
  solarGeneration: 4.8,
  batteryPercentage: 86,
  powerConsumption: 1.6,
  history: [
    { time: '08:00', solar: 1.2, battery: 78, consumption: 0.8 },
    { time: '10:00', solar: 2.8, battery: 81, consumption: 1.1 },
    { time: '12:00', solar: 5.6, battery: 85, consumption: 1.4 },
    { time: '14:00', solar: 6.2, battery: 92, consumption: 1.5 },
    { time: '16:00', solar: 4.8, battery: 95, consumption: 1.6 },
    { time: '18:00', solar: 1.5, battery: 93, consumption: 1.8 },
    { time: '20:00', solar: 0.0, battery: 88, consumption: 2.1 },
    { time: '22:00', solar: 0.0, battery: 86, consumption: 1.6 },
  ]
};

export const initialNotifications: NotificationItem[] = [
  {
    id: 'n-1',
    title: 'Soil Moisture Warning',
    message: 'Soil moisture is critical at 22%. Root development may slow down.',
    type: 'warning',
    time: '2 mins ago',
    read: false
  },
  {
    id: 'n-2',
    title: 'Pre-Storm Alert',
    message: 'Heavy rain (>80% probability) and lightning predicted tomorrow. Ensure auto ventilation mode is enabled.',
    type: 'alert',
    time: '1 hour ago',
    read: false
  },
  {
    id: 'n-3',
    title: 'Solar System Status',
    message: 'Battery banks charged past 85%. Eco energy routing initiated.',
    type: 'success',
    time: '3 hours ago',
    read: true
  }
];

export const initialRecommendations: AIRecommendation[] = [
  {
    id: 'rec-1',
    trigger: 'Low Soil Moisture',
    recommendation: 'Start Drip Irrigation',
    reason: 'Soil moisture (22%) is below optimal agriculture threshold (30%).',
    targetDevice: 'irrigation',
    suggestedState: 'ON',
    implemented: false
  },
  {
    id: 'rec-2',
    trigger: 'Upcoming Storm',
    recommendation: 'Enable Storm Safeguard Modes',
    reason: 'Heavy rain probability is 95% tomorrow. Shutter windows to avoid crop flooding.',
    targetDevice: 'window-controller',
    suggestedState: 'OFF',
    implemented: false
  },
  {
    id: 'rec-3',
    trigger: 'Low Light Threshold',
    recommendation: 'Initiate Auxiliary Grow Lighting',
    reason: 'Light intensity drops during evening; crops require supplemental photo-periods.',
    targetDevice: 'grow-light',
    suggestedState: 'ON',
    implemented: true
  }
];
