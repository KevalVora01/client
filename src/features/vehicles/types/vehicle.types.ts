export type VehicleType = "Car" | "Bike" | "Scooter" | "Other";
export type FuelType = "Petrol" | "Diesel" | "Electric" | "CNG" | "Hybrid";

export interface Vehicle {
  id: number;
  residentId: number;
  plateNumber: string;
  type: VehicleType;
  brandName: string;
  model: string;
  color: string;
  fuelType: FuelType;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVehiclePayload {
  plateNumber: string;
  type: VehicleType;
  brandName: string;
  model: string;
  color: string;
  fuelType: FuelType;
}

export interface UpdateVehiclePayload {
  plateNumber?: string;
  type?: VehicleType;
  brandName?: string;
  model?: string;
  color?: string;
  fuelType?: FuelType;
}