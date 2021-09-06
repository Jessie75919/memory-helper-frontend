import {isJson} from '@/helpers/StringHelper';

export default class StorageHelper {
  static set(key, val) {
    console.log(val);
    let _val = val;
    if (typeof _val === 'object') {
      _val = JSON.stringify(_val);
    }
    localStorage.setItem(key, _val);
  }

  static get(key) {
    const val = localStorage.getItem(key);
    return isJson(val) ? JSON.parse(val) : val;
  }

  static remove(key) {
    localStorage.removeItem(key);
  }

  static clear() {
    localStorage.clear();
  }
}