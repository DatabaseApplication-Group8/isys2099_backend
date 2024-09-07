use db_isys2099_new;

# 1.Patient

# Procedure for register a new patient
DROP PROCEDURE IF EXISTS RegisterNewPatient;

DELIMITER $$

CREATE PROCEDURE `RegisterNewPatient` (
    IN p_username VARCHAR(20),
    IN p_pw VARCHAR(128),
    IN p_Fname VARCHAR(50),
    IN p_Minit VARCHAR(50),
    IN p_Lname VARCHAR(50),
    IN p_phone VARCHAR(11),
    IN p_email VARCHAR(50),
    IN p_sex CHAR(1),
    IN p_birth_date DATE,
    IN p_address VARCHAR(255),
    IN p_allergies VARCHAR(255)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
        BEGIN
            ROLLBACK;
            SELECT 'Error: Registration failed. Please check the provided information.' AS Message;
        END;

    START TRANSACTION;

    -- Insert into users
    INSERT INTO `users` (`role`, `username`, `pw`, `Fname`, `Minit`, `Lname`, `phone`, `email`, `sex`, `birth_date`)
    VALUES (3, p_username, p_pw, p_Fname, p_Minit, p_Lname, p_phone, p_email, p_sex, p_birth_date);

    -- Get the newly inserted user ID that just created
    SET @new_p_id = LAST_INSERT_ID();

    -- Insert into patients
    INSERT INTO `patients` (`p_id`, `address`, `allergies`)
    VALUES (@new_p_id, p_address, p_allergies);

    COMMIT;

    SELECT 'Success: Patient registered successfully.' AS Message, @new_p_id AS patient_id;
END$$

DELIMITER ;

# Procedure for search by name or by ID

-- Drop Procedure
DROP PROCEDURE IF EXISTS SearchPatient;

-- Create Procedure
DELIMITER $$

CREATE PROCEDURE `SearchPatient` (
    IN search_p_id INT,
    IN search_Fname VARCHAR(50),
    IN search_Lname VARCHAR(50)
)
BEGIN
    IF search_p_id IS NOT NULL THEN
        SELECT
            u.id AS patient_id,
            u.Fname,
            u.Minit,
            u.Lname,
            u.phone,
            u.email,
            u.sex,
            u.birth_date,
            p.address,
            p.allergies
        FROM `users` u
                 JOIN `patients` p ON u.id = p.p_id
        WHERE u.id = search_p_id;
    ELSE
        SELECT
            u.id AS patient_id,
            u.Fname,
            u.Minit,
            u.Lname,
            u.phone,
            u.email,
            u.sex,
            u.birth_date,
            p.address,
            p.allergies
        FROM `users` u
                 JOIN `patients` p ON u.id = p.p_id
        WHERE
            (u.Fname LIKE CONCAT('%', search_Fname, '%') OR search_Fname IS NULL) AND
            (u.Lname LIKE CONCAT('%', search_Lname, '%') OR search_Lname IS NULL);
    END IF;
END$$

DELIMITER ;

# Procedure for add a treatment (with an associated doctor)

-- Drop Procedure
DROP PROCEDURE IF EXISTS AddTreatment;

-- Create Procedure

DELIMITER $$

CREATE PROCEDURE `AddTreatment` (
    IN t_p_id INT,
    IN t_doctor_id INT,
    IN t_description VARCHAR(255),
    IN t_treatment_date DATETIME,
    IN t_start_time TIME,
    IN t_end_time TIME,
    IN t_billing DECIMAL(10,2)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
        BEGIN
            ROLLBACK;
            SELECT 'Error: Failed to add treatment. Please check the provided information.' AS Message;
        END;

    START TRANSACTION;

    -- Verify the patient ID
    IF NOT EXISTS (SELECT 1 FROM `patients` WHERE `p_id` = t_p_id) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Error: Patient ID does not exist.';
    END IF;

    -- Verify the staff ID
    IF NOT EXISTS (SELECT 1 FROM `staff` WHERE `s_id` = t_doctor_id) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Error: Doctor ID does not exist.';
    END IF;

    -- Insert into treatments
    INSERT INTO `treatments` (`p_id`, `doctor_id`, `description`, `treatment_date`, `start_time`, `end_time`, `billing`)
    VALUES (t_p_id, t_doctor_id, t_description, t_treatment_date, t_start_time, t_end_time, t_billing);

    COMMIT;

    SELECT 'Success: Treatment added successfully.' AS Message, LAST_INSERT_ID() AS treatment_id;
END$$

DELIMITER ;


# 2.Staff

# Procedure for add a New Staff

-- Drop Procedure
DROP PROCEDURE IF EXISTS AddStaff;

-- Create Procedure

DELIMITER $$

CREATE PROCEDURE AddStaff (
    IN s_role INT,
    IN s_username VARCHAR(20),
    IN s_pw VARCHAR(128),
    IN s_Fname VARCHAR(50),
    IN s_Minit VARCHAR(50),
    IN s_Lname VARCHAR(50),
    IN s_phone VARCHAR(11),
    IN s_email VARCHAR(50),
    IN s_sex CHAR(1),
    IN s_birth_date DATE,
    IN s_job_id INT,
    IN s_dept_id INT,
    IN s_manager_id INT,
    IN s_qualifications VARCHAR(255),
    IN s_salary DECIMAL(10,2)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
        BEGIN
            ROLLBACK;
            SELECT 'Error: Failed to add staff. Please check the provided information.' AS Message;
        END;

    START TRANSACTION;

    -- Step 1: Insert into the `users` table (create the user)
    INSERT INTO `users` (`role`, `username`, `pw`, `Fname`, `Minit`, `Lname`, `phone`, `email`, `sex`, `birth_date`)
    VALUES (s_role, s_username, s_pw, s_Fname, s_Minit, s_Lname, s_phone, s_email, s_sex, s_birth_date);

    -- Step 2: Get the last inserted user ID
    SET @new_user_id = LAST_INSERT_ID();

    -- Step 3: Insert the new staff using the `new_user_id` from the users table
    INSERT INTO `staff` (`s_id`, `job_id`, `dept_id`, `manager_id`, `qualifications`, `salary`)
    VALUES (@new_user_id, s_job_id, s_dept_id, s_manager_id, s_qualifications, s_salary);

    COMMIT;

    SELECT 'Success: Staff added successfully.' AS Message, @new_user_id AS staff_id;
END$$

DELIMITER ;

# Procedure for list the Staff by Department

-- Drop Procedure
DROP PROCEDURE IF EXISTS ListStaffByDepartment;

-- Create Procedure

DELIMITER $$

CREATE PROCEDURE ListStaffByDepartment (
    IN d_dept_id INT
)
BEGIN
    SELECT s.*, u.Fname, u.Lname
    FROM `staff` s
             JOIN `users` u ON s.s_id = u.id
    WHERE s.dept_id = d_dept_id;
END$$

DELIMITER ;

# Procedure for List the Staff by Name (ASC/DESC)

-- Drop Procedure
DROP PROCEDURE IF EXISTS ListStaffByName;

-- Create Procedure

DELIMITER $$

CREATE PROCEDURE ListStaffByName (
    IN o_order VARCHAR(4) -- 'ASC' or 'DESC'
)
BEGIN
    IF o_order = 'ASC' THEN
        SELECT s.*, u.Fname, u.Lname
        FROM `staff` s
                 JOIN `users` u ON s.s_id = u.id
        ORDER BY u.Fname ASC, u.Lname ASC;
    ELSEIF o_order = 'DESC' THEN
        SELECT s.*, u.Fname, u.Lname
        FROM `staff` s
                 JOIN `users` u ON s.s_id = u.id
        ORDER BY u.Fname DESC, u.Lname DESC;
    ELSE
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Error: Invalid order specified. Use ASC or DESC.';
    END IF;
END$$

DELIMITER ;

# Procedure for Update a Staff Information

-- Drop Procedure
DROP PROCEDURE IF EXISTS UpdateStaffInfo;

-- Create Procedure

DELIMITER $$

CREATE PROCEDURE UpdateStaffInfo (
    IN u_s_id INT,
    IN u_job_id INT,
    IN u_dept_id INT,
    IN u_manager_id INT,
    IN u_qualifications VARCHAR(255),
    IN u_salary DECIMAL(10,2)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
        BEGIN
            ROLLBACK;
            SELECT 'Error: Failed to update staff information.' AS Message;
        END;

    START TRANSACTION;

    -- Verify staff ID
    IF NOT EXISTS (SELECT 1 FROM `staff` WHERE `s_id` = u_s_id) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Error: Staff ID does not exist.';
    END IF;

    -- Update staff
    UPDATE `staff`
    SET `job_id` = u_job_id,
        `dept_id` = u_dept_id,
        `manager_id` = u_manager_id,
        `qualifications` = u_qualifications,
        `salary` = u_salary
    WHERE `s_id` = u_s_id;

    COMMIT;

    SELECT 'Success: Staff information updated successfully.' AS Message;
END$$

DELIMITER ;


# Procedure for View Staff Schedule

-- Drop Procedure
DROP PROCEDURE IF EXISTS ViewStaffSchedule;

-- Create Procedure

DELIMITER $$

CREATE PROCEDURE ViewStaffSchedule (
    IN s_s_id INT
)
BEGIN
    SELECT *
    FROM `schedules`
    WHERE `s_id` = s_s_id
    ORDER BY `scheduled_date` DESC, `start_time` DESC;
END$$

DELIMITER ;


# Procedure for Update Staff Schedule

-- Drop Procedure
DROP PROCEDURE IF EXISTS UpdateStaffSchedule;

-- Create Procedure

DELIMITER $$

CREATE PROCEDURE UpdateStaffSchedule (
    IN u_s_id INT,
    IN u_scheduled_id INT,
    IN u_scheduled_date DATE,
    IN u_start_time TIME,
    IN u_end_time TIME,
    IN u_description VARCHAR(255)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
        BEGIN
            ROLLBACK;
            SELECT 'Error: Failed to update schedule. Clash schedule detected.' AS Message;
        END;

    START TRANSACTION;

    -- Check the appointment clash
    IF EXISTS (
        SELECT 1 FROM `appointments`
        WHERE `s_id` = u_s_id
          AND `meeting_date` = u_scheduled_date
          AND `start_time` < u_end_time
          AND `end_time` > u_start_time
          AND `meeting_status` = 1 -- Only consider active appointments
          AND `meeting_date` >= CURDATE()
    ) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Error: The new schedule conflicts with existing appointments.';
    END IF;

    -- Check the treatment clash
    IF EXISTS (
        SELECT 1 FROM `treatments`
        WHERE `doctor_id` = u_s_id
          AND DATE(`treatment_date`) = u_scheduled_date
          AND `start_time` < u_end_time
          AND `end_time` > u_start_time
    ) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Error: The new schedule conflicts with existing treatments.';
    END IF;

    -- Update the schedule
    UPDATE `schedules`
    SET `scheduled_date` = u_scheduled_date,
        `start_time` = u_start_time,
        `end_time` = u_end_time,
        `description` = u_description
    WHERE `scheduled_id` = u_scheduled_id
      AND `s_id` = u_s_id;

    COMMIT;

    SELECT 'Success: Schedule updated successfully.' AS Message;
END$$

DELIMITER ;


# 3.Appointment

# Procedure for View Working Schedule of All Doctors for a Given Duration
-- Drop Procedure
DROP PROCEDURE IF EXISTS ViewDoctorSchedule;

-- Create Procedure

DELIMITER $$

CREATE PROCEDURE ViewDoctorSchedule (
    IN p_start_date DATE,
    IN p_end_date DATE
)
BEGIN
    -- Include schedule table
    SELECT
        s.s_id AS doctor_id,
        CONCAT(u.Fname, ' ', u.Lname) AS doctor_name,
        'Schedule' AS schedule_type,
        sc.scheduled_date AS date,
        sc.start_time,
        sc.end_time,
        sc.description AS details,
        'Active' AS status
    FROM
        staff s
            JOIN
        users u ON s.s_id = u.id
            LEFT JOIN
        schedules sc ON s.s_id = sc.s_id
    WHERE
        sc.scheduled_date BETWEEN p_start_date AND p_end_date

    UNION ALL

    --  Include appointment table
    SELECT
        s.s_id AS doctor_id,
        CONCAT(u.Fname, ' ', u.Lname) AS doctor_name,
        'Appointment' AS schedule_type,
        a.meeting_date AS date,
        a.start_time,
        a.end_time,
        a.purpose AS details,
        CASE
            WHEN a.meeting_status = 1 THEN 'Active'
            ELSE 'Canceled'
            END AS status
    FROM
        staff s
            JOIN
        users u ON s.s_id = u.id
            LEFT JOIN
        appointments a ON s.s_id = a.s_id
    WHERE
        a.meeting_date BETWEEN p_start_date AND p_end_date

    UNION ALL

    -- Include treatment table
    SELECT
        s.s_id AS doctor_id,
        CONCAT(u.Fname, ' ', u.Lname) AS doctor_name,
        'Treatment' AS schedule_type,
        t.treatment_date AS date,
        t.start_time,
        t.end_time,
        t.description AS details,
        'Active' AS status
    FROM
        staff s
            JOIN
        users u ON s.s_id = u.id
            LEFT JOIN
        treatments t ON s.s_id = t.doctor_id
    WHERE
      t.treatment_date BETWEEN p_start_date AND p_end_date

    ORDER BY
        doctor_id, date, start_time;

END$$

DELIMITER ;


# Procedure for Book an Appointment with a Doctor
-- Drop Procedure
DROP PROCEDURE IF EXISTS BookAppointment ;

-- Create Procedure

DELIMITER $$

CREATE PROCEDURE BookAppointment (
    IN a_p_id INT,
    IN a_s_id INT,
    IN a_meeting_date DATE,
    IN a_start_time TIME,
    IN a_end_time TIME,
    IN a_purpose VARCHAR(255),
    IN a_location VARCHAR(255)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
        BEGIN
            ROLLBACK;
            SELECT 'Error: Failed to book appointment. Please check the provided information.' AS Message;
        END;

    START TRANSACTION;

    -- Verify patient ID
    IF NOT EXISTS (SELECT 1 FROM `patients` WHERE `p_id` = a_p_id) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Error: Patient ID does not exist.';
    END IF;

    -- Verify doctor ID
    IF NOT EXISTS (SELECT 1 FROM `staff` WHERE `s_id` = a_s_id ) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Error: Doctor ID does not exist.';
    END IF;

    -- Check for appointment clashes
    IF EXISTS (
        SELECT 1
        FROM appointments
        WHERE s_id = a_s_id
          AND meeting_date = a_meeting_date
          AND start_time < a_end_time
          AND end_time > a_start_time
          AND meeting_status = 1
    ) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Error: Doctor is already booked at this time.';
    END IF;

    -- Check for schedule clashes
    IF EXISTS (
        SELECT 1
        FROM schedules
        WHERE s_id = a_s_id
          AND scheduled_date = a_meeting_date
          AND start_time < a_start_time
          AND end_time > a_end_time
    ) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Error: The requested time does not match the doctor working schedule.';
    END IF;

    -- Check for treatment clashes
    IF EXISTS (
        SELECT 1
        FROM treatments
        WHERE doctor_id = a_s_id
          AND treatment_date = a_meeting_date
          AND start_time < a_end_time
          AND end_time > a_start_time
    ) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Error: The doctor is scheduled for a treatment at this time.';
    END IF;

    -- Book the appointment
    INSERT INTO appointments (meeting_date, p_id, s_id, purpose, start_time, end_time, location, meeting_status)
    VALUES (a_meeting_date, a_p_id, a_s_id, a_purpose, a_start_time, a_end_time, a_location, 1); -- Status 1 = Active

    COMMIT;

    SELECT 'Success: Appointment booked successfully.' AS Message;
END$$

DELIMITER ;


# Procedure for Cancel an Appointment with a Doctor
-- Drop Procedure
DROP PROCEDURE IF EXISTS CancelAppointment;

-- Create Procedure

DELIMITER $$

CREATE PROCEDURE CancelAppointment (
    IN c_appointment_id INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
        BEGIN
            ROLLBACK;
            SELECT 'Error: Failed to cancel the appointment.' AS Message;
        END;

    START TRANSACTION;

    -- Check if the appointment exists and is active
    IF NOT EXISTS (
        SELECT 1
        FROM appointments
        WHERE appointment_id = c_appointment_id
          AND meeting_status = 1 -- Only active appointments can be canceled
    ) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Error: Appointment does not exist or is not active.';
    END IF;

    -- Cancel the appointment
    UPDATE appointments
    SET meeting_status = 0
    WHERE appointment_id = c_appointment_id;

    COMMIT;

    SELECT 'Success: Appointment canceled successfully.' AS Message;
END$$

DELIMITER ;


# 4.Report

# Procedure for View a Patient Treatment History for a Given Duration
-- Drop Procedure
DROP PROCEDURE IF EXISTS ViewPatientTreatmentHistory;

-- Create Procedure

DELIMITER $$

CREATE PROCEDURE ViewPatientTreatmentHistory (
    IN v_p_id INT,
    IN v_start_date DATE,
    IN v_end_date DATE
)
BEGIN
    SELECT t.t_id, s.s_id as Doctor_id, t.description, t.treatment_date, t.start_time, t.end_time
    FROM treatments t
             JOIN staff s ON t.doctor_id = s.s_id
    WHERE t.p_id = v_p_id
      AND t.treatment_date BETWEEN v_start_date AND v_end_date
    ORDER BY t.treatment_date;
END$$

DELIMITER ;


# Procedure for View All Patient Treatments in a Given Duration
-- Drop Procedure
DROP PROCEDURE IF EXISTS ViewAllPatientTreatments;

-- Create Procedure

DELIMITER $$

CREATE PROCEDURE ViewAllPatientTreatments (
    IN v_start_date DATE,
    IN v_end_date DATE
)
BEGIN
    SELECT t.t_id AS treatment_id, p.p_id AS patient_id, s.s_id AS doctor_id,
           t.description, t.treatment_date
    FROM treatments t
             JOIN patients p ON t.p_id = p.p_id
             JOIN staff s ON t.doctor_id = s.s_id
    WHERE t.treatment_date BETWEEN v_start_date AND v_end_date
    ORDER BY t.treatment_date;
END$$

DELIMITER ;


# Procedure for View Job Change History of a Staff
-- Drop Procedure
DROP PROCEDURE IF EXISTS ViewStaffJobHistory;

-- Create Procedure

DELIMITER $$

CREATE PROCEDURE ViewStaffJobHistory (
    IN v_s_id INT
)
BEGIN
    SELECT j.job_title, h.s_id as staff_id, j.description, h.start_date, h.job_status
    FROM job_history h
             JOIN jobs j ON h.job_id = j.job_id
    WHERE h.s_id = v_s_id
    ORDER BY h.start_date;
END$$

DELIMITER ;


# Procedure for View the Work of a Doctor
-- Drop Procedure
DROP PROCEDURE IF EXISTS ViewDoctorWorkDetails;

-- Create Procedure

DELIMITER $$

CREATE PROCEDURE ViewDoctorWorkDetails (
    IN v_doctor_id INT,
    IN v_start_date DATE,
    IN v_end_date DATE
)
BEGIN
    -- Select the doctor's schedule in the given duration
    SELECT 'Schedule' AS ActivityType, s.scheduled_id AS ActivityID, s.scheduled_date AS ActivityDate,
           s.start_time AS StartTime, s.end_time AS EndTime, s.description AS Description
    FROM schedules s
    WHERE s.s_id = v_doctor_id
      AND s.scheduled_date BETWEEN v_start_date AND v_end_date

    UNION ALL

    -- Select the doctor's appointments in the given duration
    SELECT 'Appointment' AS ActivityType, a.appointment_id AS ActivityID, a.meeting_date AS ActivityDate,
           a.start_time AS StartTime, a.end_time AS EndTime, a.purpose AS Description
    FROM appointments a
             JOIN patients p ON a.p_id = p.p_id
    WHERE a.s_id = v_doctor_id
      AND a.meeting_date BETWEEN v_start_date AND v_end_date

    UNION ALL

    -- Select the doctor's treatments in the given duration
    SELECT 'Treatment' AS ActivityType, t.t_id AS ActivityID, t.treatment_date AS ActivityDate,
           t.start_time AS StartTime, t.end_time AS EndTime, t.description AS Description
    FROM treatments t
    WHERE t.doctor_id = v_doctor_id
      AND t.treatment_date BETWEEN v_start_date AND v_end_date

    ORDER BY ActivityDate, StartTime;
END$$

DELIMITER ;


# Procedure for View the Work of All Doctors in a Given Duration
-- Drop Procedure
DROP PROCEDURE IF EXISTS ViewAllDoctorsWorkDetails;

-- Create Procedure

DELIMITER $$

CREATE PROCEDURE ViewAllDoctorsWorkDetails (
    IN v_start_date DATE,
    IN v_end_date DATE
)
BEGIN
    -- Select the schedule for all doctors within the given date range
    SELECT 'Schedule' AS ActivityType, s.scheduled_id AS ActivityID, s.scheduled_date AS ActivityDate,
           s.start_time AS StartTime, s.end_time AS EndTime, s.description AS Description,
           CONCAT(u.Fname, ' ', u.Lname) AS DoctorName, s.s_id AS DoctorID
    FROM schedules s
             JOIN users u ON s.s_id = u.id  -- Assuming `users` table contains staff/doctor info
    WHERE s.scheduled_date BETWEEN v_start_date AND v_end_date

    UNION ALL

    -- Select the appointments for all doctors in the given duration
    SELECT 'Appointment' AS ActivityType, a.appointment_id AS ActivityID, a.meeting_date AS ActivityDate,
           a.start_time AS StartTime, a.end_time AS EndTime, a.purpose AS Description,
           CONCAT(u.Fname, ' ', u.Lname) AS DoctorName, a.s_id AS DoctorID
    FROM appointments a
             JOIN patients p ON a.p_id = p.p_id
             JOIN users u ON a.s_id = u.id
    WHERE a.meeting_date BETWEEN v_start_date AND v_end_date

    UNION ALL

    -- Select the treatments for all doctors in the given duration
    SELECT 'Treatment' AS ActivityType, t.t_id AS ActivityID, t.treatment_date AS ActivityDate,
           t.start_time AS StartTime, t.end_time AS EndTime, t.description AS Description,
           CONCAT(u.Fname, ' ', u.Lname) AS DoctorName, t.doctor_id AS DoctorID
    FROM treatments t
             JOIN users u ON t.doctor_id = u.id
    WHERE t.treatment_date BETWEEN v_start_date AND v_end_date

    ORDER BY ActivityDate, StartTime, DoctorID;
END$$

DELIMITER ;
