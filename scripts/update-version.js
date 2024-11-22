const fs = require('fs');
const path = require('path');

const versionFilePath = path.join(__dirname, '..', 'src', 'config', 'version.ts');

// Lê o arquivo atual
const content = fs.readFileSync(versionFilePath, 'utf8');

// Extrai a versão atual
const currentVersion = content.match(/patch: (\d+)/)[1];

// Incrementa o número do patch
const newPatch = parseInt(currentVersion) + 1;

// Atualiza o conteúdo do arquivo
const newContent = content.replace(
  /patch: \d+/,
  `patch: ${newPatch}`
);

// Salva o arquivo
fs.writeFileSync(versionFilePath, newContent);

console.log(`Version updated to patch: ${newPatch}`);
