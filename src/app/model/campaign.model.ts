export interface MediaFile {
  id: number;
  name: string;
  documentPurpose: string;
  fileType: string;
  filePath: string;
  creationDate: string;
  downloadUrl: string;
}

export interface Campaign {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  requiredImpressions: number;
  accumulatedImpressions: number;
  mediaFile: MediaFile;
  creationDate: string;
  streamUrl: string;
  price: number;
  targetCities: { id: number, name: string }[];
  targetProvinces: { id: number, name: string }[];
  active: boolean;
}