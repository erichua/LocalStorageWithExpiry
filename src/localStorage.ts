export type LocalStorageConfig = {
  ttl?: number | null;
  encrypter?: (...args: unknown[]) => string;
  decrypter?: (...args: unknown[]) => string;
};

let hasLocalStorage: boolean;
const supportLocalStorage = (): boolean => {
  // if (hasLocalStorage !== undefined) return hasLocalStorage;
  hasLocalStorage = true;
  try {
    //check if local storage is available
    if (!localStorage) {
      hasLocalStorage = true;
    }
  } catch (error) {
    hasLocalStorage = false;
  }

  return hasLocalStorage;
};

const defaultConfig: LocalStorageConfig = {
  ttl: null,
};

const getFinalConfig = (config: LocalStorageConfig): LocalStorageConfig => {
  return { ...defaultConfig, ...config };
};

const set = <T = unknown>(key: string, value: T, localConfig: LocalStorageConfig = {}): void | boolean => {
  if (!supportLocalStorage()) {
    return false;
  }
  const finalConfig = getFinalConfig(localConfig);
  console.log('localStorage', finalConfig);
  const hasTTL = finalConfig.ttl && !isNaN(finalConfig.ttl) && finalConfig.ttl > 0;
  const hasEncrypter = finalConfig.encrypter != undefined;
  let finalValue;
  if (finalConfig.encrypter && hasEncrypter) {
    // need to encrypte the value
    finalValue = finalConfig.encrypter(JSON.stringify(value));
  } else {
    finalValue = value;
  }

  const itemValue = hasTTL
    ? {
        value: finalValue,
        expiry: Date.now() + finalConfig.ttl!,
      }
    : { value: finalValue };
  localStorage.setItem(key, JSON.stringify(itemValue));
};

const get = <T = unknown>(key: string, localConfig: LocalStorageConfig = {}): T | null => {
  if (!supportLocalStorage()) {
    return null;
  }
  const item = localStorage.getItem(key);
  const finalConfig = getFinalConfig(localConfig);
  if (!item) {
    return null;
  }

  //   let itemValue = finalConfig.encrypter ? JSON.parse(item) : item;
  try {
    let itemValue = item != null ? JSON.parse(item) : item;
    const hasExpiry = itemValue.expiry !== undefined && itemValue.expiry;
    const hasEncrypter = finalConfig.encrypter != undefined;

    let finalValue;
    if (finalConfig.decrypter && hasEncrypter) {
      // need to decrypter the value
      finalValue = JSON.parse(finalConfig.decrypter(itemValue.value));
    } else {
      finalValue = itemValue.value;
    }

    if (hasExpiry && Date.now() > itemValue.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    return finalValue;
  } catch (error) {
    console.log('localStorage get error: ', error, ' will delete the item in localStorage');
    localStorage.removeItem(key);
    return null;
  }
};

const remove = (key: string): undefined | false => {
  if (!supportLocalStorage()) return false;
  localStorage.removeItem(key);
};

export default {
  set,
  get,
  remove,
};
