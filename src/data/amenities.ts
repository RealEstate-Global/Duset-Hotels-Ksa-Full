export interface Amenity {
  key: string
  icon: string
}

const icon = (file: string) => `/images/uploads/amenities-icons/${file}`

export const amenities: Amenity[] = [
  { key: 'freeWifi', icon: icon('Free-Wifi.webp') },
  { key: 'roomService', icon: icon('Room-Service.webp') },
  { key: 'dailyHousekeeping', icon: icon('Daily-Housekeeping.webp') },
  { key: 'freeParking', icon: icon('Free-Parking.webp') },
  { key: 'cableTv', icon: icon('Cable-TV.webp') },
  { key: 'bathroom', icon: icon('Bathroom.webp') },
  { key: 'airConditioner', icon: icon('Air-Conditioner.webp') },
  { key: 'welcomeDrinks', icon: icon('Welcome-Drinks.webp') },
  { key: 'shower', icon: icon('Shower.webp') },
  { key: 'laundry', icon: icon('Laundry.webp') },
  { key: 'refrigerator', icon: icon('Refrigerator.webp') },
  { key: 'microwave', icon: icon('Microwave.webp') },
  { key: 'swimmingPool', icon: icon('Swimming-pool.webp') },
  { key: 'restaurant', icon: icon('Restaurant.webp') },
  { key: 'beds', icon: icon('Beds.webp') },
  { key: 'kingSizedBeds', icon: icon('King-Sized-Beds.webp') },
  { key: 'iron', icon: icon('Iron.webp') },
  { key: 'guestLaundry', icon: icon('On-Site-Guest-Laundry.webp') },
  { key: 'coffeeTea', icon: icon('In-Room-Coffee-and-Tea.webp') },
]

export const coreFeatures: Amenity[] = [
  { key: 'freeWifi', icon: icon('Free-Wifi.webp') },
  { key: 'roomService', icon: icon('Room-Service.webp') },
  { key: 'dailyHousekeeping', icon: icon('Daily-Housekeeping.webp') },
  { key: 'freeParking', icon: icon('Free-Parking.webp') },
  { key: 'cableTv', icon: icon('Cable-TV.webp') },
  { key: 'airConditioner', icon: icon('Air-Conditioner.webp') },
  { key: 'coffeeMachine', icon: icon('Coffee-Machine.webp') },
  { key: 'refrigerator', icon: icon('Refrigerator.webp') },
]
