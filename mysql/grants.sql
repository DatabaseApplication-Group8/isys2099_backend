CREATE ROLE admin_role;
CREATE ROLE staff_role;
CREATE ROLE patient_role;
-- Grant ALL PRIVILEGES for admin role
GRANT ALL PRIVILEGES ON db_isys2099_new TO admin_role; FLUSH PRIVILEGES;
-- Grant access for staff role
GRANT SELECT, UPDATE ON db_isys2099_new.staff TO staff_role;
GRANT SELECT, UPDATE ON db_isys2099_new.schedules TO staff_role;
GRANT SELECT ON db_isys2099_new.appointments TO staff_role;
GRANT SELECT ON db_isys2099_new.treatments TO staff_role;
-- Grant access for patient role
GRANT SELECT, UPDATE ON db_isys2099_new.patients TO patient_role;
GRANT INSERT ON db_isys2099_new.users TO patient_role;
GRANT SELECT ON db_isys2099_new.schedules TO patient_role;
GRANT SELECT ON db_isys2099_new.appointments TO patient_role;
GRANT SELECT ON db_isys2099_new.treatments TO patient_role;
-- Create and grant role for admin user
CREATE USER 'adminG8'@'localhost' IDENTIFIED BY 'Isys2099@';
GRANT admin_role TO 'adminG8'@'localhost';FLUSH PRIVILEGES;
-- Create and grant role for staff user
CREATE USER 'staffUser'@'localhost' IDENTIFIED BY 'Isys2099@';
GRANT staff_role TO 'staffUser'@'localhost'; FLUSH PRIVILEGES;
-- Create and grant role for patient user
CREATE USER 'patientUser'@'localhost' IDENTIFIED BY 'Isys2099@';
GRANT patient_role TO 'patientUser'@'localhost';FLUSH PRIVILEGES;