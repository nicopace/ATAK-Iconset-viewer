import initSqlJs from 'sql.js';

let db: any = null;

export async function initDb() {
  if (db) return db;
  
  const SQL = await initSqlJs({
    locateFile: file => `https://sql.js.org/dist/${file}`
  });
  
  const response = await fetch('/iconsets.sqlite');
  const buf = await response.arrayBuffer();
  db = new SQL.Database(new Uint8Array(buf));
  
  return db;
}

export function getIconsets() {
  const result = db.exec('SELECT * FROM iconsets ORDER BY name');
  const returnval = result[0]?.values.map((row: any) => ({
    id: row[0],
    name: row[1],
    uid: row[2]
  })) || [];
  return returnval

}

export function getIconsBySet(setId: number) {
  console.log(setId);
  // For now, let's try with a simpler query to see what data we get
  
const result = db.exec(`
    SELECT id, groupName as iconset, filename, bitmap FROM icons 
    WHERE iconset_uid = ? 
    ORDER BY filename
  `, [setId]);
  
  const returnval = result[0]?.values.map((row: any) => ({
    id: row[0],
    iconset: row[1],
    filename: row[2],
    bitmap: row[3]
  })) || [];
  console.log(returnval);
  return returnval;
}

export function blobToDataUrl(blob: Uint8Array): string {
  return `data:image/png;base64,${btoa(
    Array.from(blob)
      .map(byte => String.fromCharCode(byte))
      .join('')
  )}`;
}