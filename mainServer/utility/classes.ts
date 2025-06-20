export interface settingsData {
  tokenLength: number;
  idLength: number;
  saltLength: number;
  hashLength: number;
}

export interface runtimeData {
  adminPasswordHash: string;
  adminSalt: string;
  settingsData : settingsData
}
