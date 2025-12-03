## ENV

Buat file `.env` dalam root folder dengan variabel berikut:

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```

- `GEMINI_API_KEY` — kunci API yang diperlukan untuk layanan Gemini.
- `PORT` — opsional. Defaultnya `3000` jika tidak diatur.

## Running App

install dependency dan jalankan aplikasi:

```bash
npm install
npm run dev
```