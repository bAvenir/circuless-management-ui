import { Realm } from '@prisma/client'
import { miscTypes } from '~/shared/types'

export default defineEventHandler(async (event) => {
  return await apiWrapper(
    event,
    async () => {
      return await Promise.resolve().then(async () => {
        return {
          id: '1',
          title: 'Air Quality Monitoring Data 2024',
          description:
            'Comprehensive air quality measurements from monitoring stations across the region. Includes PM2.5, PM10, NO2, SO2, and O3 levels recorded hourly throughout 2024.',
          tags: ['environment', 'air-quality', 'monitoring', 'pollution'],
          category: 'Environment',
          format: 'CSV',
          organization: 'Environmental Protection Agency',
          lastUpdated: new Date('2024-10-15'),
          downloads: 1250,
          license: 'Open Data',
          size: '45.2 MB',
        }
      })
    },
    {
      protected: Realm.circuless,
      schemas: {
        params: miscTypes.IdParamSchema,
      },
    }
  )
})
