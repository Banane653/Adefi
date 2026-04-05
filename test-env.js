// test-env.js
require('dotenv').config();
console.log("DATABASE_URL trouvée :", process.env.DATABASE_URL ? "OUI ✅" : "NON ❌");