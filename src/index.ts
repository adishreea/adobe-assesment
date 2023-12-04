import * as fs from 'fs';
import { DataType, ObjKeyType } from './types';

console.log('\nParsing the leads JSON file');
const rawData = fs.readFileSync('src/input/leads.json', 'utf-8');
const jsonData = JSON.parse(rawData);

const dataMap = new Map<ObjKeyType, DataType>();

jsonData.leads?.forEach((curObj: DataType) => {
  console.log(`\nCurrent record => ${JSON.stringify(curObj)}`);

  const objKey: ObjKeyType = { id: curObj._id, email: curObj.email };
  const dupObj: DataType = findDuplicate(dataMap, objKey);
  if (dupObj) {
    console.log('Status: Duplicate');
    console.log(`Existing record => ${JSON.stringify(dupObj)}`);

    const dupObjDate: Date = new Date(dupObj.entryDate);
    const curObjDate: Date = new Date(curObj.entryDate);
    if (curObjDate >= dupObjDate) {
      logDifferences(curObj, dupObj);
      dataMap.set(objKey, curObj);
    }
  } else {
    console.log('Status: Unique');
    dataMap.set(objKey, curObj);
  }
});

console.log('\n***** OUTPUT *****');
dataMap.forEach((x) => {
  console.log(JSON.stringify(x));
});

function findDuplicate(
  map: Map<ObjKeyType, DataType>,
  key: ObjKeyType,
): DataType {
  for (const entry of map.entries()) {
    // check if id or email is a duplicate
    if (entry[0].id === key.id || entry[0].email === key.email) {
      return entry[1];
    }
  }
}

function logDifferences(curObj: DataType, dupObj: DataType) {
  console.log('Replacing with the latest record, field differences as below:');

  Object.keys(curObj).forEach((key) => {
    if (curObj[key] != dupObj[key]) {
      console.log(`From value of '${key}': ${dupObj[key]}`);
      console.log(`To value of '${key}': ${curObj[key]}`);
    }
  });
}
