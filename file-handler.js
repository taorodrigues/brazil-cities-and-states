import { promises as fileSystem } from 'fs';

/**
 * Write array information in the file which name was specified.
 * @param {*} fileName file name
 * @param {*} data array information to be converted into JSON
 */
async function writeJsonData(fileName, data) {
  await fileSystem.writeFile(fileName, JSON.stringify(data));
}

/**
 * Read Json information from specified file.
 * @param {*} fileName file name
 */
async function readJsonData(fileName) {
  const recoveredData = await fileSystem.readFile(fileName);
  return JSON.parse(recoveredData);
}

export default { writeJsonData, readJsonData };
