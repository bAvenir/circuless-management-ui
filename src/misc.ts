interface ItemType {
  id: string
  title: string
  icon: string
  color: string
}

interface MIMEType {
  icon: string
  values: string[]
}

interface PropUnitDataType {
  name?: string
  symbol?: string
}

const sensor = '#62b4c1'
const heatingSensor = '#3d909c'
const boilerSensor = '#296068'
const pv = '#143034'
const actuator = '#8DA572'
const agri = '#F5DEB3'

export const itemTypes: ItemType[] = [
  {
    id: 'unknown',
    title: '',
    icon: 'fa fa-question',
    color: '#f4ad09',
  },
  {
    id: 'device',
    title: 'Device',
    icon: 'fa fa-rss',
    color: '#00B6EB',
  },
  {
    id: 'device-type',
    title: 'DeviceType',
    icon: 'fa fa-rss',
    color: '#00B6EB',
  },
  {
    id: 'service',
    title: 'Service',
    icon: 'fa fa-cloud',
    color: '#E5B38E',
  },
  {
    id: 'dataset',
    title: 'Dataset',
    icon: 'fa fa-file-lines',
    color: '#979797',
  },
  {
    id: 'sensor',
    title: 'Sensor',
    icon: 'fa fa-gauge-simple-high',
    color: sensor,
  },
  {
    id: 'qr-generator-sensor',
    title: 'QRGeneratorSensor',
    icon: 'fa fa-qrcode',
    color: sensor,
  },
  {
    id: 'person-counter-sensor',
    title: 'PersonCounterSensor',
    icon: 'fa fa-stopwatch-20',
    color: sensor,
  },
  {
    id: 'flood-sensor',
    title: 'FloodSensor',
    icon: 'fa fa-droplet',
    color: sensor,
  },
  {
    id: 'energy-monitor',
    title: 'EnergyMonitor',
    icon: 'fa fa-bolt',
    color: sensor,
  },
  {
    id: 'motion-sensor',
    title: 'MotionSensor',
    icon: 'fa fa-person-walking',
    color: sensor,
  },
  {
    id: 'humidity-sensor',
    title: 'HumiditySensor',
    icon: 'fa fa-droplet',
    color: sensor,
  },
  {
    id: 'thermometer',
    title: 'Thermometer',
    icon: 'fa fa-temperature-three-quarters',
    color: sensor,
  },
  {
    id: 'gps-emergency-button',
    title: 'GPSEmergencyButton',
    icon: 'fa fa-truck-medical',
    color: sensor,
  },
  {
    id: 'water-amr-sensor',
    title: 'WaterAMRSensor',
    icon: 'fa fa-droplet',
    color: sensor,
  },
  {
    id: 'accelerometer',
    title: 'Accelerometer',
    icon: 'fa fa-gauge-simple-high',
    color: sensor,
  },
  {
    id: 'pressure-sensor',
    title: 'PressureSensor',
    icon: 'fa fa-gauge-simple-high',
    color: sensor,
  },
  {
    id: 'sound-sensor',
    title: 'SoundSensor',
    icon: 'fa fa-volume-low',
    color: sensor,
  },
  {
    id: 'ultrasound-sensor',
    title: 'UltrasoundSensor',
    icon: 'fa fa-volume-low',
    color: sensor,
  },
  {
    id: 'monitoring-sensor',
    title: 'MonitoringSensor',
    icon: 'fa fa-eye',
    color: sensor,
  },
  {
    id: 'weather-sensor',
    title: 'WeatherSensor',
    icon: 'fa fa-sun',
    color: sensor,
  },
  {
    id: 'weather-station',
    title: 'WeatherStation',
    icon: 'fa fa-sun',
    color: sensor,
  },
  {
    id: 'waste-bin-sensor',
    title: 'WasteBinSensor',
    icon: 'fa fa-trash-can',
    color: sensor,
  },
  {
    id: 'soil-moisture-sensor',
    title: 'SoilMoistureSEnsor',
    icon: 'fa fa-droplet',
    color: sensor,
  },
  {
    id: 'light-bulb',
    title: 'LightBulb',
    icon: 'fa fa-lightbulb',
    color: sensor,
  },
  {
    id: 'light-switch',
    title: 'LightSwitch',
    icon: 'fa fa-lightbulb',
    color: sensor,
  },
  {
    id: 'air-quality-sensor',
    title: 'AirQualitySensor',
    icon: 'fa fa-wind',
    color: sensor,
  },
  {
    id: 'presence-sensor',
    title: 'Presence_Sensor',
    icon: 'fa fa-person-walking',
    color: sensor,
  },
  {
    id: 'smart-plug',
    title: 'SmartPlug',
    icon: 'fa fa-plug',
    color: sensor,
  },
  {
    id: 'battery-sensor',
    title: 'BatterySensor',
    icon: 'fa fa-battery-three-quarters',
    color: sensor,
  },
  {
    id: 'heating-sensor',
    title: 'HeatingSensor',
    icon: 'fa fa-temperature-three-quarters',
    color: heatingSensor,
  },
  {
    id: 'cooling-sensor',
    title: 'CoolingSensor',
    icon: 'fa fa-snowflake',
    color: heatingSensor,
  },
  {
    id: 'air-conditionning-basic',
    title: 'AirConditionningBasic',
    icon: 'fa fa-snowflake',
    color: heatingSensor,
  },
  {
    id: 'heat-pump-air-to-water',
    title: 'HeatPumpAirtoWater',
    icon: 'fa fa-droplet',
    color: heatingSensor,
  },
  {
    id: 'heat-pump-air-to-air',
    title: 'HeatPumpAirtoAir',
    icon: 'fa fa-wind',
    color: heatingSensor,
  },
  {
    id: 'boiler-sensor',
    title: 'BoilerSensor',
    icon: 'fa fa-fire-flame-simple',
    color: boilerSensor,
  },
  {
    id: 'boiler-oil',
    title: 'BoilerOil',
    icon: 'fa fa-oil-can',
    color: boilerSensor,
  },
  {
    id: 'boiler-n-gas',
    title: 'BoilerNgas',
    icon: 'fa fa-fire-flame-simple',
    color: boilerSensor,
  },
  {
    id: 'boiler-biomass',
    title: 'BoilerBiomass',
    icon: 'fa fa-tree',
    color: boilerSensor,
  },
  {
    id: 'pv',
    title: 'PV',
    icon: 'fa fa-solar-panel',
    color: pv,
  },
  {
    id: 'pv-ground',
    title: 'PVGround',
    icon: 'fa fa-solar-panel',
    color: pv,
  },
  {
    id: 'pv-roof-stanled',
    title: 'PVRoofStanled',
    icon: 'fa fa-solar-panel',
    color: pv,
  },
  {
    id: 'pv-roof-flat',
    title: 'PVRoofFlat',
    icon: 'fa fa-solar-panel',
    color: pv,
  },
  {
    id: 'pv-facade',
    title: 'PVFaçade',
    icon: 'fa fa-solar-panel',
    color: pv,
  },
  {
    id: 'pv-b-integrated',
    title: 'PVBIntegrated',
    icon: 'fa fa-solar-panel',
    color: pv,
  },
  {
    id: 'actuator',
    title: 'Actuator',
    icon: 'fa fa-power-off',
    color: actuator,
  },
  {
    id: 'water-valve-actuator',
    title: 'WaterValveActuator',
    icon: 'fa fa-faucet-drip',
    color: actuator,
  },
  {
    id: 'switch',
    title: 'Switch',
    icon: 'fa fa-toggle-on',
    color: actuator,
  },
  {
    id: 'relay',
    title: 'Relay',
    icon: 'fa fa-power-off',
    color: actuator,
  },
  {
    id: 'smart-valve',
    title: 'SmartValve',
    icon: 'fa fa-faucet-drip',
    color: actuator,
  },
  {
    id: 'crop',
    title: 'Crop',
    icon: 'fa fa-wheat-awn',
    color: agri,
  },
  {
    id: 'animal',
    title: 'Animal',
    icon: 'fa fa-cow',
    color: agri,
  },
]

export const propDataTypes: PropUnitDataType[] = [
  {
    name: 'number',
    symbol: '123',
  },
  {
    name: 'integer',
    symbol: 'int',
  },
  {
    name: 'boolean',
    symbol: 'bool',
  },
  {
    name: 'string',
    symbol: 'abc',
  },
  {
    name: 'object',
    symbol: '{}',
  },
  {
    name: 'array',
    symbol: '[]',
  },
]

export const mimeTypes: Record<string, MIMEType> = {
  image: {
    icon: 'fa fa-image',
    values: [
      'image/*',
      'image/avif',
      'image/bmp',
      'image/cgm',
      'image/gif',
      'image/jpeg',
      'image/png',
      'image/svg+xml',
      'image/tiff',
      'image/vnd.djvu',
      'image/vnd.microsoft.icon',
      'image/webp',
    ],
  },
  video: {
    icon: 'fa fa-video',
    values: [
      'video/*',
      'video/3gpp',
      'video/3gpp2',
      'video/mp2t',
      'video/mp4',
      'video/mpeg',
      'video/ogg',
      'video/webm',
      'video/x-flv',
      'video/x-msvideo',
    ],
  },
  audio: {
    icon: 'fa fa-volume-high',
    values: [
      'audio/*',
      'audio/3gpp',
      'audio/3gpp2',
      'audio/aac',
      'audio/midi',
      'audio/mpeg',
      'audio/ogg',
      'audio/opus',
      'audio/wav',
      'audio/webm',
      'audio/x-midi',
    ],
  },
  font: {
    icon: 'fa fa-font',
    values: ['font/*', 'font/otf', 'font/ttf', 'font/woff', 'font/woff2'],
  },
  text: {
    icon: 'fa fa-file-lines',
    values: ['text/*', 'text/calendar', 'text/css', 'text/csv', 'text/html', 'text/javascript', 'text/plain', 'text/xml'],
  },
  application: {
    icon: 'fa fa-file-code',
    values: [
      'application/*',
      'application/atom+xml',
      'application/ecmascript',
      'application/epub+zip',
      'application/gzip',
      'application/java-archive',
      'application/javascript',
      'application/json',
      'application/ld+json',
      'application/msword',
      'application/octet-stream',
      'application/ogg',
      'application/pdf',
      'application/rtf',
      'application/vnd.amazon.ebook',
      'application/vnd.apple.installer+xml',
      'application/vnd.google-earth.kml+xml',
      'application/vnd.google-earth.kmz',
      'application/vnd.mozilla.xul+xml',
      'application/vnd.ms-excel',
      'application/vnd.ms-fontobject',
      'application/vnd.ms-powerpoint',
      'application/vnd.oasis.opendocument.presentation',
      'application/vnd.oasis.opendocument.spreadsheet',
      'application/vnd.oasis.opendocument.text',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.rar',
      'application/vnd.visio',
      'application/x-7z-compressed',
      'application/x-abiword',
      'application/x-bzip',
      'application/x-bzip2',
      'application/x-csh',
      'application/x-font-ttf',
      'application/x-freearc',
      'application/x-httpd-php',
      'application/x-iso9660-image',
      'application/x-pkcs12',
      'application/x-sh',
      'application/x-shockwave-flash',
      'application/x-tar',
      'application/xhtml+xml',
      'application/xml',
      'application/zip',
    ],
  },
}
