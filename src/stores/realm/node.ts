import type { Realm } from '@prisma/client'
import type { nodeTypes, itemTypes } from '~/shared/types'
import type { ItemTD } from '@bavenir/spade-node-js-client'

export const useRealmNodeStore = defineStore('realmNodeStore', {
  state: () => ({
    allMy: undefined as nodeTypes.GetAllMyRealm | undefined,
    my: undefined as nodeTypes.GetMyRealm | undefined,
    myItems: undefined as ItemTD[] | undefined,
    myItem: undefined as itemTypes.ItemWithOrganisation | undefined,
    loading: false,
  }),
  actions: {
    async getMy(id: string, realm: Realm) {
      try {
        this.loading = true
        const node = await api.node.realm.getMy(id, realm)
        this.my = node
        return node
      } finally {
        this.loading = false
      }
    },

    async getAllMy(realm: Realm) {
      try {
        this.loading = true
        const nodes = await api.node.realm.getAllMy(realm)
        this.allMy = nodes
        return nodes
      } finally {
        this.loading = false
      }
    },

    async getMyItems() {
      try {
        this.loading = true
        const items = await Promise.resolve(mockItems)
        this.myItems = items
        return items
      } finally {
        this.loading = false
      }
    },

    async getMyItem(id: string, realm: Realm) {
      try {
        this.loading = true
        const item: itemTypes.ItemWithOrganisation | undefined = await Promise.resolve(mockItems.find((item) => item.id === id))
        const orgId = item?.['SPADE:organisation']?.['@id']
        if (orgId) {
          item.organisation = await api.organisation.realm.get(orgId.replace('urn:organisation:', ''), realm)
        }
        this.myItem = item
        return item
      } finally {
        this.loading = false
      }
    },
  },
})

const mockItems = [
  {
    id: 'aa776893-a513-4a60-b499-915201139109',
    oid: 'urn:item:82a4a6b3-3692-4112-add1-433d79b598ab:aa776893-a513-4a60-b499-915201139109',
    base: 'https://venus.bavenir.eu/',
    '@type': ['dcmi:Dataset'],
    links: [
      {
        rel: 'external',
        href: 'https://zenodo.org/records/8287792',
      },
    ],
    title: 'UAV laser scanning benchmark',
    '@context': [
      'https://www.w3.org/2019/wot/td/v1',
      {
        dcmi: 'http://purl.org/dc/dcmitype/',
      },
    ],
    security: ['Bearer'],
    adapterId: '6109e577-5939-4290-870a-b078706e7920',
    'SPADE:node': {
      '@id': 'urn:node:82a4a6b3-3692-4112-add1-433d79b598ab',
    },
    'dct:creator': 'Puliti Stefano; Pearse Grant; Surový Peter; Wallace Luke; Hollaus Markus; Wielgosz Maciej; Astrup Rasmus',
    'dct:license': 'https://creativecommons.org/licenses/by/4.0/legalcode',
    description:
      'The challenge of accurately segmenting individual trees from laser scanning data hinders the assessment of crucial tree parameters necessary for effective forest management, impacting many downstream applications. While dense laser scanning offers detailed 3D representations, automating the segmentation of trees and their structures from point clouds remains difficult. The lack of suitable benchmark datasets and reliance on small datasets have limited method development. The emergence of deep learning models exacerbates the need for standardized benchmarks. Addressing these gaps, the FOR-instance data represent a novel benchmarking dataset to enhance forest measurement using dense airborne laser scanning data, aiding researchers in advancing segmentation methods for forested 3D scenes.',
    registration: {
      created: '2024-12-10T13:28:01.915350Z',
      modified: '2025-01-20T12:35:56.036417Z',
    },
    'SPADE:Privacy': {
      Level: 2,
      Caption: 'Partners',
    },
    'dct:hasVersion': 'Version 1',
    'dct:licenseHolder': 'https://creativecommons.org',
    'SPADE:organisation': {
      '@id': 'cm8oiwy0n002lupay2760llne',
    },
    securityDefinitions: {
      Bearer: {
        in: 'header',
        alg: 'RS256',
        name: 'Bearer',
        format: 'jwt',
        scheme: 'bearer',
      },
    },
  },
  {
    id: '4b3ee47b-f9fa-49e9-8a3d-ca6e281c4797',
    oid: 'urn:item:82a4a6b3-3692-4112-add1-433d79b598ab:4b3ee47b-f9fa-49e9-8a3d-ca6e281c4797',
    base: 'https://venus.bavenir.eu/',
    '@type': ['adp:AirQualitySensor'],
    title: 'SHMU: Bratislava, Mamateyova',
    '@context': [
      'https://www.w3.org/2019/wot/td/v1',
      {
        om: 'http://www.ontology-of-units-of-measure.org/resource/om-2/',
        adp: 'https://auroral.iot.linkeddata.es/def/adapters/#',
        geo: 'http://www.w3.org/2003/01/geo/wgs84_pos#',
        saref: 'https://saref.etsi.org/core/',
        schema: 'http://schema.org/',
      },
    ],
    security: ['Bearer'],
    'SPADE:node': {
      '@id': 'urn:node:82a4a6b3-3692-4112-add1-433d79b598ab',
    },
    properties: {
      NO2: {
        '@id': 'urn:property:82a4a6b3-3692-4112-add1-433d79b598ab:4b3ee47b-f9fa-49e9-8a3d-ca6e281c4797:NO2',
        type: 'object',
        unit: 'om:microgramPerCubicMetre',
        '@type': 'adp:NO2Concentration',
        forms: [
          {
            op: 'readproperty',
            href: 'https://venus.bavenir.eu/nb/consumption/properties/4b3ee47b-f9fa-49e9-8a3d-ca6e281c4797/NO2',
            response: {
              contentType: 'application/json',
            },
            'htv:methodName': 'GET',
          },
        ],
        title: 'NO2',
        readOnly: true,
        security: 'Bearer',
        description: 'Nitrogen Dioxide, a reddish-brown gas with a characteristic sharp, biting odor, measured in concentrations outside in air',
        uriVariables: {},
      },
      NOX: {
        '@id': 'urn:property:82a4a6b3-3692-4112-add1-433d79b598ab:4b3ee47b-f9fa-49e9-8a3d-ca6e281c4797:NOX',
        type: 'object',
        unit: 'om:microgramPerCubicMetre',
        '@type': 'saref:Property',
        forms: [
          {
            op: 'readproperty',
            href: 'https://venus.bavenir.eu/nb/consumption/properties/4b3ee47b-f9fa-49e9-8a3d-ca6e281c4797/NOX',
            response: {
              contentType: 'application/json',
            },
            'htv:methodName': 'GET',
          },
        ],
        title: 'NOX',
        readOnly: true,
        security: 'Bearer',
        description: 'Nitrogen Oxides, a group of gases that are composed of nitrogen and oxygen, measured in concentrations outside in air',
        uriVariables: {},
      },
      SO2: {
        '@id': 'urn:property:82a4a6b3-3692-4112-add1-433d79b598ab:4b3ee47b-f9fa-49e9-8a3d-ca6e281c4797:SO2',
        type: 'object',
        unit: 'om:microgramPerCubicMetre',
        '@type': 'adp:SO2Concentration',
        forms: [
          {
            op: 'readproperty',
            href: 'https://venus.bavenir.eu/nb/consumption/properties/4b3ee47b-f9fa-49e9-8a3d-ca6e281c4797/SO2',
            response: {
              contentType: 'application/json',
            },
            'htv:methodName': 'GET',
          },
        ],
        title: 'SO2',
        readOnly: true,
        security: 'Bearer',
        description: 'Sulfur Dioxide, a toxic gas with a pungent, irritating smell, measured in concentrations outside in air',
        uriVariables: {},
      },
      PM10: {
        '@id': 'urn:property:82a4a6b3-3692-4112-add1-433d79b598ab:4b3ee47b-f9fa-49e9-8a3d-ca6e281c4797:PM10',
        type: 'object',
        unit: 'om:microgramPerCubicMetre',
        '@type': 'adp:PM10Concentration',
        forms: [
          {
            op: 'readproperty',
            href: 'https://venus.bavenir.eu/nb/consumption/properties/4b3ee47b-f9fa-49e9-8a3d-ca6e281c4797/PM10',
            response: {
              contentType: 'application/json',
            },
            'htv:methodName': 'GET',
          },
        ],
        title: 'PM10',
        readOnly: true,
        security: 'Bearer',
        description:
          'Particulate Matter <10µm, tiny particles or droplets in the air that are 10 micrometers or less in diameter, measured in concentrations outside in air',
        uriVariables: {},
      },
      'PM2.5': {
        '@id': 'urn:property:82a4a6b3-3692-4112-add1-433d79b598ab:4b3ee47b-f9fa-49e9-8a3d-ca6e281c4797:PM2.5',
        type: 'object',
        unit: 'om:microgramPerCubicMetre',
        '@type': 'adp:PM2_5Concentration',
        forms: [
          {
            op: 'readproperty',
            href: 'https://venus.bavenir.eu/nb/consumption/properties/4b3ee47b-f9fa-49e9-8a3d-ca6e281c4797/PM2.5',
            response: {
              contentType: 'application/json',
            },
            'htv:methodName': 'GET',
          },
        ],
        title: 'PM2.5',
        readOnly: true,
        security: 'Bearer',
        description:
          'Particulate Matter <2.5µm, fine inhalable particles, with diameters that are generally 2.5 micrometers and smaller, measured in concentrations outside in air',
        uriVariables: {},
      },
    },
    description: 'This is representation of the station data from SHMU, located in Slovakia - SHMU: Bratislava, Mamateyova.',
    'geo:location': {
      'geo:lat': '48.125',
      'geo:long': '17.125556',
    },
    registration: {
      created: '2024-09-26T13:10:56.712559Z',
      modified: '2025-01-20T12:35:56.782962Z',
    },
    'SPADE:Privacy': {
      Level: 2,
      Caption: 'Partners',
    },
    'schema:identifier': 'SHMU_99111',
    'SPADE:organisation': {
      '@id': 'cm8oiwy0n002lupay2760llne',
    },
    securityDefinitions: {
      Bearer: {
        in: 'header',
        alg: 'RS256',
        name: 'Bearer',
        format: 'jwt',
        scheme: 'bearer',
      },
    },
  },
  {
    id: 'cd9d788f-d816-4c51-9319-0feaa9307914',
    oid: 'urn:item:82a4a6b3-3692-4112-add1-433d79b598ab:cd9d788f-d816-4c51-9319-0feaa9307914',
    base: 'https://venus.bavenir.eu/',
    '@type': ['adp:AirQualitySensor'],
    title: 'SHMU: Bratislava, Jeséniova',
    '@context': [
      'https://www.w3.org/2019/wot/td/v1',
      {
        om: 'http://www.ontology-of-units-of-measure.org/resource/om-2/',
        adp: 'https://auroral.iot.linkeddata.es/def/adapters/#',
        geo: 'http://www.w3.org/2003/01/geo/wgs84_pos#',
        saref: 'https://saref.etsi.org/core/',
        schema: 'http://schema.org/',
      },
    ],
    security: ['Bearer'],
    'SPADE:node': {
      '@id': 'urn:node:82a4a6b3-3692-4112-add1-433d79b598ab',
    },
    properties: {
      NO2: {
        '@id': 'urn:property:82a4a6b3-3692-4112-add1-433d79b598ab:cd9d788f-d816-4c51-9319-0feaa9307914:NO2',
        type: 'object',
        unit: 'om:microgramPerCubicMetre',
        '@type': 'adp:NO2Concentration',
        forms: [
          {
            op: 'readproperty',
            href: 'https://venus.bavenir.eu/nb/consumption/properties/cd9d788f-d816-4c51-9319-0feaa9307914/NO2{?tsini,tsend}',
            response: {
              contentType: 'application/json',
            },
            'htv:methodName': 'GET',
          },
        ],
        title: 'NO2',
        readOnly: true,
        security: 'Bearer',
        description: 'Nitrogen Dioxide, a reddish-brown gas with a characteristic sharp, biting odor, measured in concentrations outside in air',
        uriVariables: {
          tsend: {},
          tsini: {},
        },
      },
      NOX: {
        '@id': 'urn:property:82a4a6b3-3692-4112-add1-433d79b598ab:cd9d788f-d816-4c51-9319-0feaa9307914:NOX',
        type: 'object',
        unit: 'om:microgramPerCubicMetre',
        '@type': 'saref:Property',
        forms: [
          {
            op: 'readproperty',
            href: 'https://venus.bavenir.eu/nb/consumption/properties/cd9d788f-d816-4c51-9319-0feaa9307914/NOX',
            response: {
              contentType: 'application/json',
            },
            'htv:methodName': 'GET',
          },
        ],
        title: 'NOX',
        readOnly: true,
        security: 'Bearer',
        description: 'Nitrogen Oxides, a group of gases that are composed of nitrogen and oxygen, measured in concentrations outside in air',
        uriVariables: {},
      },
      SO2: {
        '@id': 'urn:property:82a4a6b3-3692-4112-add1-433d79b598ab:cd9d788f-d816-4c51-9319-0feaa9307914:SO2',
        type: 'object',
        unit: 'om:microgramPerCubicMetre',
        '@type': 'adp:SO2Concentration',
        forms: [
          {
            op: 'readproperty',
            href: 'https://venus.bavenir.eu/nb/consumption/properties/cd9d788f-d816-4c51-9319-0feaa9307914/SO2',
            response: {
              contentType: 'application/json',
            },
            'htv:methodName': 'GET',
          },
        ],
        title: 'SO2',
        readOnly: true,
        security: 'Bearer',
        description: 'Sulfur Dioxide, a toxic gas with a pungent, irritating smell, measured in concentrations outside in air',
        uriVariables: {},
      },
      PM10: {
        '@id': 'urn:property:82a4a6b3-3692-4112-add1-433d79b598ab:cd9d788f-d816-4c51-9319-0feaa9307914:PM10',
        type: 'object',
        unit: 'om:microgramPerCubicMetre',
        '@type': 'adp:PM10Concentration',
        forms: [
          {
            op: 'readproperty',
            href: 'https://venus.bavenir.eu/nb/consumption/properties/cd9d788f-d816-4c51-9319-0feaa9307914/PM10',
            response: {
              contentType: 'application/json',
            },
            'htv:methodName': 'GET',
          },
        ],
        title: 'PM10',
        readOnly: true,
        security: 'Bearer',
        description:
          'Particulate Matter <10µm, tiny particles or droplets in the air that are 10 micrometers or less in diameter, measured in concentrations outside in air',
        uriVariables: {},
      },
      'PM2.5': {
        '@id': 'urn:property:82a4a6b3-3692-4112-add1-433d79b598ab:cd9d788f-d816-4c51-9319-0feaa9307914:PM2.5',
        type: 'object',
        unit: 'om:microgramPerCubicMetre',
        '@type': 'adp:PM2_5Concentration',
        forms: [
          {
            op: 'readproperty',
            href: 'https://venus.bavenir.eu/nb/consumption/properties/cd9d788f-d816-4c51-9319-0feaa9307914/PM2.5',
            response: {
              contentType: 'application/json',
            },
            'htv:methodName': 'GET',
          },
        ],
        title: 'PM2.5',
        readOnly: true,
        security: 'Bearer',
        description:
          'Particulate Matter <2.5µm, fine inhalable particles, with diameters that are generally 2.5 micrometers and smaller, measured in concentrations outside in air',
        uriVariables: {},
      },
    },
    description: 'This is representation of the station data from SHMU, located in Slovakia - SHMU: Bratislava, Jeséniova.',
    'geo:location': {
      'geo:lat': '48.168056',
      'geo:long': '17.106111',
    },
    registration: {
      created: '2024-09-26T13:10:56.618195Z',
      modified: '2025-01-20T12:35:56.242996Z',
    },
    'SPADE:Privacy': {
      Level: 2,
      Caption: 'Partners',
    },
    'schema:identifier': 'SHMU_11813',
    'SPADE:organisation': {
      '@id': 'cm8oiwy0n002lupay2760llne',
    },
    securityDefinitions: {
      Bearer: {
        in: 'header',
        alg: 'RS256',
        name: 'Bearer',
        format: 'jwt',
        scheme: 'bearer',
      },
    },
  },
  {
    id: '6e36e5d0-d6fa-4668-95c9-26d4602ee356',
    oid: 'urn:item:82a4a6b3-3692-4112-add1-433d79b598ab:6e36e5d0-d6fa-4668-95c9-26d4602ee356',
    base: 'https://venus.bavenir.eu/',
    '@type': ['adp:AirQualitySensor'],
    title: 'SHMU: Rovinka, mobilná AMS',
    '@context': [
      'https://www.w3.org/2019/wot/td/v1',
      {
        om: 'http://www.ontology-of-units-of-measure.org/resource/om-2/',
        adp: 'https://auroral.iot.linkeddata.es/def/adapters/#',
        geo: 'http://www.w3.org/2003/01/geo/wgs84_pos#',
        saref: 'https://saref.etsi.org/core/',
        schema: 'http://schema.org/',
      },
    ],
    security: ['Bearer'],
    'SPADE:node': {
      '@id': 'urn:node:82a4a6b3-3692-4112-add1-433d79b598ab',
    },
    properties: {
      CO: {
        '@id': 'urn:property:82a4a6b3-3692-4112-add1-433d79b598ab:6e36e5d0-d6fa-4668-95c9-26d4602ee356:CO',
        type: 'object',
        unit: 'om:microgramPerCubicMetre',
        '@type': 'adp:COConcentration',
        forms: [
          {
            op: 'readproperty',
            href: 'https://venus.bavenir.eu/nb/consumption/properties/6e36e5d0-d6fa-4668-95c9-26d4602ee356/CO',
            response: {
              contentType: 'application/json',
            },
            'htv:methodName': 'GET',
          },
        ],
        title: 'CO',
        readOnly: true,
        security: 'Bearer',
        description:
          'Carbon Monoxide, a colorless, odorless, and tasteless gas that is slightly less dense than air, measured in concentrations outside in air',
        uriVariables: {},
      },
      BZN: {
        '@id': 'urn:property:82a4a6b3-3692-4112-add1-433d79b598ab:6e36e5d0-d6fa-4668-95c9-26d4602ee356:BZN',
        type: 'object',
        unit: 'om:microgramPerCubicMetre',
        '@type': 'saref:Property',
        forms: [
          {
            op: 'readproperty',
            href: 'https://venus.bavenir.eu/nb/consumption/properties/6e36e5d0-d6fa-4668-95c9-26d4602ee356/BZN',
            response: {
              contentType: 'application/json',
            },
            'htv:methodName': 'GET',
          },
        ],
        title: 'BZN',
        readOnly: true,
        security: 'Bearer',
        description: 'Benzene, a colorless or light yellow liquid at room temperature with a sweet odor, measured in concentrations outside in air',
        uriVariables: {},
      },
      NO2: {
        '@id': 'urn:property:82a4a6b3-3692-4112-add1-433d79b598ab:6e36e5d0-d6fa-4668-95c9-26d4602ee356:NO2',
        type: 'object',
        unit: 'om:microgramPerCubicMetre',
        '@type': 'adp:NO2Concentration',
        forms: [
          {
            op: 'readproperty',
            href: 'https://venus.bavenir.eu/nb/consumption/properties/6e36e5d0-d6fa-4668-95c9-26d4602ee356/NO2',
            response: {
              contentType: 'application/json',
            },
            'htv:methodName': 'GET',
          },
        ],
        title: 'NO2',
        readOnly: true,
        security: 'Bearer',
        description: 'Nitrogen Dioxide, a reddish-brown gas with a characteristic sharp, biting odor, measured in concentrations outside in air',
        uriVariables: {},
      },
      NOX: {
        '@id': 'urn:property:82a4a6b3-3692-4112-add1-433d79b598ab:6e36e5d0-d6fa-4668-95c9-26d4602ee356:NOX',
        type: 'object',
        unit: 'om:microgramPerCubicMetre',
        '@type': 'saref:Property',
        forms: [
          {
            op: 'readproperty',
            href: 'https://venus.bavenir.eu/nb/consumption/properties/6e36e5d0-d6fa-4668-95c9-26d4602ee356/NOX',
            response: {
              contentType: 'application/json',
            },
            'htv:methodName': 'GET',
          },
        ],
        title: 'NOX',
        readOnly: true,
        security: 'Bearer',
        description: 'Nitrogen Oxides, a group of gases that are composed of nitrogen and oxygen, measured in concentrations outside in air',
        uriVariables: {},
      },
      SO2: {
        '@id': 'urn:property:82a4a6b3-3692-4112-add1-433d79b598ab:6e36e5d0-d6fa-4668-95c9-26d4602ee356:SO2',
        type: 'object',
        unit: 'om:microgramPerCubicMetre',
        '@type': 'adp:SO2Concentration',
        forms: [
          {
            op: 'readproperty',
            href: 'https://venus.bavenir.eu/nb/consumption/properties/6e36e5d0-d6fa-4668-95c9-26d4602ee356/SO2',
            response: {
              contentType: 'application/json',
            },
            'htv:methodName': 'GET',
          },
        ],
        title: 'SO2',
        readOnly: true,
        security: 'Bearer',
        description: 'Sulfur Dioxide, a toxic gas with a pungent, irritating smell, measured in concentrations outside in air',
        uriVariables: {},
      },
      PM10: {
        '@id': 'urn:property:82a4a6b3-3692-4112-add1-433d79b598ab:6e36e5d0-d6fa-4668-95c9-26d4602ee356:PM10',
        type: 'object',
        unit: 'om:microgramPerCubicMetre',
        '@type': 'adp:PM10Concentration',
        forms: [
          {
            op: 'readproperty',
            href: 'https://venus.bavenir.eu/nb/consumption/properties/6e36e5d0-d6fa-4668-95c9-26d4602ee356/PM10',
            response: {
              contentType: 'application/json',
            },
            'htv:methodName': 'GET',
          },
        ],
        title: 'PM10',
        readOnly: true,
        security: 'Bearer',
        description:
          'Particulate Matter <10µm, tiny particles or droplets in the air that are 10 micrometers or less in diameter, measured in concentrations outside in air',
        uriVariables: {},
      },
    },
    description: 'This is representation of the station data from SHMU, located in Slovakia - SHMU: Rovinka, mobilná AMS.',
    'geo:location': {
      'geo:lat': '48.099754',
      'geo:long': '17.231278',
    },
    registration: {
      created: '2024-09-26T13:10:56.932980Z',
      modified: '2025-01-20T12:35:56.282625Z',
    },
    'SPADE:Privacy': {
      Level: 2,
      Caption: 'Partners',
    },
    'schema:identifier': 'SHMU_99801',
    'SPADE:organisation': {
      '@id': 'cm8oiwy0n002lupay2760llne',
    },
    securityDefinitions: {
      Bearer: {
        in: 'header',
        alg: 'RS256',
        name: 'Bearer',
        format: 'jwt',
        scheme: 'bearer',
      },
    },
  },
  {
    id: '4d89c2b9-f971-4a9d-98b5-239b4fbecee9',
    oid: 'urn:item:82a4a6b3-3692-4112-add1-433d79b598ab:4d89c2b9-f971-4a9d-98b5-239b4fbecee9',
    base: 'https://venus.bavenir.eu/',
    '@type': 'Device',
    title: 'DroneTelemetryCatalog',
    '@context': [
      'https://www.w3.org/2019/wot/td/v1',
      {
        om: 'http://www.ontology-of-units-of-measure.org/resource/om-2/',
        adp: 'https://auroral.iot.linkeddata.es/def/adapters#',
        geo: 'http://www.w3.org/2003/01/geo/wgs84_pos#',
      },
    ],
    security: ['Bearer'],
    adapterId: 'dji-telemetry-catalog',
    'SPADE:node': {
      '@id': 'urn:node:82a4a6b3-3692-4112-add1-433d79b598ab',
    },
    properties: {
      catalog: {
        '@id': 'urn:property:82a4a6b3-3692-4112-add1-433d79b598ab:4d89c2b9-f971-4a9d-98b5-239b4fbecee9:catalog',
        type: 'object',
        forms: [
          {
            op: 'readproperty',
            href: 'https://venus.bavenir.eu/nb/consumption/properties/4d89c2b9-f971-4a9d-98b5-239b4fbecee9/catalog',
            response: {
              contentType: 'application/json',
            },
            'htv:methodName': 'GET',
          },
        ],
        title: 'catalog',
        readOnly: true,
        security: 'Bearer',
        description: 'catalog of gathered data',
        uriVariables: {},
      },
      telemetry: {
        '@id': 'urn:property:82a4a6b3-3692-4112-add1-433d79b598ab:4d89c2b9-f971-4a9d-98b5-239b4fbecee9:telemetry',
        type: 'object',
        forms: [
          {
            op: 'readproperty',
            href: 'https://venus.bavenir.eu/nb/consumption/properties/4d89c2b9-f971-4a9d-98b5-239b4fbecee9/telemetry{?flightId}',
            response: {
              contentType: 'application/json',
            },
            'htv:methodName': 'GET',
          },
        ],
        title: 'telemetry',
        readOnly: true,
        security: 'Bearer',
        description: 'Retrieve one telemetry data by id ',
        uriVariables: {
          flightId: {},
        },
      },
    },
    description: 'Catalog of converted DJI telemetry data files',
    'geo:location': {
      'geo:lat': '48.1516',
      'geo:long': '17.1674',
    },
    registration: {
      created: '2024-07-02T06:29:24.436897Z',
      modified: '2025-01-20T12:35:56.485474Z',
    },
    'SPADE:Privacy': {
      Level: 3,
      Caption: 'Public',
    },
    'SPADE:organisation': {
      '@id': 'cm8oiwy0n002lupay2760llne',
    },
    securityDefinitions: {
      Bearer: {
        in: 'header',
        alg: 'RS256',
        name: 'Bearer',
        format: 'jwt',
        scheme: 'bearer',
      },
    },
  },
  {
    id: '078a1bdf-2c2e-41be-b7d6-a30e33bce72c',
    oid: 'urn:item:82a4a6b3-3692-4112-add1-433d79b598ab:078a1bdf-2c2e-41be-b7d6-a30e33bce72c',
    base: 'https://venus.bavenir.eu/',
    '@type': ['adp:AirQualitySensor'],
    title: 'SHMU: Bratislava, Púchovská',
    '@context': [
      'https://www.w3.org/2019/wot/td/v1',
      {
        om: 'http://www.ontology-of-units-of-measure.org/resource/om-2/',
        adp: 'https://auroral.iot.linkeddata.es/def/adapters/#',
        geo: 'http://www.w3.org/2003/01/geo/wgs84_pos#',
        saref: 'https://saref.etsi.org/core/',
        schema: 'http://schema.org/',
      },
    ],
    security: ['Bearer'],
    'SPADE:node': {
      '@id': 'urn:node:82a4a6b3-3692-4112-add1-433d79b598ab',
    },
    properties: {
      CO: {
        '@id': 'urn:property:82a4a6b3-3692-4112-add1-433d79b598ab:078a1bdf-2c2e-41be-b7d6-a30e33bce72c:CO',
        type: 'object',
        unit: 'om:microgramPerCubicMetre',
        '@type': 'adp:COConcentration',
        forms: [
          {
            op: 'readproperty',
            href: 'https://venus.bavenir.eu/nb/consumption/properties/078a1bdf-2c2e-41be-b7d6-a30e33bce72c/CO',
            response: {
              contentType: 'application/json',
            },
            'htv:methodName': 'GET',
          },
        ],
        title: 'CO',
        readOnly: true,
        security: 'Bearer',
        description:
          'Carbon Monoxide, a colorless, odorless, and tasteless gas that is slightly less dense than air, measured in concentrations outside in air',
        uriVariables: {},
      },
      BZN: {
        '@id': 'urn:property:82a4a6b3-3692-4112-add1-433d79b598ab:078a1bdf-2c2e-41be-b7d6-a30e33bce72c:BZN',
        type: 'object',
        unit: 'om:microgramPerCubicMetre',
        '@type': 'saref:Property',
        forms: [
          {
            op: 'readproperty',
            href: 'https://venus.bavenir.eu/nb/consumption/properties/078a1bdf-2c2e-41be-b7d6-a30e33bce72c/BZN',
            response: {
              contentType: 'application/json',
            },
            'htv:methodName': 'GET',
          },
        ],
        title: 'BZN',
        readOnly: true,
        security: 'Bearer',
        description: 'Benzene, a colorless or light yellow liquid at room temperature with a sweet odor, measured in concentrations outside in air',
        uriVariables: {},
      },
      NO2: {
        '@id': 'urn:property:82a4a6b3-3692-4112-add1-433d79b598ab:078a1bdf-2c2e-41be-b7d6-a30e33bce72c:NO2',
        type: 'object',
        unit: 'om:microgramPerCubicMetre',
        '@type': 'adp:NO2Concentration',
        forms: [
          {
            op: 'readproperty',
            href: 'https://venus.bavenir.eu/nb/consumption/properties/078a1bdf-2c2e-41be-b7d6-a30e33bce72c/NO2',
            response: {
              contentType: 'application/json',
            },
            'htv:methodName': 'GET',
          },
        ],
        title: 'NO2',
        readOnly: true,
        security: 'Bearer',
        description: 'Nitrogen Dioxide, a reddish-brown gas with a characteristic sharp, biting odor, measured in concentrations outside in air',
        uriVariables: {},
      },
      NOX: {
        '@id': 'urn:property:82a4a6b3-3692-4112-add1-433d79b598ab:078a1bdf-2c2e-41be-b7d6-a30e33bce72c:NOX',
        type: 'object',
        unit: 'om:microgramPerCubicMetre',
        '@type': 'saref:Property',
        forms: [
          {
            op: 'readproperty',
            href: 'https://venus.bavenir.eu/nb/consumption/properties/078a1bdf-2c2e-41be-b7d6-a30e33bce72c/NOX',
            response: {
              contentType: 'application/json',
            },
            'htv:methodName': 'GET',
          },
        ],
        title: 'NOX',
        readOnly: true,
        security: 'Bearer',
        description: 'Nitrogen Oxides, a group of gases that are composed of nitrogen and oxygen, measured in concentrations outside in air',
        uriVariables: {},
      },
      SO2: {
        '@id': 'urn:property:82a4a6b3-3692-4112-add1-433d79b598ab:078a1bdf-2c2e-41be-b7d6-a30e33bce72c:SO2',
        type: 'object',
        unit: 'om:microgramPerCubicMetre',
        '@type': 'adp:SO2Concentration',
        forms: [
          {
            op: 'readproperty',
            href: 'https://venus.bavenir.eu/nb/consumption/properties/078a1bdf-2c2e-41be-b7d6-a30e33bce72c/SO2',
            response: {
              contentType: 'application/json',
            },
            'htv:methodName': 'GET',
          },
        ],
        title: 'SO2',
        readOnly: true,
        security: 'Bearer',
        description: 'Sulfur Dioxide, a toxic gas with a pungent, irritating smell, measured in concentrations outside in air',
        uriVariables: {},
      },
      PM10: {
        '@id': 'urn:property:82a4a6b3-3692-4112-add1-433d79b598ab:078a1bdf-2c2e-41be-b7d6-a30e33bce72c:PM10',
        type: 'object',
        unit: 'om:microgramPerCubicMetre',
        '@type': 'adp:PM10Concentration',
        forms: [
          {
            op: 'readproperty',
            href: 'https://venus.bavenir.eu/nb/consumption/properties/078a1bdf-2c2e-41be-b7d6-a30e33bce72c/PM10',
            response: {
              contentType: 'application/json',
            },
            'htv:methodName': 'GET',
          },
        ],
        title: 'PM10',
        readOnly: true,
        security: 'Bearer',
        description:
          'Particulate Matter <10µm, tiny particles or droplets in the air that are 10 micrometers or less in diameter, measured in concentrations outside in air',
        uriVariables: {},
      },
      'PM2.5': {
        '@id': 'urn:property:82a4a6b3-3692-4112-add1-433d79b598ab:078a1bdf-2c2e-41be-b7d6-a30e33bce72c:PM2.5',
        type: 'object',
        unit: 'om:microgramPerCubicMetre',
        '@type': 'adp:PM2_5Concentration',
        forms: [
          {
            op: 'readproperty',
            href: 'https://venus.bavenir.eu/nb/consumption/properties/078a1bdf-2c2e-41be-b7d6-a30e33bce72c/PM2.5',
            response: {
              contentType: 'application/json',
            },
            'htv:methodName': 'GET',
          },
        ],
        title: 'PM2.5',
        readOnly: true,
        security: 'Bearer',
        description:
          'Particulate Matter <2.5µm, fine inhalable particles, with diameters that are generally 2.5 micrometers and smaller, measured in concentrations outside in air',
        uriVariables: {},
      },
    },
    description: 'This is representation of the station data from SHMU, located in Slovakia - SHMU: Bratislava, Púchovská.',
    'geo:location': {
      'geo:lat': '48.21129',
      'geo:long': '17.157971',
    },
    registration: {
      created: '2024-09-26T13:10:56.816485Z',
      modified: '2025-01-20T12:35:56.710302Z',
    },
    'SPADE:Privacy': {
      Level: 2,
      Caption: 'Partners',
    },
    'schema:identifier': 'SHMU_99117',
    'SPADE:organisation': {
      '@id': 'cm8oiwy0n002lupay2760llne',
    },
    securityDefinitions: {
      Bearer: {
        in: 'header',
        alg: 'RS256',
        name: 'Bearer',
        format: 'jwt',
        scheme: 'bearer',
      },
    },
  },
  {
    id: '58500515-9e16-4144-964e-ae1f74766107',
    oid: 'urn:item:82a4a6b3-3692-4112-add1-433d79b598ab:58500515-9e16-4144-964e-ae1f74766107',
    base: 'https://venus.bavenir.eu/',
    '@type': ['adp:AirQualitySensor'],
    title: 'SHMU: Rovinka',
    '@context': [
      'https://www.w3.org/2019/wot/td/v1',
      {
        om: 'http://www.ontology-of-units-of-measure.org/resource/om-2/',
        adp: 'https://auroral.iot.linkeddata.es/def/adapters/#',
        geo: 'http://www.w3.org/2003/01/geo/wgs84_pos#',
        saref: 'https://saref.etsi.org/core/',
        schema: 'http://schema.org/',
      },
    ],
    security: ['Bearer'],
    'SPADE:node': {
      '@id': 'urn:node:82a4a6b3-3692-4112-add1-433d79b598ab',
    },
    properties: {
      CO: {
        '@id': 'urn:property:82a4a6b3-3692-4112-add1-433d79b598ab:58500515-9e16-4144-964e-ae1f74766107:CO',
        type: 'object',
        unit: 'om:microgramPerCubicMetre',
        '@type': 'adp:COConcentration',
        forms: [
          {
            op: 'readproperty',
            href: 'https://venus.bavenir.eu/nb/consumption/properties/58500515-9e16-4144-964e-ae1f74766107/CO',
            response: {
              contentType: 'application/json',
            },
            'htv:methodName': 'GET',
          },
        ],
        title: 'CO',
        readOnly: true,
        security: 'Bearer',
        description:
          'Carbon Monoxide, a colorless, odorless, and tasteless gas that is slightly less dense than air, measured in concentrations outside in air',
        uriVariables: {},
      },
      BZN: {
        '@id': 'urn:property:82a4a6b3-3692-4112-add1-433d79b598ab:58500515-9e16-4144-964e-ae1f74766107:BZN',
        type: 'object',
        unit: 'om:microgramPerCubicMetre',
        '@type': 'saref:Property',
        forms: [
          {
            op: 'readproperty',
            href: 'https://venus.bavenir.eu/nb/consumption/properties/58500515-9e16-4144-964e-ae1f74766107/BZN',
            response: {
              contentType: 'application/json',
            },
            'htv:methodName': 'GET',
          },
        ],
        title: 'BZN',
        readOnly: true,
        security: 'Bearer',
        description: 'Benzene, a colorless or light yellow liquid at room temperature with a sweet odor, measured in concentrations outside in air',
        uriVariables: {},
      },
      NO2: {
        '@id': 'urn:property:82a4a6b3-3692-4112-add1-433d79b598ab:58500515-9e16-4144-964e-ae1f74766107:NO2',
        type: 'object',
        unit: 'om:microgramPerCubicMetre',
        '@type': 'adp:NO2Concentration',
        forms: [
          {
            op: 'readproperty',
            href: 'https://venus.bavenir.eu/nb/consumption/properties/58500515-9e16-4144-964e-ae1f74766107/NO2',
            response: {
              contentType: 'application/json',
            },
            'htv:methodName': 'GET',
          },
        ],
        title: 'NO2',
        readOnly: true,
        security: 'Bearer',
        description: 'Nitrogen Dioxide, a reddish-brown gas with a characteristic sharp, biting odor, measured in concentrations outside in air',
        uriVariables: {},
      },
      NOX: {
        '@id': 'urn:property:82a4a6b3-3692-4112-add1-433d79b598ab:58500515-9e16-4144-964e-ae1f74766107:NOX',
        type: 'object',
        unit: 'om:microgramPerCubicMetre',
        '@type': 'saref:Property',
        forms: [
          {
            op: 'readproperty',
            href: 'https://venus.bavenir.eu/nb/consumption/properties/58500515-9e16-4144-964e-ae1f74766107/NOX',
            response: {
              contentType: 'application/json',
            },
            'htv:methodName': 'GET',
          },
        ],
        title: 'NOX',
        readOnly: true,
        security: 'Bearer',
        description: 'Nitrogen Oxides, a group of gases that are composed of nitrogen and oxygen, measured in concentrations outside in air',
        uriVariables: {},
      },
      SO2: {
        '@id': 'urn:property:82a4a6b3-3692-4112-add1-433d79b598ab:58500515-9e16-4144-964e-ae1f74766107:SO2',
        type: 'object',
        unit: 'om:microgramPerCubicMetre',
        '@type': 'adp:SO2Concentration',
        forms: [
          {
            op: 'readproperty',
            href: 'https://venus.bavenir.eu/nb/consumption/properties/58500515-9e16-4144-964e-ae1f74766107/SO2',
            response: {
              contentType: 'application/json',
            },
            'htv:methodName': 'GET',
          },
        ],
        title: 'SO2',
        readOnly: true,
        security: 'Bearer',
        description: 'Sulfur Dioxide, a toxic gas with a pungent, irritating smell, measured in concentrations outside in air',
        uriVariables: {},
      },
      PM10: {
        '@id': 'urn:property:82a4a6b3-3692-4112-add1-433d79b598ab:58500515-9e16-4144-964e-ae1f74766107:PM10',
        type: 'object',
        unit: 'om:microgramPerCubicMetre',
        '@type': 'adp:PM10Concentration',
        forms: [
          {
            op: 'readproperty',
            href: 'https://venus.bavenir.eu/nb/consumption/properties/58500515-9e16-4144-964e-ae1f74766107/PM10',
            response: {
              contentType: 'application/json',
            },
            'htv:methodName': 'GET',
          },
        ],
        title: 'PM10',
        readOnly: true,
        security: 'Bearer',
        description:
          'Particulate Matter <10µm, tiny particles or droplets in the air that are 10 micrometers or less in diameter, measured in concentrations outside in air',
        uriVariables: {},
      },
      'PM2.5': {
        '@id': 'urn:property:82a4a6b3-3692-4112-add1-433d79b598ab:58500515-9e16-4144-964e-ae1f74766107:PM2.5',
        type: 'object',
        unit: 'om:microgramPerCubicMetre',
        '@type': 'adp:PM2_5Concentration',
        forms: [
          {
            op: 'readproperty',
            href: 'https://venus.bavenir.eu/nb/consumption/properties/58500515-9e16-4144-964e-ae1f74766107/PM2.5',
            response: {
              contentType: 'application/json',
            },
            'htv:methodName': 'GET',
          },
        ],
        title: 'PM2.5',
        readOnly: true,
        security: 'Bearer',
        description:
          'Particulate Matter <2.5µm, fine inhalable particles, with diameters that are generally 2.5 micrometers and smaller, measured in concentrations outside in air',
        uriVariables: {},
      },
    },
    description: 'This is representation of the station data from SHMU, located in Slovakia - SHMU: Rovinka.',
    'geo:location': {
      'geo:lat': '48.101566',
      'geo:long': '17.226175',
    },
    registration: {
      created: '2024-09-26T13:10:57.111337Z',
      modified: '2025-01-20T12:35:56.086502Z',
    },
    'SPADE:Privacy': {
      Level: 2,
      Caption: 'Partners',
    },
    'schema:identifier': 'SHMU_99501',
    'SPADE:organisation': {
      '@id': 'cm8oiwy0n002lupay2760llne',
    },
    securityDefinitions: {
      Bearer: {
        in: 'header',
        alg: 'RS256',
        name: 'Bearer',
        format: 'jwt',
        scheme: 'bearer',
      },
    },
  },
  {
    id: '958fb7bc-ad32-4fdc-bb8a-44cab6c9dfc1',
    oid: 'urn:item:82a4a6b3-3692-4112-add1-433d79b598ab:958fb7bc-ad32-4fdc-bb8a-44cab6c9dfc1',
    base: 'https://venus.bavenir.eu/',
    '@type': ['adp:AirQualitySensor'],
    title: 'SHMU: Bratislava, Vlčie Hrdlo',
    '@context': [
      'https://www.w3.org/2019/wot/td/v1',
      {
        om: 'http://www.ontology-of-units-of-measure.org/resource/om-2/',
        adp: 'https://auroral.iot.linkeddata.es/def/adapters/#',
        geo: 'http://www.w3.org/2003/01/geo/wgs84_pos#',
        saref: 'https://saref.etsi.org/core/',
        schema: 'http://schema.org/',
      },
    ],
    security: ['Bearer'],
    'SPADE:node': {
      '@id': 'urn:node:82a4a6b3-3692-4112-add1-433d79b598ab',
    },
    properties: {
      CO: {
        '@id': 'urn:property:82a4a6b3-3692-4112-add1-433d79b598ab:958fb7bc-ad32-4fdc-bb8a-44cab6c9dfc1:CO',
        type: 'object',
        unit: 'om:microgramPerCubicMetre',
        '@type': 'adp:COConcentration',
        forms: [
          {
            op: 'readproperty',
            href: 'https://venus.bavenir.eu/nb/consumption/properties/958fb7bc-ad32-4fdc-bb8a-44cab6c9dfc1/CO',
            response: {
              contentType: 'application/json',
            },
            'htv:methodName': 'GET',
          },
        ],
        title: 'CO',
        readOnly: true,
        security: 'Bearer',
        description:
          'Carbon Monoxide, a colorless, odorless, and tasteless gas that is slightly less dense than air, measured in concentrations outside in air',
        uriVariables: {},
      },
      BZN: {
        '@id': 'urn:property:82a4a6b3-3692-4112-add1-433d79b598ab:958fb7bc-ad32-4fdc-bb8a-44cab6c9dfc1:BZN',
        type: 'object',
        unit: 'om:microgramPerCubicMetre',
        '@type': 'saref:Property',
        forms: [
          {
            op: 'readproperty',
            href: 'https://venus.bavenir.eu/nb/consumption/properties/958fb7bc-ad32-4fdc-bb8a-44cab6c9dfc1/BZN',
            response: {
              contentType: 'application/json',
            },
            'htv:methodName': 'GET',
          },
        ],
        title: 'BZN',
        readOnly: true,
        security: 'Bearer',
        description: 'Benzene, a colorless or light yellow liquid at room temperature with a sweet odor, measured in concentrations outside in air',
        uriVariables: {},
      },
      NO2: {
        '@id': 'urn:property:82a4a6b3-3692-4112-add1-433d79b598ab:958fb7bc-ad32-4fdc-bb8a-44cab6c9dfc1:NO2',
        type: 'object',
        unit: 'om:microgramPerCubicMetre',
        '@type': 'adp:NO2Concentration',
        forms: [
          {
            op: 'readproperty',
            href: 'https://venus.bavenir.eu/nb/consumption/properties/958fb7bc-ad32-4fdc-bb8a-44cab6c9dfc1/NO2',
            response: {
              contentType: 'application/json',
            },
            'htv:methodName': 'GET',
          },
        ],
        title: 'NO2',
        readOnly: true,
        security: 'Bearer',
        description: 'Nitrogen Dioxide, a reddish-brown gas with a characteristic sharp, biting odor, measured in concentrations outside in air',
        uriVariables: {},
      },
      NOX: {
        '@id': 'urn:property:82a4a6b3-3692-4112-add1-433d79b598ab:958fb7bc-ad32-4fdc-bb8a-44cab6c9dfc1:NOX',
        type: 'object',
        unit: 'om:microgramPerCubicMetre',
        '@type': 'saref:Property',
        forms: [
          {
            op: 'readproperty',
            href: 'https://venus.bavenir.eu/nb/consumption/properties/958fb7bc-ad32-4fdc-bb8a-44cab6c9dfc1/NOX',
            response: {
              contentType: 'application/json',
            },
            'htv:methodName': 'GET',
          },
        ],
        title: 'NOX',
        readOnly: true,
        security: 'Bearer',
        description: 'Nitrogen Oxides, a group of gases that are composed of nitrogen and oxygen, measured in concentrations outside in air',
        uriVariables: {},
      },
      SO2: {
        '@id': 'urn:property:82a4a6b3-3692-4112-add1-433d79b598ab:958fb7bc-ad32-4fdc-bb8a-44cab6c9dfc1:SO2',
        type: 'object',
        unit: 'om:microgramPerCubicMetre',
        '@type': 'adp:SO2Concentration',
        forms: [
          {
            op: 'readproperty',
            href: 'https://venus.bavenir.eu/nb/consumption/properties/958fb7bc-ad32-4fdc-bb8a-44cab6c9dfc1/SO2',
            response: {
              contentType: 'application/json',
            },
            'htv:methodName': 'GET',
          },
        ],
        title: 'SO2',
        readOnly: true,
        security: 'Bearer',
        description: 'Sulfur Dioxide, a toxic gas with a pungent, irritating smell, measured in concentrations outside in air',
        uriVariables: {},
      },
      PM10: {
        '@id': 'urn:property:82a4a6b3-3692-4112-add1-433d79b598ab:958fb7bc-ad32-4fdc-bb8a-44cab6c9dfc1:PM10',
        type: 'object',
        unit: 'om:microgramPerCubicMetre',
        '@type': 'adp:PM10Concentration',
        forms: [
          {
            op: 'readproperty',
            href: 'https://venus.bavenir.eu/nb/consumption/properties/958fb7bc-ad32-4fdc-bb8a-44cab6c9dfc1/PM10',
            response: {
              contentType: 'application/json',
            },
            'htv:methodName': 'GET',
          },
        ],
        title: 'PM10',
        readOnly: true,
        security: 'Bearer',
        description:
          'Particulate Matter <10µm, tiny particles or droplets in the air that are 10 micrometers or less in diameter, measured in concentrations outside in air',
        uriVariables: {},
      },
      'PM2.5': {
        '@id': 'urn:property:82a4a6b3-3692-4112-add1-433d79b598ab:958fb7bc-ad32-4fdc-bb8a-44cab6c9dfc1:PM2.5',
        type: 'object',
        unit: 'om:microgramPerCubicMetre',
        '@type': 'adp:PM2_5Concentration',
        forms: [
          {
            op: 'readproperty',
            href: 'https://venus.bavenir.eu/nb/consumption/properties/958fb7bc-ad32-4fdc-bb8a-44cab6c9dfc1/PM2.5',
            response: {
              contentType: 'application/json',
            },
            'htv:methodName': 'GET',
          },
        ],
        title: 'PM2.5',
        readOnly: true,
        security: 'Bearer',
        description:
          'Particulate Matter <2.5µm, fine inhalable particles, with diameters that are generally 2.5 micrometers and smaller, measured in concentrations outside in air',
        uriVariables: {},
      },
    },
    description: 'This is representation of the station data from SHMU, located in Slovakia - SHMU: Bratislava, Vlčie Hrdlo.',
    'geo:location': {
      'geo:lat': '48.128084',
      'geo:long': '17.17015',
    },
    registration: {
      created: '2024-09-26T13:10:57.028617Z',
      modified: '2025-01-20T12:35:56.446211Z',
    },
    'SPADE:Privacy': {
      Level: 2,
      Caption: 'Partners',
    },
    'schema:identifier': 'SHMU_99503',
    'SPADE:organisation': {
      '@id': 'cm8oiwy0n002lupay2760llne',
    },
    securityDefinitions: {
      Bearer: {
        in: 'header',
        alg: 'RS256',
        name: 'Bearer',
        format: 'jwt',
        scheme: 'bearer',
      },
    },
  },
  {
    id: 'f4e6c5a5-9839-4131-abb8-1e5ef79d81b3',
    oid: 'urn:item:82a4a6b3-3692-4112-add1-433d79b598ab:f4e6c5a5-9839-4131-abb8-1e5ef79d81b3',
    base: 'https://venus.bavenir.eu/',
    '@type': 'Device',
    title: 'DJITelemetryExtrator',
    '@context': [
      'https://www.w3.org/2019/wot/td/v1',
      {
        om: 'http://www.ontology-of-units-of-measure.org/resource/om-2/',
        adp: 'https://auroral.iot.linkeddata.es/def/adapters#',
        geo: 'http://www.w3.org/2003/01/geo/wgs84_pos#',
      },
    ],
    security: ['Bearer'],
    adapterId: 'dji-telemetry-extractor',
    'SPADE:node': {
      '@id': 'urn:node:82a4a6b3-3692-4112-add1-433d79b598ab',
    },
    properties: {
      telemetry: {
        '@id': 'urn:property:0a74ad15-f71e-4dbd-b15f-fc4b3181cbea:f4e6c5a5-9839-4131-abb8-1e5ef79d81b3:telemetry',
        type: 'object',
        title: 'telemetry',
        readOnly: false,
        security: 'Bearer',
        description: 'Push telemetry binary to catalog ',
        uriVariables: {},
      },
    },
    description: 'Service to add telemetry data to catalog',
    'geo:location': {
      'geo:lat': '48.1516',
      'geo:long': '17.1674',
    },
    registration: {
      created: '2024-07-02T06:41:38.648509Z',
      modified: '2025-01-20T12:35:56.008871Z',
    },
    'SPADE:Privacy': {
      Level: 3,
      Caption: 'Public',
    },
    'SPADE:organisation': {
      '@id': 'cm8oiwy0n002lupay2760llne',
    },
    securityDefinitions: {
      Bearer: {
        in: 'header',
        alg: 'RS256',
        name: 'Bearer',
        format: 'jwt',
        scheme: 'bearer',
      },
    },
  },
  {
    id: 'c00e5ce7-732e-484e-be28-b80cd6bd7957',
    oid: 'urn:item:82a4a6b3-3692-4112-add1-433d79b598ab:c00e5ce7-732e-484e-be28-b80cd6bd7957',
    base: 'https://venus.bavenir.eu/',
    '@type': ['adp:AirQualitySensor'],
    title: 'SHMU: Bratislava, Kamenné nám.',
    '@context': [
      'https://www.w3.org/2019/wot/td/v1',
      {
        om: 'http://www.ontology-of-units-of-measure.org/resource/om-2/',
        adp: 'https://auroral.iot.linkeddata.es/def/adapters/#',
        geo: 'http://www.w3.org/2003/01/geo/wgs84_pos#',
        saref: 'https://saref.etsi.org/core/',
        schema: 'http://schema.org/',
      },
    ],
    security: ['Bearer'],
    'SPADE:node': {
      '@id': 'urn:node:82a4a6b3-3692-4112-add1-433d79b598ab',
    },
    properties: {
      PM10: {
        '@id': 'urn:property:82a4a6b3-3692-4112-add1-433d79b598ab:c00e5ce7-732e-484e-be28-b80cd6bd7957:PM10',
        type: 'object',
        unit: 'om:microgramPerCubicMetre',
        '@type': 'adp:PM10Concentration',
        forms: [
          {
            op: 'readproperty',
            href: 'https://venus.bavenir.eu/nb/consumption/properties/c00e5ce7-732e-484e-be28-b80cd6bd7957/PM10',
            response: {
              contentType: 'application/json',
            },
            'htv:methodName': 'GET',
          },
        ],
        title: 'PM10',
        readOnly: true,
        security: 'Bearer',
        description:
          'Particulate Matter <10µm, tiny particles or droplets in the air that are 10 micrometers or less in diameter, measured in concentrations outside in air',
        uriVariables: {},
      },
      'PM2.5': {
        '@id': 'urn:property:82a4a6b3-3692-4112-add1-433d79b598ab:c00e5ce7-732e-484e-be28-b80cd6bd7957:PM2.5',
        type: 'object',
        unit: 'om:microgramPerCubicMetre',
        '@type': 'adp:PM2_5Concentration',
        forms: [
          {
            op: 'readproperty',
            href: 'https://venus.bavenir.eu/nb/consumption/properties/c00e5ce7-732e-484e-be28-b80cd6bd7957/PM2.5',
            response: {
              contentType: 'application/json',
            },
            'htv:methodName': 'GET',
          },
        ],
        title: 'PM2.5',
        readOnly: true,
        security: 'Bearer',
        description:
          'Particulate Matter <2.5µm, fine inhalable particles, with diameters that are generally 2.5 micrometers and smaller, measured in concentrations outside in air',
        uriVariables: {},
      },
    },
    description: 'This is representation of the station data from SHMU, located in Slovakia - SHMU: Bratislava, Kamenné nám..',
    'geo:location': {
      'geo:lat': '48.144722',
      'geo:long': '17.113333',
    },
    registration: {
      created: '2024-09-26T13:10:56.414904Z',
      modified: '2025-01-20T12:35:55.987831Z',
    },
    'SPADE:Privacy': {
      Level: 2,
      Caption: 'Partners',
    },
    'schema:identifier': 'SHMU_99114',
    'SPADE:organisation': {
      '@id': 'cm8oiwy0n002lupay2760llne',
    },
    securityDefinitions: {
      Bearer: {
        in: 'header',
        alg: 'RS256',
        name: 'Bearer',
        format: 'jwt',
        scheme: 'bearer',
      },
    },
  },
  {
    id: '85ddb3d1-660b-4b09-b6c2-061bfcc887c3',
    oid: 'urn:item:82a4a6b3-3692-4112-add1-433d79b598ab:85ddb3d1-660b-4b09-b6c2-061bfcc887c3',
    base: 'https://venus.bavenir.eu/',
    '@type': ['dcmi:Service'],
    links: [
      {
        rel: 'external',
        href: 'https://weather-stations.spade.bavenir.eu',
      },
    ],
    title: 'Weather Stations Example',
    '@context': [
      'https://www.w3.org/2019/wot/td/v1',
      {
        geo: 'http://www.w3.org/2003/01/geo/wgs84_pos#',
        dcmi: 'http://purl.org/dc/dcmitype/',
      },
    ],
    security: ['Bearer'],
    adapterId: 'b516ffaf-cfaa-46eb-b30b-ba564aa1439e',
    'SPADE:node': {
      '@id': 'urn:node:82a4a6b3-3692-4112-add1-433d79b598ab',
    },
    description:
      'An example service which provides a web-based interface for visualizing weather data collected from various weather stations (Netatmo, SHMU) in Bratislava, Slovakia.',
    'geo:location': {
      'geo:lat': '48.165064',
      'geo:long': '17.145673',
    },
    registration: {
      created: '2024-12-12T12:09:29.842388Z',
      modified: '2025-01-20T12:35:56.298131Z',
    },
    'SPADE:Privacy': {
      Level: 2,
      Caption: 'Partners',
    },
    'SPADE:organisation': {
      '@id': 'cm8oiwy0n002lupay2760llne',
    },
    securityDefinitions: {
      Bearer: {
        in: 'header',
        alg: 'RS256',
        name: 'Bearer',
        format: 'jwt',
        scheme: 'bearer',
      },
    },
  },
  {
    id: 'dc42c604-0d93-43a1-a600-b89b2be0e553',
    oid: 'urn:item:82a4a6b3-3692-4112-add1-433d79b598ab:dc42c604-0d93-43a1-a600-b89b2be0e553',
    base: 'https://venus.bavenir.eu/',
    '@type': ['adp:AirQualitySensor'],
    title: 'SHMU: Bratislava, Trnavské Mýto',
    '@context': [
      'https://www.w3.org/2019/wot/td/v1',
      {
        om: 'http://www.ontology-of-units-of-measure.org/resource/om-2/',
        adp: 'https://auroral.iot.linkeddata.es/def/adapters/#',
        geo: 'http://www.w3.org/2003/01/geo/wgs84_pos#',
        saref: 'https://saref.etsi.org/core/',
        schema: 'http://schema.org/',
      },
    ],
    security: ['Bearer'],
    'SPADE:node': {
      '@id': 'urn:node:82a4a6b3-3692-4112-add1-433d79b598ab',
    },
    properties: {
      CO: {
        '@id': 'urn:property:82a4a6b3-3692-4112-add1-433d79b598ab:dc42c604-0d93-43a1-a600-b89b2be0e553:CO',
        type: 'object',
        unit: 'om:microgramPerCubicMetre',
        '@type': 'adp:COConcentration',
        forms: [
          {
            op: 'readproperty',
            href: 'https://venus.bavenir.eu/nb/consumption/properties/dc42c604-0d93-43a1-a600-b89b2be0e553/CO',
            response: {
              contentType: 'application/json',
            },
            'htv:methodName': 'GET',
          },
        ],
        title: 'CO',
        readOnly: true,
        security: 'Bearer',
        description:
          'Carbon Monoxide, a colorless, odorless, and tasteless gas that is slightly less dense than air, measured in concentrations outside in air',
        uriVariables: {},
      },
      BZN: {
        '@id': 'urn:property:82a4a6b3-3692-4112-add1-433d79b598ab:dc42c604-0d93-43a1-a600-b89b2be0e553:BZN',
        type: 'object',
        unit: 'om:microgramPerCubicMetre',
        '@type': 'saref:Property',
        forms: [
          {
            op: 'readproperty',
            href: 'https://venus.bavenir.eu/nb/consumption/properties/dc42c604-0d93-43a1-a600-b89b2be0e553/BZN',
            response: {
              contentType: 'application/json',
            },
            'htv:methodName': 'GET',
          },
        ],
        title: 'BZN',
        readOnly: true,
        security: 'Bearer',
        description: 'Benzene, a colorless or light yellow liquid at room temperature with a sweet odor, measured in concentrations outside in air',
        uriVariables: {},
      },
      NO2: {
        '@id': 'urn:property:82a4a6b3-3692-4112-add1-433d79b598ab:dc42c604-0d93-43a1-a600-b89b2be0e553:NO2',
        type: 'object',
        unit: 'om:microgramPerCubicMetre',
        '@type': 'adp:NO2Concentration',
        forms: [
          {
            op: 'readproperty',
            href: 'https://venus.bavenir.eu/nb/consumption/properties/dc42c604-0d93-43a1-a600-b89b2be0e553/NO2',
            response: {
              contentType: 'application/json',
            },
            'htv:methodName': 'GET',
          },
        ],
        title: 'NO2',
        readOnly: true,
        security: 'Bearer',
        description: 'Nitrogen Dioxide, a reddish-brown gas with a characteristic sharp, biting odor, measured in concentrations outside in air',
        uriVariables: {},
      },
      NOX: {
        '@id': 'urn:property:82a4a6b3-3692-4112-add1-433d79b598ab:dc42c604-0d93-43a1-a600-b89b2be0e553:NOX',
        type: 'object',
        unit: 'om:microgramPerCubicMetre',
        '@type': 'saref:Property',
        forms: [
          {
            op: 'readproperty',
            href: 'https://venus.bavenir.eu/nb/consumption/properties/dc42c604-0d93-43a1-a600-b89b2be0e553/NOX',
            response: {
              contentType: 'application/json',
            },
            'htv:methodName': 'GET',
          },
        ],
        title: 'NOX',
        readOnly: true,
        security: 'Bearer',
        description: 'Nitrogen Oxides, a group of gases that are composed of nitrogen and oxygen, measured in concentrations outside in air',
        uriVariables: {},
      },
      PM10: {
        '@id': 'urn:property:82a4a6b3-3692-4112-add1-433d79b598ab:dc42c604-0d93-43a1-a600-b89b2be0e553:PM10',
        type: 'object',
        unit: 'om:microgramPerCubicMetre',
        '@type': 'adp:PM10Concentration',
        forms: [
          {
            op: 'readproperty',
            href: 'https://venus.bavenir.eu/nb/consumption/properties/dc42c604-0d93-43a1-a600-b89b2be0e553/PM10',
            response: {
              contentType: 'application/json',
            },
            'htv:methodName': 'GET',
          },
        ],
        title: 'PM10',
        readOnly: true,
        security: 'Bearer',
        description:
          'Particulate Matter <10µm, tiny particles or droplets in the air that are 10 micrometers or less in diameter, measured in concentrations outside in air',
        uriVariables: {},
      },
      'PM2.5': {
        '@id': 'urn:property:82a4a6b3-3692-4112-add1-433d79b598ab:dc42c604-0d93-43a1-a600-b89b2be0e553:PM2.5',
        type: 'object',
        unit: 'om:microgramPerCubicMetre',
        '@type': 'adp:PM2_5Concentration',
        forms: [
          {
            op: 'readproperty',
            href: 'https://venus.bavenir.eu/nb/consumption/properties/dc42c604-0d93-43a1-a600-b89b2be0e553/PM2.5',
            response: {
              contentType: 'application/json',
            },
            'htv:methodName': 'GET',
          },
        ],
        title: 'PM2.5',
        readOnly: true,
        security: 'Bearer',
        description:
          'Particulate Matter <2.5µm, fine inhalable particles, with diameters that are generally 2.5 micrometers and smaller, measured in concentrations outside in air',
        uriVariables: {},
      },
    },
    description: 'This is representation of the station data from SHMU, located in Slovakia - SHMU: Bratislava, Trnavské Mýto.',
    'geo:location': {
      'geo:lat': '48.158333',
      'geo:long': '17.128611',
    },
    registration: {
      created: '2024-09-26T13:10:56.533915Z',
      modified: '2025-01-20T12:35:56.584999Z',
    },
    'SPADE:Privacy': {
      Level: 2,
      Caption: 'Partners',
    },
    'schema:identifier': 'SHMU_99112',
    'SPADE:organisation': {
      '@id': 'cm8oiwy0n002lupay2760llne',
    },
    securityDefinitions: {
      Bearer: {
        in: 'header',
        alg: 'RS256',
        name: 'Bearer',
        format: 'jwt',
        scheme: 'bearer',
      },
    },
  },
  {
    id: '278a8144-0585-4cd6-9b40-f3ee4bca06ea',
    oid: 'urn:item:82a4a6b3-3692-4112-add1-433d79b598ab:278a8144-0585-4cd6-9b40-f3ee4bca06ea',
    base: 'https://venus.bavenir.eu/',
    '@type': ['adp:AirQualitySensor'],
    title: 'SHMU: Bratislava, Pod. Biskupice',
    '@context': [
      'https://www.w3.org/2019/wot/td/v1',
      {
        om: 'http://www.ontology-of-units-of-measure.org/resource/om-2/',
        adp: 'https://auroral.iot.linkeddata.es/def/adapters/#',
        geo: 'http://www.w3.org/2003/01/geo/wgs84_pos#',
        saref: 'https://saref.etsi.org/core/',
        schema: 'http://schema.org/',
      },
    ],
    security: ['Bearer'],
    'SPADE:node': {
      '@id': 'urn:node:82a4a6b3-3692-4112-add1-433d79b598ab',
    },
    properties: {
      CO: {
        '@id': 'urn:property:82a4a6b3-3692-4112-add1-433d79b598ab:278a8144-0585-4cd6-9b40-f3ee4bca06ea:CO',
        type: 'object',
        unit: 'om:microgramPerCubicMetre',
        '@type': 'adp:COConcentration',
        forms: [
          {
            op: 'readproperty',
            href: 'https://venus.bavenir.eu/nb/consumption/properties/278a8144-0585-4cd6-9b40-f3ee4bca06ea/CO',
            response: {
              contentType: 'application/json',
            },
            'htv:methodName': 'GET',
          },
        ],
        title: 'CO',
        readOnly: true,
        security: 'Bearer',
        description:
          'Carbon Monoxide, a colorless, odorless, and tasteless gas that is slightly less dense than air, measured in concentrations outside in air',
        uriVariables: {},
      },
      NO2: {
        '@id': 'urn:property:82a4a6b3-3692-4112-add1-433d79b598ab:278a8144-0585-4cd6-9b40-f3ee4bca06ea:NO2',
        type: 'object',
        unit: 'om:microgramPerCubicMetre',
        '@type': 'adp:NO2Concentration',
        forms: [
          {
            op: 'readproperty',
            href: 'https://venus.bavenir.eu/nb/consumption/properties/278a8144-0585-4cd6-9b40-f3ee4bca06ea/NO2',
            response: {
              contentType: 'application/json',
            },
            'htv:methodName': 'GET',
          },
        ],
        title: 'NO2',
        readOnly: true,
        security: 'Bearer',
        description: 'Nitrogen Dioxide, a reddish-brown gas with a characteristic sharp, biting odor, measured in concentrations outside in air',
        uriVariables: {},
      },
      NOX: {
        '@id': 'urn:property:82a4a6b3-3692-4112-add1-433d79b598ab:278a8144-0585-4cd6-9b40-f3ee4bca06ea:NOX',
        type: 'object',
        unit: 'om:microgramPerCubicMetre',
        '@type': 'saref:Property',
        forms: [
          {
            op: 'readproperty',
            href: 'https://venus.bavenir.eu/nb/consumption/properties/278a8144-0585-4cd6-9b40-f3ee4bca06ea/NOX',
            response: {
              contentType: 'application/json',
            },
            'htv:methodName': 'GET',
          },
        ],
        title: 'NOX',
        readOnly: true,
        security: 'Bearer',
        description: 'Nitrogen Oxides, a group of gases that are composed of nitrogen and oxygen, measured in concentrations outside in air',
        uriVariables: {},
      },
      SO2: {
        '@id': 'urn:property:82a4a6b3-3692-4112-add1-433d79b598ab:278a8144-0585-4cd6-9b40-f3ee4bca06ea:SO2',
        type: 'object',
        unit: 'om:microgramPerCubicMetre',
        '@type': 'adp:SO2Concentration',
        forms: [
          {
            op: 'readproperty',
            href: 'https://venus.bavenir.eu/nb/consumption/properties/278a8144-0585-4cd6-9b40-f3ee4bca06ea/SO2',
            response: {
              contentType: 'application/json',
            },
            'htv:methodName': 'GET',
          },
        ],
        title: 'SO2',
        readOnly: true,
        security: 'Bearer',
        description: 'Sulfur Dioxide, a toxic gas with a pungent, irritating smell, measured in concentrations outside in air',
        uriVariables: {},
      },
      PM10: {
        '@id': 'urn:property:82a4a6b3-3692-4112-add1-433d79b598ab:278a8144-0585-4cd6-9b40-f3ee4bca06ea:PM10',
        type: 'object',
        unit: 'om:microgramPerCubicMetre',
        '@type': 'adp:PM10Concentration',
        forms: [
          {
            op: 'readproperty',
            href: 'https://venus.bavenir.eu/nb/consumption/properties/278a8144-0585-4cd6-9b40-f3ee4bca06ea/PM10',
            response: {
              contentType: 'application/json',
            },
            'htv:methodName': 'GET',
          },
        ],
        title: 'PM10',
        readOnly: true,
        security: 'Bearer',
        description:
          'Particulate Matter <10µm, tiny particles or droplets in the air that are 10 micrometers or less in diameter, measured in concentrations outside in air',
        uriVariables: {},
      },
      'PM2.5': {
        '@id': 'urn:property:82a4a6b3-3692-4112-add1-433d79b598ab:278a8144-0585-4cd6-9b40-f3ee4bca06ea:PM2.5',
        type: 'object',
        unit: 'om:microgramPerCubicMetre',
        '@type': 'adp:PM2_5Concentration',
        forms: [
          {
            op: 'readproperty',
            href: 'https://venus.bavenir.eu/nb/consumption/properties/278a8144-0585-4cd6-9b40-f3ee4bca06ea/PM2.5',
            response: {
              contentType: 'application/json',
            },
            'htv:methodName': 'GET',
          },
        ],
        title: 'PM2.5',
        readOnly: true,
        security: 'Bearer',
        description:
          'Particulate Matter <2.5µm, fine inhalable particles, with diameters that are generally 2.5 micrometers and smaller, measured in concentrations outside in air',
        uriVariables: {},
      },
    },
    description: 'This is representation of the station data from SHMU, located in Slovakia - SHMU: Bratislava, Pod. Biskupice.',
    'geo:location': {
      'geo:lat': '48.128361',
      'geo:long': '17.216816',
    },
    registration: {
      created: '2024-09-26T13:10:57.198014Z',
      modified: '2025-01-20T12:35:55.621025Z',
    },
    'SPADE:Privacy': {
      Level: 2,
      Caption: 'Partners',
    },
    'schema:identifier': 'SHMU_99502',
    'SPADE:organisation': {
      '@id': 'cm8oiwy0n002lupay2760llne',
    },
    securityDefinitions: {
      Bearer: {
        in: 'header',
        alg: 'RS256',
        name: 'Bearer',
        format: 'jwt',
        scheme: 'bearer',
      },
    },
  },
  {
    id: '4c75c6f7-0469-48df-9f62-715948c05b95',
    oid: 'urn:item:82a4a6b3-3692-4112-add1-433d79b598ab:4c75c6f7-0469-48df-9f62-715948c05b95',
    base: 'https://venus.bavenir.eu/',
    '@type': ['dcmi:Dataset'],
    links: [
      {
        rel: 'external',
        href: 'https://spade.bavenir.eu',
      },
    ],
    title: 'Dummy Data Set',
    '@context': [
      'https://www.w3.org/2019/wot/td/v1',
      {
        dcmi: 'http://purl.org/dc/dcmitype/',
      },
    ],
    security: ['Bearer'],
    adapterId: '73ae9e3f-45aa-4635-a5ca-d8e1500fe39c',
    'SPADE:node': {
      '@id': 'urn:node:82a4a6b3-3692-4112-add1-433d79b598ab',
    },
    'dct:creator': 'Jorge Al',
    'dct:license': 'https://creativecommons.org/public-domain/cc0/',
    description: 'A dataset that contains information about the data collected by the SPADE platform.',
    registration: {
      created: '2024-12-18T11:30:42.167104Z',
      modified: '2025-01-20T12:35:55.955380Z',
    },
    'SPADE:Privacy': {
      Level: 3,
      Caption: 'Public',
    },
    'dct:hasVersion': 'v0.0.1',
    'dct:licenseHolder': 'Jorge Al',
    'SPADE:organisation': {
      '@id': 'cm8oiwy0n002lupay2760llne',
    },
    securityDefinitions: {
      Bearer: {
        in: 'header',
        alg: 'RS256',
        name: 'Bearer',
        format: 'jwt',
        scheme: 'bearer',
      },
    },
  },
]
