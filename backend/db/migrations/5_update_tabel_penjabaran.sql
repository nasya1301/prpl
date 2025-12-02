-- Drop uraian column if exists
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'apbdes_rincian_penjabaran' AND column_name = 'uraian'
    ) THEN
        ALTER TABLE apbdes_rincian_penjabaran DROP COLUMN uraian;
    END IF;
END $$;

-- Add kode_fungsi_id if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'apbdes_rincian_penjabaran' AND column_name = 'kode_fungsi_id'
    ) THEN
        ALTER TABLE apbdes_rincian_penjabaran ADD COLUMN kode_fungsi_id TEXT REFERENCES kode_fungsi(id);
    END IF;
END $$;

-- Add kode_ekonomi_id if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'apbdes_rincian_penjabaran' AND column_name = 'kode_ekonomi_id'
    ) THEN
        ALTER TABLE apbdes_rincian_penjabaran ADD COLUMN kode_ekonomi_id TEXT REFERENCES kode_ekonomi(id);
    END IF;
END $$;