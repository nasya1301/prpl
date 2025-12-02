import { Pool } from "pg";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Database Configuration
const pool = new Pool({
  connectionString:
    process.env.DB_URL ||
    "postgresql://prpl_koma:password@localhost:5432/keuangan_desa",
});

const migrations = [
  "1_init_schema.sql",
  "2_kode_rekening.sql",
  "3_user.sql",
  "4_update_tabel_rincian.sql",
  "5_update_tabel_penjabaran.sql",
  "6_update_table_rincian.sql",
];

console.log("Running run-migrations.js...");
console.log("Migrations array:", migrations);

async function runMigrations() {
  const client = await pool.connect();

  try {
    console.log("🔄 Running database migrations...");

    for (const migration of migrations) {
      const filePath = join(__dirname, migration);
      console.log(`  📄 Executing ${migration}...`);

      try {
        const sql = readFileSync(filePath, "utf8");

        // Skip if file is empty or only contains comments
        const hasActualSQL = sql.split("\n").some((line) => {
          const trimmed = line.trim();
          return trimmed.length > 0 && !trimmed.startsWith("--");
        });

        if (hasActualSQL) {
          await client.query(sql);
          console.log(`  ✅ ${migration} completed`);
        } else {
          console.log(`  ⏭️  ${migration} skipped (empty/commented)`);
        }
      } catch (err) {
        // If error is about table already existing, we can ignore it
        if (err.code === "42P07") {
          console.log(`  ⚠️  ${migration} - tables already exist, skipping`);
        } else {
          throw err;
        }
      }
    }

    console.log("✅ All migrations completed successfully");
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Jalankan langsung tanpa check import.meta.url
runMigrations()
  .then(() => {
    console.log("✅ Migration process completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Migration process failed:", error);
    process.exit(1);
  });

export default runMigrations;
