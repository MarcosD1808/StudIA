import "dotenv/config";
import pg from "pg";

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 5000
});

(async () => {
  try {
    await client.connect();
    const r = await client.query("select now()");
    console.log("OK:", r.rows[0]);
  } catch (e) {
    console.error("DB TEST ERROR:", e.message);
  } finally {
    await client.end().catch(()=>{});
  }
})();