-- Drop kegiatan_id column if exists
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'apbdes_rincian' AND column_name = 'kegiatan_id'
    ) THEN
        ALTER TABLE apbdes_rincian DROP COLUMN kegiatan_id;
    END IF;
END $$;
