export default defineNuxtPlugin(() => {
  return {
    provide: {
      formatPrice: (price: number | string, currency: string = 'EUR') => {
        const value = typeof price === 'string' ? parseFloat(price) : price
        var formatter = new Intl.NumberFormat('sk-SK', {
          style: 'currency',
          currency,
          minimumFractionDigits: 0,
        })
        return formatter.format(value)
      },
      formatDate: (date: string | Date, options: Intl.DateTimeFormatOptions = {}) => {
        return new Date(date).toLocaleDateString('sk-SK', options)
      }
    },
  }
})
