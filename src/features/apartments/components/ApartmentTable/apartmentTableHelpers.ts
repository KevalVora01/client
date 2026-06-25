export const formatArea = (area: number): string =>
  area.toLocaleString("en-IN");

export const formatFloor = (floor: number): string => {
  if (floor === 0) return "Ground Floor";
  const suffix = ["th", "st", "nd", "rd"];
  const v = floor % 100;
  return floor + (suffix[(v - 20) % 10] || suffix[v] || suffix[0]) + " Floor";
};

export const apartmentTypeLabels: Record<string, string> = {
  studio: "Studio",
  "1bhk": "1 BHK",
  "2bhk": "2 BHK",
  "3bhk": "3 BHK",
  "4bhk": "4 BHK",
};