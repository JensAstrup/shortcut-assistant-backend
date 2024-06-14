import { config } from 'dotenv'

import app from './app'


config()

// eslint-disable-next-line no-magic-numbers
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`) 
})
