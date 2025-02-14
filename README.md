# Fireverse Music Bot

This repository contains a music bot for Fireverse that automates the process of interacting with the Fireverse music platform. The bot logs in with multiple accounts, plays recommended songs, likes them, and leaves comments.

[Register Link](https://web3.fireverseai.com/login/?invite=8IPB6A&url=https://app.fireverseai.com/user)

## Table of Contents
- [English Instructions](#english-instructions)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Getting GROQ API Keys](#getting-groq-api-keys)
- [Instruksi Bahasa Indonesia](#instruksi-bahasa-indonesia)
  - [Prasyarat](#prasyarat)
  - [Instalasi](#instalasi)
  - [Penggunaan](#penggunaan)
  - [Mendapatkan Kunci API GROQ](#mendapatkan-kunci-api-groq)

## English Instructions

### Prerequisites
- Node.js v20.18.1 or later
- npm (Node Package Manager)
- A GitHub account
- Fireverse API token(s)

### Installation
1. **Clone the repository:**
    ```sh
    git clone https://github.com/0xsyo/fireverse.git
    cd fireverse
    ```

2. **Install dependencies:**
    ```sh
    npm install
    ```

3. **Create a `.env` file:**
    Create a file named `.env` in the root directory of the project and add your GROQ API key:
    ```
    GROQ_API_KEY=your_groq_api_key_here
    ```

4. **Add your Fireverse API tokens:**
    Create a file named `tokens.txt` in the root directory of the project and add your Fireverse API tokens, one per line:
    ```
    token1
    token2
    ```

### Usage
1. **Run the bot:**
    ```sh
    node main.js
    ```

2. The bot will log in with each account, play recommended songs, like them, and leave comments automatically.

### Getting GROQ API Keys
1. **Visit the GROQ API website:**
    Go to [GROQ API](https://console.groq.com/keys) and sign up for an account if you don't already have one.

2. **Create a new API key:**
    Once logged in, navigate to the API keys section and create a new API key. Copy this key to use in your `.env` file.

## Instruksi Bahasa Indonesia

### Prasyarat
- Node.js v20.18.1 atau lebih baru
- npm (Node Package Manager)
- Akun GitHub
- Token API Fireverse

### Instalasi
1. **Clone repositori:**
    ```sh
    git clone https://github.com/0xsyo/fireverse.git
    cd fireverse
    ```

2. **Instal dependensi:**
    ```sh
    npm install
    ```

3. **Buat file `.env`:**
    Buat file bernama `.env` di direktori root proyek dan tambahkan kunci API GROQ Anda:
    ```
    GROQ_API_KEY=your_groq_api_key_here
    ```

4. **Tambahkan token API Fireverse Anda:**
    Buat file bernama `tokens.txt` di direktori root proyek dan tambahkan token API Fireverse Anda, satu per baris:
    ```
    token1
    token2
    ```

### Penggunaan
1. **Jalankan bot:**
    ```sh
    node main.js
    ```

2. Bot akan masuk dengan setiap akun, memutar lagu yang direkomendasikan, menyukai mereka, dan meninggalkan komentar secara otomatis.

### Mendapatkan Kunci API GROQ
1. **Kunjungi situs web GROQ API:**
    Buka [GROQ API](https://console.groq.com/keys) dan daftar untuk akun jika Anda belum memilikinya.

2. **Buat kunci API baru:**
    Setelah masuk, navigasikan ke bagian kunci API dan buat kunci API baru. Salin kunci ini untuk digunakan dalam file `.env` Anda.
``` ▋
