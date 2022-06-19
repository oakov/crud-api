import { APIURL } from './const.js';

const isValidUrl = (url: string): boolean => {
  const urlPaths: string[] = url.split('/');
  const samplePaths: string[] = APIURL.split('/');
  if (urlPaths.length < 3 || urlPaths.length > 4) return false;
  if (urlPaths[1] !== samplePaths[1] || urlPaths[2] !== samplePaths[2])
    return false;
  return true;
};

export default isValidUrl;
