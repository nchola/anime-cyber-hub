#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

// Mendapatkan __dirname di ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fungsi untuk membuat cron job
function setupCronJob() {
  try {
    // Mendapatkan path absolut ke script autocommit
    const scriptPath = path.resolve(__dirname, 'autocommit-silent.js');
    
    // Membuat cron job untuk menjalankan script setiap 5 menit
    const cronExpression = '*/5 * * * *';
    const cronCommand = `${cronExpression} cd ${process.cwd()} && node ${scriptPath} >> ${path.join(process.cwd(), 'autocommit.log')} 2>&1`;
    
    // Menambahkan cron job ke crontab
    const tempFile = path.join(os.tmpdir(), 'crontab-temp');
    
    // Mendapatkan crontab saat ini
    execSync(`crontab -l > ${tempFile} 2>/dev/null || echo "" > ${tempFile}`);
    
    // Menambahkan cron job baru
    const currentCrontab = fs.readFileSync(tempFile, 'utf8');
    
    // Cek apakah cron job sudah ada
    if (!currentCrontab.includes(scriptPath)) {
      const newCrontab = currentCrontab + '\n' + cronCommand + '\n';
      fs.writeFileSync(tempFile, newCrontab);
      
      // Menginstal crontab baru
      execSync(`crontab ${tempFile}`);
      
      console.log('Cron job berhasil ditambahkan!');
      console.log(`Script akan dijalankan setiap 5 menit: ${cronCommand}`);
    } else {
      console.log('Cron job sudah ada.');
    }
    
    // Membersihkan file temporary
    fs.unlinkSync(tempFile);
    
    return true;
  } catch (error) {
    console.error('Error mengatur cron job:', error.message);
    return false;
  }
}

// Fungsi untuk menghapus cron job
function removeCronJob() {
  try {
    // Mendapatkan path absolut ke script autocommit
    const scriptPath = path.resolve(__dirname, 'autocommit-silent.js');
    
    // Mendapatkan crontab saat ini
    const tempFile = path.join(os.tmpdir(), 'crontab-temp');
    execSync(`crontab -l > ${tempFile} 2>/dev/null || echo "" > ${tempFile}`);
    
    // Membaca crontab
    let currentCrontab = fs.readFileSync(tempFile, 'utf8');
    
    // Menghapus cron job yang mengandung script autocommit
    const lines = currentCrontab.split('\n');
    const filteredLines = lines.filter(line => !line.includes(scriptPath));
    
    // Menulis crontab baru
    fs.writeFileSync(tempFile, filteredLines.join('\n') + '\n');
    
    // Menginstal crontab baru
    execSync(`crontab ${tempFile}`);
    
    console.log('Cron job berhasil dihapus!');
    
    // Membersihkan file temporary
    fs.unlinkSync(tempFile);
    
    return true;
  } catch (error) {
    console.error('Error menghapus cron job:', error.message);
    return false;
  }
}

// Fungsi utama
function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  if (command === 'setup') {
    setupCronJob();
  } else if (command === 'remove') {
    removeCronJob();
  } else {
    console.log('Penggunaan: node setup-autocommit-cron.js [setup|remove]');
    console.log('  setup  - Menambahkan cron job untuk autocommit');
    console.log('  remove - Menghapus cron job untuk autocommit');
  }
}

// Jalankan fungsi utama
main(); 