// Konfigurasi ini hanya dipakai untuk pemeriksaan manual di root proyek.
// Eksekusi eksperimen sebenarnya memakai sandbox sementara yang dibangun oleh
// scripts/05-run-suite.js, agar setiap skrip terisolasi dan hasilnya tidak saling mempengaruhi.
const config = require('./config/experiment.config.json');

module.exports = {
  testDir: './generated',
  timeout: config.execution.playwrightTimeoutMs,
  expect: { timeout: 7000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL: config.sut.baseUrl,
    headless: true,
    actionTimeout: 10000,
    navigationTimeout: 20000,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure'
  }
};
