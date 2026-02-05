#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function buildProduction() {
  // Clean dist directory
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
  }

  // Run production build
  try {
    execSync('npm run build:production', { stdio: 'inherit' });
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }

  // Verify server file exists
  const serverFile = path.join(__dirname, '../dist/index.js');
  if (!fs.existsSync(serverFile)) {
    console.error('❌ Server file not found:', serverFile);
    process.exit(1);
  }

  // Remove source maps from public directory
  const publicDir = path.join(__dirname, '../dist/public');
  if (fs.existsSync(publicDir)) {
    const files = fs.readdirSync(publicDir, { recursive: true });
    files.forEach(file => {
      if (typeof file === 'string' && file.endsWith('.map')) {
        const mapFile = path.join(publicDir, file);
        if (fs.existsSync(mapFile)) {
          fs.unlinkSync(mapFile);
        }
      }
    });
  }

  // Copy widget assets to dist
  try {
    const widgetsSource = path.join(__dirname, '../server/widgets');
    const widgetsDest = path.join(__dirname, '../dist/widgets');
    if (fs.existsSync(widgetsSource)) {
      fs.cpSync(widgetsSource, widgetsDest, { recursive: true });
      console.log('✅ Widget assets copied to dist/widgets');
    } else {
      console.warn('⚠️ Widget source directory not found:', widgetsSource);
    }
  } catch (error) {
    console.error('❌ Failed to copy widget assets:', error.message);
    process.exit(1);
  }

  // Copy widget CSS to public directory for static serving
  try {
    const cssSource = path.join(__dirname, '../server/widgets/webchat-widget.css');
    const cssDestDir = path.join(__dirname, '../dist/public/webchat');
    const cssDest = path.join(cssDestDir, 'widget.css');
    if (fs.existsSync(cssSource)) {
      if (!fs.existsSync(cssDestDir)) {
        fs.mkdirSync(cssDestDir, { recursive: true });
      }
      fs.cpSync(cssSource, cssDest);
      console.log('✅ Widget CSS copied to dist/public/webchat/widget.css');
    } else {
      console.warn('⚠️ Widget CSS source not found:', cssSource);
    }
  } catch (error) {
    console.error('❌ Failed to copy widget CSS to public:', error.message);
    process.exit(1);
  }

  // Note: Emoji picker is loaded from CDN with timeout and graceful fallback
  // To host locally, place emoji-picker-element build at dist/public/webchat/emoji-picker.js
  // The widget will attempt to load from local first, then fall back to CDN
  console.log('ℹ️  Emoji picker will be loaded from CDN (local hosting optional at dist/public/webchat/emoji-picker.js)');

  // Assert widget files exist after copy to prevent silent fallback in production
  const requiredWidgetFiles = [
    'webchat-widget.js',
    'webchat-widget.html',
    'webchat-widget.css'
  ];
  const widgetsDest = path.join(__dirname, '../dist/widgets');
  for (const file of requiredWidgetFiles) {
    const filePath = path.join(widgetsDest, file);
    if (!fs.existsSync(filePath)) {
      console.error(`❌ Required widget file not found after copy: ${filePath}`);
      process.exit(1);
    }
  }
  console.log('✅ All required widget files verified');

  console.log('✅ Production build completed successfully');
}

buildProduction().catch(error => {
  console.error('❌ Build failed:', error);
  process.exit(1);
});