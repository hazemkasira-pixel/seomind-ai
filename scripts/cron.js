const cron = require('node-cron')
const { exec } = require('child_process')

console.log('🕐 Starting cron job scheduler...')

// تشغيل النشر التلقائي كل يوم الساعة 3 فجراً
cron.schedule('0 3 * * *', () => {
  console.log('⏰ Running daily publish job...')
  exec('node scripts/daily-publish.js', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`)
      return
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`)
      return
    }
    console.log(`Stdout: ${stdout}`)
  })
})

console.log('✅ Cron job scheduled: Daily at 3:00 AM')