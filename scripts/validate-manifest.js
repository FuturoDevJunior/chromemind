#!/usr/bin/env node

/**
 * Manifest Validator for ChromeMind Extension
 * Validates manifest.json against Chrome Extension requirements
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function validateManifest() {
  console.log('🔍 Validating ChromeMind manifest.json...\n');
  
  try {
    // Read manifest file
    const manifestPath = path.join(__dirname, '..', 'manifest.json');
    const manifestContent = fs.readFileSync(manifestPath, 'utf8');
    const manifest = JSON.parse(manifestContent);
    
    let isValid = true;
    const errors = [];
    const warnings = [];
    
    // Required fields validation
    const requiredFields = ['manifest_version', 'name', 'version'];
    requiredFields.forEach(field => {
      if (!manifest[field]) {
        errors.push(`Missing required field: ${field}`);
        isValid = false;
      }
    });
    
    // Manifest version validation
    if (manifest.manifest_version !== 3) {
      errors.push('Manifest version must be 3 for modern Chrome extensions');
      isValid = false;
    }
    
    // Chrome Built-in AI specific validation
    const requiredPermissions = ['activeTab', 'scripting', 'storage', 'sidePanel'];
    const hasPermissions = manifest.permissions || [];
    
    requiredPermissions.forEach(permission => {
      if (!hasPermissions.includes(permission)) {
        errors.push(`Missing required permission: ${permission}`);
        isValid = false;
      }
    });
    
    // Host permissions validation
    if (!manifest.host_permissions || !manifest.host_permissions.includes('<all_urls>')) {
      warnings.push('Consider adding <all_urls> host permission for content script access');
    }
    
    // Service worker validation
    if (!manifest.background || !manifest.background.service_worker) {
      errors.push('Missing service worker configuration');
      isValid = false;
    }
    
    // Side panel validation
    if (!manifest.side_panel || !manifest.side_panel.default_path) {
      errors.push('Missing side panel configuration');
      isValid = false;
    }
    
    // Content scripts validation
    if (!manifest.content_scripts || manifest.content_scripts.length === 0) {
      warnings.push('No content scripts defined - may limit functionality');
    }
    
    // Icons validation
    if (!manifest.icons) {
      warnings.push('No icons defined - consider adding for better UX');
    } else {
      const requiredSizes = ['16', '48', '128'];
      requiredSizes.forEach(size => {
        if (!manifest.icons[size]) {
          warnings.push(`Missing icon size: ${size}px`);
        }
      });
    }
    
    // File existence validation
    const filesToCheck = [
      manifest.background?.service_worker,
      manifest.side_panel?.default_path,
      ...(manifest.content_scripts?.map(cs => cs.js).flat() || []),
      ...Object.values(manifest.icons || {})
    ].filter(Boolean);
    
    filesToCheck.forEach(file => {
      const fullPath = path.join(__dirname, '..', file);
      if (!fs.existsSync(fullPath)) {
        errors.push(`Referenced file not found: ${file}`);
        isValid = false;
      }
    });
    
    // Output results
    if (errors.length > 0) {
      console.log('❌ Validation Errors:');
      errors.forEach(error => console.log(`   - ${error}`));
      console.log('');
    }
    
    if (warnings.length > 0) {
      console.log('⚠️  Warnings:');
      warnings.forEach(warning => console.log(`   - ${warning}`));
      console.log('');
    }
    
    if (isValid) {
      console.log('✅ Manifest validation passed!');
      console.log(`📦 Extension: ${manifest.name} v${manifest.version}`);
      console.log(`🎯 APIs: ${(manifest.content_scripts?.length || 0) + 1} scripts, ${Object.keys(manifest.icons || {}).length} icons`);
    } else {
      console.log('❌ Manifest validation failed!');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ Failed to validate manifest:', error.message);
    process.exit(1);
  }
}

// Run validation if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  validateManifest();
}

export { validateManifest };