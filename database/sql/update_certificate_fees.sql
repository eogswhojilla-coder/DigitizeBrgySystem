-- ====================================================
-- Certificate Types - Fee Configuration
-- ====================================================
-- Run these queries to set up fees for your certificate types
-- Adjust the fees as needed for your barangay

-- Example 1: Barangay Clearance (with fee)
UPDATE certificate_types 
SET has_fee = 1, 
    fee = 50.00 
WHERE name = 'Barangay Clearance';

-- Example 2: Certificate of Residency (with fee)
UPDATE certificate_types 
SET has_fee = 1, 
    fee = 30.00 
WHERE name = 'Certificate of Residency';

-- Example 3: Certificate of Indigency (free)
UPDATE certificate_types 
SET has_fee = 0, 
    fee = 0.00 
WHERE name = 'Certificate of Indigency';

-- Example 4: Barangay ID (with fee)
UPDATE certificate_types 
SET has_fee = 1, 
    fee = 100.00 
WHERE name = 'Barangay ID';

-- View all certificate types with their fee status
SELECT 
    id,
    name,
    description,
    has_fee,
    fee,
    is_active,
    created_at
FROM certificate_types
ORDER BY name;

-- ====================================================
-- Alternative: Create new certificate types with fees
-- ====================================================

-- INSERT INTO certificate_types (name, description, has_fee, fee, is_active, created_at, updated_at)
-- VALUES 
--     ('Barangay Clearance', 'Certificate for various purposes requiring barangay clearance', 1, 50.00, 1, NOW(), NOW()),
--     ('Certificate of Residency', 'Proof of residency in the barangay', 1, 30.00, 1, NOW(), NOW()),
--     ('Certificate of Indigency', 'Certificate for indigent residents', 0, 0.00, 1, NOW(), NOW()),
--     ('Business Permit Clearance', 'Required for business permit applications', 1, 75.00, 1, NOW(), NOW());
