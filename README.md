# Fireverse Music Bot

This repository contains a music bot for Fireverse that automates the process of interacting with the Fireverse music platform. The bot logs in with multiple accounts, plays recommended songs, likes them, and leaves comments.

## Table of Contents
- [English Instructions](#english-instructions)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Usage](#usage)
- [Instruksi Bahasa Indonesia](#instruksi-bahasa-indonesia)
  - [Prasyarat](#prasyarat)
  - [Instalasi](#instalasi)
  - [Penggunaan](#penggunaan)

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
``` ▋
