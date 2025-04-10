# AutoCommit - Sistem Autocommit dengan Deskripsi Otomatis

Sistem ini memungkinkan Anda untuk melakukan commit secara otomatis dengan deskripsi yang dihasilkan berdasarkan perubahan kode yang dilakukan. Deskripsi commit akan mencakup informasi tentang file yang diubah, jenis file, dan jumlah perubahan.

## Fitur

- Mendeteksi perubahan yang belum di-commit
- Menghasilkan deskripsi commit otomatis berdasarkan perubahan
- Mendukung commit interaktif atau otomatis
- Dapat diintegrasikan dengan Git hooks
- Dapat dijalankan secara berkala menggunakan cron job (Linux/Mac) atau Task Scheduler (Windows)

## Cara Penggunaan

### 1. Commit Manual

Untuk melakukan commit manual dengan deskripsi otomatis:

```bash
node autocommit.js
```

Script ini akan menampilkan deskripsi commit yang akan digunakan dan meminta konfirmasi sebelum melakukan commit.

### 2. Commit Otomatis

Untuk melakukan commit otomatis tanpa konfirmasi:

```bash
node autocommit-silent.js
```

### 3. Menggunakan Git Hook

Untuk mengintegrasikan dengan Git hooks, pastikan file `.git/hooks/pre-commit` sudah memiliki izin eksekusi:

```bash
chmod +x .git/hooks/pre-commit
```

Setiap kali Anda melakukan commit, script autocommit akan dijalankan secara otomatis.

### 4. Menjalankan Secara Berkala

#### Linux/Mac (menggunakan cron)

Untuk mengatur cron job yang menjalankan script setiap 5 menit:

```bash
node setup-autocommit-cron.js setup
```

Untuk menghapus cron job:

```bash
node setup-autocommit-cron.js remove
```

#### Windows (menggunakan Task Scheduler)

Untuk mengatur task di Windows Task Scheduler:

```bash
node setup-autocommit-windows.js setup
```

Untuk menghapus task:

```bash
node setup-autocommit-windows.js remove
```

## Format Deskripsi Commit

Deskripsi commit yang dihasilkan akan memiliki format berikut:

```
Update: [jumlah file] file diubah dalam [jumlah direktori] direktori ([jenis file])

Perubahan: +[jumlah baris ditambahkan] -[jumlah baris dihapus] baris

File yang diubah:
- [daftar file yang diubah]
```

## Log

Jika Anda menggunakan cron job atau Task Scheduler, log akan disimpan di file `autocommit.log` di direktori proyek.

## Catatan

- Script ini memerlukan Node.js untuk dijalankan
- Pastikan Git sudah terinstal dan dikonfigurasi dengan benar
- Untuk cron job dan Task Scheduler, pastikan path ke Node.js dan script sudah benar 