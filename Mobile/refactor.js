const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function refactorFile(filePath) {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
  
  let content = fs.readFileSync(filePath, 'utf-8');
  if (!content.includes('Theme')) return;
  // Skip already refactored
  if (content.includes('useStyles(createStyles)')) return;

  console.log('Refactoring', filePath);

  // 1. Add imports
  // Find depth to src
  const depth = filePath.split('src/')[1].split('/').length - 1;
  const relativePrefix = '../'.repeat(depth) || './';
  
  if (content.includes('import { Theme }')) {
    content = content.replace(/import { Theme } from ["'].*?theme["'];/, `$&
import { useTheme, useStyles } from "${relativePrefix}hooks/useTheme";`);
  } else {
    // If Theme is used but not explicitly imported as { Theme }... just skip or add
  }

  // 2. Inject hooks into component
  // Find 'export default function Name() {' or 'export function Name() {'
  content = content.replace(/export (default )?function ([a-zA-Z0-9_]+)\((.*?)\) \{/, `export $1function $2($3) {
  const theme = useTheme();
  const styles = useStyles(createStyles);`);

  // 3. Replace StyleSheet.create
  content = content.replace(/const styles = StyleSheet\.create\(\{/, `const createStyles = (theme: ReturnType<typeof useTheme>) => StyleSheet.create({`);

  // 4. Replace Theme. to theme.
  // Be careful with Theme.colors etc
  content = content.replace(/Theme\.colors/g, 'theme.colors');
  content = content.replace(/Theme\.spacing/g, 'theme.spacing');
  content = content.replace(/Theme\.radius/g, 'theme.radius');
  content = content.replace(/Theme\.typography/g, 'theme.typography');
  content = content.replace(/Theme\.shadows/g, 'theme.shadows');

  fs.writeFileSync(filePath, content, 'utf-8');
}

walkDir(path.join(__dirname, 'src/screens'), refactorFile);
walkDir(path.join(__dirname, 'src/components'), refactorFile);
// Also App.tsx and AppNavigator
if (fs.existsSync(path.join(__dirname, 'App.tsx'))) refactorFile(path.join(__dirname, 'App.tsx'));
if (fs.existsSync(path.join(__dirname, 'src/navigation/AppNavigator.tsx'))) refactorFile(path.join(__dirname, 'src/navigation/AppNavigator.tsx'));

console.log('Done refactoring');
