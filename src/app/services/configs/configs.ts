export interface Configs {
  enableExtension: boolean;
  disabledSites: string[];
  loveCats: boolean;
  loveDogs: boolean;
}

export const ConfigsInit = {
  enableExtension: true,
  disabledSites: [],
  loveCats: false,
  loveDogs: false,
}

export const StorageKey = 'configs';
