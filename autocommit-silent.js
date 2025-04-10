#!/usr/bin/env node

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

// Mendapatkan __dirname di ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fungsi untuk mendapatkan perubahan yang belum di-commit
function getUncommittedChanges() {
  try {
    // Mendapatkan daftar file yang diubah
    const changedFiles = execSync('git status --porcelain').toString().trim();
    
    if (!changedFiles) {
      console.log('Tidak ada perubahan yang perlu di-commit.');
      return null;
    }
    
    // Mendapatkan diff untuk setiap file yang diubah
    const diffOutput = execSync('git diff').toString();
    
    // Mendapatkan daftar file yang diubah
    const filesChanged = changedFiles
      .split('\n')
      .map(line => line.substring(3))
      .filter(file => file);
    
    return {
      files: filesChanged,
      diff: diffOutput
    };
  } catch (error) {
    console.error('Error mendapatkan perubahan:', error.message);
    return null;
  }
}

// Fungsi untuk menganalisis perubahan dan membuat deskripsi commit
function generateCommitMessage(changes) {
  if (!changes) return null;
  
  const { files, diff } = changes;
  
  // Mendapatkan jenis perubahan berdasarkan ekstensi file
  const fileTypes = new Set();
  files.forEach(file => {
    const ext = path.extname(file).toLowerCase();
    if (ext) fileTypes.add(ext);
  });
  
  // Mendapatkan direktori yang diubah
  const directories = new Set();
  files.forEach(file => {
    const dir = path.dirname(file);
    if (dir !== '.') directories.add(dir);
  });
  
  // Menganalisis diff untuk mendapatkan jenis perubahan
  const addedLines = (diff.match(/^\+/gm) || []).length;
  const removedLines = (diff.match(/^-/gm) || []).length;
  
  // Membuat deskripsi commit
  let description = 'Update: ';
  
  // Menambahkan informasi tentang file yang diubah
  if (files.length === 1) {
    description += `Modifikasi file ${files[0]}`;
  } else {
    description += `${files.length} file diubah`;
    
    if (directories.size > 0) {
      description += ` dalam ${directories.size} direktori`;
    }
  }
  
  // Menambahkan informasi tentang jenis file
  if (fileTypes.size > 0) {
    const fileTypesStr = Array.from(fileTypes).join(', ');
    description += ` (${fileTypesStr})`;
  }
  
  // Menambahkan informasi tentang jumlah perubahan
  description += `\n\nPerubahan: +${addedLines} -${removedLines} baris`;
  
  // Menambahkan daftar file yang diubah
  description += '\n\nFile yang diubah:';
  files.forEach(file => {
    description += `\n- ${file}`;
  });
  
  return description;
}

// Fungsi untuk melakukan commit
function commitChanges(commitMessage) {
  try {
    // Menambahkan semua perubahan
    execSync('git add .');
    
    // Melakukan commit dengan pesan yang dihasilkan
    execSync(`git commit -m "${commitMessage}"`);
    
    console.log('Commit berhasil dilakukan!');
    return true;
  } catch (error) {
    console.error('Error melakukan commit:', error.message);
    return false;
  }
}

// Fungsi utama
function main() {
  console.log('Memeriksa perubahan...');
  
  const changes = getUncommittedChanges();
  if (!changes) return;
  
  const commitMessage = generateCommitMessage(changes);
  if (!commitMessage) return;
  
  console.log('Melakukan commit dengan deskripsi:');
  console.log('----------------------------------------');
  console.log(commitMessage);
  console.log('----------------------------------------');
  
  commitChanges(commitMessage);
}

// Jalankan fungsi utama
main(); 