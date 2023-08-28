const prefix = '__FDEX__';

export const store = {
    set<T>(key: string, value: T, hidePrefix = false): void {
      try {
        localStorage.setItem(hidePrefix ? key : `${prefix}${key}`, JSON.stringify(value));
      } catch (e) {
        console.error('Error while saving to store', e);
      }
    },
  
    get<T>(key: string, hidePrefix = false): T | undefined {
      try {
        const value = localStorage.getItem(hidePrefix ? key : `${prefix}${key}`);
        return value ? <T>JSON.parse(value) : undefined;
      } catch (e) {
        console.error('Error while getting from store', e);
        return undefined;
      }
    },
  
    remove(key: string, hidePrefix = false): void {
      localStorage.removeItem(hidePrefix ? key : `${prefix}${key}`);
    },
  
    clear(): void {
      localStorage.clear();
    },
  };