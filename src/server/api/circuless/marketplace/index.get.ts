export default defineEventHandler(async (event) => {
  return await apiWrapper(
    event,
    async () => {
      return await Promise.resolve().then(async () => {
        return [
          {
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
          },
          {
            id: '2',
            title: 'Public Transportation Routes',
            description:
              'Complete dataset of public transportation routes including bus, metro, and tram lines with stops, schedules, and accessibility information.',
            tags: ['transportation', 'public-transit', 'routes', 'accessibility'],
            category: 'Transportation',
            format: 'GeoJSON',
            organization: 'City Transportation Department',
            lastUpdated: new Date('2024-10-20'),
            downloads: 890,
            license: 'CC BY 4.0',
            size: '12.8 MB',
          },
          {
            id: '3',
            title: 'Healthcare Facility Locations',
            description:
              'Comprehensive database of healthcare facilities including hospitals, clinics, pharmacies, and emergency services with contact information and services offered.',
            tags: ['health', 'healthcare', 'facilities', 'emergency'],
            category: 'Health',
            format: 'JSON',
            organization: 'Ministry of Health',
            lastUpdated: new Date('2024-10-12'),
            downloads: 675,
            license: 'Open Data',
            size: '8.4 MB',
          },
          {
            id: '4',
            title: 'School Performance Metrics',
            description:
              'Annual performance data for public schools including test scores, graduation rates, enrollment numbers, and resource allocation.',
            tags: ['education', 'schools', 'performance', 'statistics'],
            category: 'Education',
            format: 'Excel',
            organization: 'Department of Education',
            lastUpdated: new Date('2024-09-30'),
            downloads: 445,
            license: 'CC BY-SA 4.0',
            size: '25.1 MB',
          },
          {
            id: '5',
            title: 'Municipal Budget 2024',
            description: 'Detailed breakdown of municipal budget allocations, expenditures, and revenue sources for the fiscal year 2024.',
            tags: ['government', 'budget', 'finance', 'transparency'],
            category: 'Government',
            format: 'PDF',
            organization: 'City Finance Department',
            lastUpdated: new Date('2024-10-01'),
            downloads: 320,
            license: 'Open Data',
            size: '15.7 MB',
          },
          {
            id: '6',
            title: 'Business Directory API',
            description:
              'Live API access to registered business information including company details, industry classifications, and contact information.',
            tags: ['business', 'api', 'directory', 'economy'],
            category: 'Economy',
            format: 'API',
            organization: 'Chamber of Commerce',
            lastUpdated: new Date('2024-10-25'),
            downloads: 2150,
            license: 'Commercial',
            size: 'N/A',
          },
          {
            id: '7',
            title: 'Population Demographics 2024',
            description:
              'Latest census data including population distribution, age groups, income levels, and demographic trends by geographic region.',
            tags: ['demographics', 'census', 'population', 'statistics'],
            category: 'Demographics',
            format: 'CSV',
            organization: 'National Statistics Office',
            lastUpdated: new Date('2024-08-15'),
            downloads: 1890,
            license: 'Open Data',
            size: '67.3 MB',
          },
          {
            id: '8',
            title: 'Road Infrastructure Data',
            description:
              'Comprehensive dataset of road infrastructure including road conditions, traffic counts, maintenance schedules, and construction projects.',
            tags: ['infrastructure', 'roads', 'maintenance', 'traffic'],
            category: 'Infrastructure',
            format: 'Shapefile',
            organization: 'Department of Transportation',
            lastUpdated: new Date('2024-10-18'),
            downloads: 567,
            license: 'CC BY 4.0',
            size: '156.8 MB',
          },
        ]
      })
    },
    {
      protected: false,
    }
  )
})
