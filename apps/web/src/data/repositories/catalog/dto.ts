export type GreenhouseShape = 'arch' | 'drop' | 'gable';

export type ProductDimensions = {
  widthM: number;
  lengthM: number;
  heightM: number;
};

export type ProductKitItemDTO = {
  name: string;
  qty: string;
};

export type ProductDTO = {
  id: string;
  slug: string;
  name: string;
  shape: GreenhouseShape;
  tagline: string;
  description: string;
  dimensions: ProductDimensions;
  frameProfile: string;
  polycarbonateMm: number;
  doors: number;
  vents: number;
  snowLoadKgM2: number;
  warrantyYears: number;
  price: number;
  oldPrice: number | null;
  inStock: boolean;
  isPopular: boolean;
  kit: ProductKitItemDTO[];
  photos: string[];
};
