import { Model } from 'mongoose';
import { Product } from '../entities/productEntity';
const productDB: Model<Product> = require('../model/Product');

export const seedDemoData = async () => {
  const demoProducts: Partial<Product & { sku: string }>[] = [
    { sku: 'BRAKE-PADS-TOY', name: 'Brake Pads Set', price: 49.99, category: 'Brakes', carBrand: 'Toyota', description: 'Front brake pads for Toyota models', amount: 25, availability: true, imageUrl: 'https://images.unsplash.com/photo-1610737243412-6d4e7bd2c9d0?q=80&w=1200&auto=format&fit=crop' },
    { sku: 'OIL-FILTER-HON', name: 'Oil Filter', price: 12.99, category: 'Engine', carBrand: 'Honda', description: 'High-performance oil filter', amount: 40, availability: true, imageUrl: 'https://images.unsplash.com/photo-1618930833855-67a9abf3b4c2?q=80&w=1200&auto=format&fit=crop' },
    { sku: 'LED-BULB-FRD', name: 'Headlight Bulb', price: 19.99, category: 'Lighting', carBrand: 'Ford', description: 'Bright LED headlight bulb', amount: 30, availability: true, imageUrl: 'https://images.unsplash.com/photo-1535930749574-1399327ce78f?q=80&w=1200&auto=format&fit=crop' },
    { sku: 'AIR-FILTER-BMW', name: 'Air Filter', price: 15.49, category: 'Engine', carBrand: 'BMW', description: 'OEM replacement air filter', amount: 35, availability: true, imageUrl: 'https://images.unsplash.com/photo-1628207643805-cc6f1a601a2b?q=80&w=1200&auto=format&fit=crop' },
    { sku: 'SPARK-PLUG-VW', name: 'Spark Plug', price: 8.99, category: 'Ignition', carBrand: 'Volkswagen', description: 'Copper core spark plug', amount: 60, availability: true, imageUrl: 'https://images.unsplash.com/photo-1595831994031-59b4c3bdb3b2?q=80&w=1200&auto=format&fit=crop' },
    { sku: 'WIPER-SET-HYN', name: 'Wiper Blades Set', price: 17.99, category: 'Accessories', carBrand: 'Hyundai', description: 'All-season wiper blades', amount: 50, availability: true, imageUrl: 'https://images.unsplash.com/photo-1600359752800-7a5c1f0b48b6?q=80&w=1200&auto=format&fit=crop' },
    { sku: 'BATTERY-TERM-NIS', name: 'Battery Terminals', price: 9.49, category: 'Electrical', carBrand: 'Nissan', description: 'Heavy-duty battery terminals', amount: 45, availability: true, imageUrl: 'https://images.unsplash.com/photo-1632894989672-6db2ab4b0a3c?q=80&w=1200&auto=format&fit=crop' },
    { sku: 'RADIATOR-CAP-KIA', name: 'Radiator Cap', price: 11.99, category: 'Cooling', carBrand: 'Kia', description: 'High pressure radiator cap', amount: 40, availability: true, imageUrl: 'https://images.unsplash.com/photo-1614756949696-5b6d18cbdfd4?q=80&w=1200&auto=format&fit=crop' },
    { sku: 'TIMING-BELT-AUD', name: 'Timing Belt', price: 64.99, category: 'Engine', carBrand: 'Audi', description: 'Durable timing belt', amount: 18, availability: true, imageUrl: 'https://images.unsplash.com/photo-1616512652591-6f8e92f8f7f2?q=80&w=1200&auto=format&fit=crop' },
    { sku: 'FUEL-PUMP-MBZ', name: 'Fuel Pump', price: 129.0, category: 'Fuel', carBrand: 'Mercedes', description: 'Electric in-tank fuel pump', amount: 12, availability: true, imageUrl: 'https://images.unsplash.com/photo-1617956711327-6e2a98b03eb6?q=80&w=1200&auto=format&fit=crop' },
    { sku: 'ALTNTR-TOY', name: 'Alternator', price: 199.99, category: 'Electrical', carBrand: 'Toyota', description: 'Remanufactured alternator', amount: 10, availability: true, imageUrl: 'https://images.unsplash.com/photo-1634656563020-08bd6fbaf143?q=80&w=1200&auto=format&fit=crop' },
    { sku: 'SHOCK-ABS-HON', name: 'Shock Absorber', price: 89.99, category: 'Suspension', carBrand: 'Honda', description: 'Rear shock absorber', amount: 16, availability: true, imageUrl: 'https://images.unsplash.com/photo-1597764690225-0b6a7566bbb6?q=80&w=1200&auto=format&fit=crop' },
    { sku: 'DISC-ROT-FRD', name: 'Brake Disc Rotor', price: 74.99, category: 'Brakes', carBrand: 'Ford', description: 'Front disc rotor', amount: 22, availability: true, imageUrl: 'https://images.unsplash.com/photo-1612681621975-2eab16bd3d13?q=80&w=1200&auto=format&fit=crop' }
  ];

  for (const item of demoProducts) {
    const existing = await productDB.findOne({ name: item.name, carBrand: item.carBrand });
    if (!existing) {
      await productDB.create(item);
    }
  }
};


