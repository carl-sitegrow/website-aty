import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

function updateRuntimeConfigs(dir) {
  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      
      if (entry.isDirectory()) {
        updateRuntimeConfigs(fullPath);
      } else if (entry.name === '.vc-config.json') {
        try {
          const config = JSON.parse(readFileSync(fullPath, 'utf-8'));
          if (config.runtime && config.runtime !== 'nodejs20.x') {
            config.runtime = 'nodejs20.x';
            writeFileSync(fullPath, JSON.stringify(config, null, '\t') + '\n');
            console.log(`✅ Updated ${fullPath} to use nodejs20.x`);
          }
        } catch (error) {
          console.warn(`⚠️  Error processing ${fullPath}:`, error.message);
        }
      }
    }
  } catch (error) {
    // Directory doesn't exist or can't be read
  }
}

const functionsDir = join(process.cwd(), '.vercel/output/functions');
if (existsSync(functionsDir)) {
  updateRuntimeConfigs(functionsDir);
} else {
  console.warn('⚠️  .vercel/output/functions not found, skipping runtime update');
}
