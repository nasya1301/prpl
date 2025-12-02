-- Alter kegiatan_id to nullable
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'apbdes_rincian' AND column_name = 'kegiatan_id'
    ) THEN
        ALTER TABLE apbdes_rincian DROP COLUMN kegiatan_id;
    END IF;
END $$;

-- Drop uraian column if exists
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'apbdes_rincian' AND column_name = 'uraian'
    ) THEN
        ALTER TABLE apbdes_rincian DROP COLUMN uraian;
    END IF;
END $$;

-- Add apbdes_id if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'apbdes_rincian' AND column_name = 'apbdes_id'
    ) THEN
        ALTER TABLE apbdes_rincian ADD COLUMN apbdes_id TEXT REFERENCES apbdes(id) ON DELETE CASCADE;
    END IF;
END $$;
