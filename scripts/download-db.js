import https from 'https';
import fs from 'fs';
import path from 'path';

const url = 'https://github.com/deptofdefense/AndroidTacticalAssaultKit-CIV/raw/refs/heads/main/atak/ATAK/app/src/main/assets/dbs/iconsets.sqlite';
const outputDir = './public';
const outputPath = path.join(outputDir, 'iconsets.sqlite');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

https.get(url, (response) => {
  if (response.statusCode !== 200) {
    console.error(`Failed to download: ${response.statusCode}`);
    return;
  }

  const file = fs.createWriteStream(outputPath);
  response.pipe(file);

  file.on('finish', () => {
    file.close();
    console.log('Database downloaded successfully');
  });
}).on('error', (err) => {
  console.error('Error downloading database:', err.message);
});