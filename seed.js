import { createClient } from '@supabase/supabase-js'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)

const companies = require('./src/data/companies.json')
const questions = require('./src/data/questions.json')

const supabase = createClient(
  'https://euyldwnzccifwwjdhoeg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1eWxkd256Y2NpZnd3amRob2VnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxNTg5NTAsImV4cCI6MjA5MTczNDk1MH0.pvZW-4cEHcYur2VoAdwoieJe-YFre40kUMjYMetEc0c'   // ← paste your anon key here
)

async function seed() {
  console.log('Seeding companies...')
  const { error: compError } = await supabase
    .from('companies')
    .insert(companies)
  if (compError) console.error('Companies error:', compError.message)
  else console.log('✅ Companies seeded!')

  console.log('Seeding questions...')
  const { error: qError } = await supabase
    .from('questions')
    .insert(questions)
  if (qError) console.error('Questions error:', qError.message)
  else console.log('✅ Questions seeded!')

  console.log('Done!')
}

seed()