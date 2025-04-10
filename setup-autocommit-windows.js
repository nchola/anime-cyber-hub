#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

// Mendapatkan __dirname di ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fungsi untuk membuat task di Windows Task Scheduler
function setupWindowsTask() {
  try {
    // Mendapatkan path absolut ke script autocommit
    const scriptPath = path.resolve(__dirname, 'autocommit-silent.js');
    const taskName = 'AutoCommitChanges';
    
    // Membuat file batch untuk menjalankan script
    const batchPath = path.join(process.cwd(), 'run-autocommit.bat');
    const batchContent = `@echo off
cd ${process.cwd()}
node ${scriptPath} >> ${path.join(process.cwd(), 'autocommit.log')} 2>&1
`;
    
    fs.writeFileSync(batchPath, batchContent);
    
    // Membuat task di Task Scheduler
    const createTaskCommand = `schtasks /create /tn "${taskName}" /tr "${batchPath}" /sc minute /mo 5 /f`;
    execSync(createTaskCommand);
    
    console.log('Task berhasil ditambahkan ke Windows Task Scheduler!');
    console.log(`Task akan dijalankan setiap 5 menit: ${batchPath}`);
    
    return true;
  } catch (error) {
    console.error('Error mengatur Windows Task:', error.message);
    return false;
  }
}

// Fungsi untuk menghapus task dari Windows Task Scheduler
function removeWindowsTask() {
  try {
    const taskName = 'AutoCommitChanges';
    
    // Menghapus task dari Task Scheduler
    const deleteTaskCommand = `schtasks /delete /tn "${taskName}" /f`;
    execSync(deleteTaskCommand);
    
    // Menghapus file batch
    const batchPath = path.join(process.cwd(), 'run-autocommit.bat');
    if (fs.existsSync(batchPath)) {
      fs.unlinkSync(batchPath);
    }
    
    console.log('Task berhasil dihapus dari Windows Task Scheduler!');
    
    return true;
  } catch (error) {
    console.error('Error menghapus Windows Task:', error.message);
    return false;
  }
}

// Fungsi utama
function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  if (command === 'setup') {
    setupWindowsTask();
  } else if (command === 'remove') {
    removeWindowsTask();
  } else {
    console.log('Penggunaan: node setup-autocommit-windows.js [setup|remove]');
    console.log('  setup  - Menambahkan task ke Windows Task Scheduler untuk autocommit');
    console.log('  remove - Menghapus task dari Windows Task Scheduler untuk autocommit');
  }
}

// Jalankan fungsi utama
main(); 