USE db_isys2099;

CREATE TABLE roles (
	role_id INT NOT NULL AUTO_INCREMENT,
	role_name VARCHAR(20),
	PRIMARY KEY (role_id)
);

CREATE TABLE users (
	id INT NOT NULL AUTO_INCREMENT, 
	role INT NOT NULL,
	username VARCHAR(20) NOT NULL UNIQUE,
	pw VARCHAR(20) NOT NULL,
	phone VARCHAR(11) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    sex CHAR(1),
    birth_date DATE,
    PRIMARY KEY (id),
    FOREIGN KEY (role) REFERENCES ROLES(role_id)
);

CREATE TABLE patients (
	p_id INT NOT NULL,
    address VARCHAR(255),
    allergies VARCHAR(255),
    PRIMARY KEY (p_id),
    FOREIGN KEY (p_id) REFERENCES USERS(id)
);

CREATE TABLE jobs (
    job_id INT NOT NULL AUTO_INCREMENT,
    job_title VARCHAR(50) NOT NULL,
    description VARCHAR(255) NOT NULL,
    PRIMARY KEY (job_id)
);

CREATE TABLE departments (
    dept_id INT NOT NULL,
    dept_name VARCHAR(50) NOT NULL,
    description VARCHAR(255),
    PRIMARY KEY (dept_id)
);

CREATE TABLE dept_locations (
	uuid INT NOT NULL AUTO_INCREMENT,
    dept_id INT NOT NULL,
    location VARCHAR(255) NOT NULL,
    PRIMARY KEY (uuid),
    FOREIGN KEY (dept_id) REFERENCES DEPARTMENTS(dept_id)
);

CREATE TABLE staff (
    s_id INT NOT NULL,
    job_id INT NOT NULL,
    dept_id INT NOT NULL,
    manager_id INT,
    qualifications VARCHAR(255) NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (s_id),
    FOREIGN KEY (s_id) REFERENCES USERS(id),
    FOREIGN KEY (job_id) REFERENCES JOBS(job_id),
    FOREIGN KEY (dept_id) REFERENCES DEPARTMENTS(dept_id),
    FOREIGN KEY (manager_id) REFERENCES STAFF(s_id)
);

CREATE TABLE job_history (
    s_id INT NOT NULL,
    job_id INT NOT NULL,
    start_date DATE NOT NULL,
    job_status TINYINT(1) NOT NULL,
    PRIMARY KEY (s_id, job_id),
    FOREIGN KEY (s_id) REFERENCES STAFF(s_id),
    FOREIGN KEY (job_id) REFERENCES JOBS(job_id)
);

CREATE TABLE appointments (
    meeting_date DATE NOT NULL,
    p_id INT NOT NULL,
    s_id INT NOT NULL,
    purpose VARCHAR(255) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    location VARCHAR(255),
    meeting_link VARCHAR(255),
    meeting_status TINYINT(1),
    PRIMARY KEY (meeting_date, p_id, s_id),
    FOREIGN KEY (p_id) REFERENCES PATIENTS(p_id),
    FOREIGN KEY (s_id) REFERENCES STAFF(s_id)
);

CREATE TABLE treatments (
    t_id INT NOT NULL AUTO_INCREMENT,
    p_id INT NOT NULL,
    doctor_id INT NOT NULL,
    description VARCHAR(255) NOT NULL,
    treatment_date DATETIME NOT NULL,
    PRIMARY KEY (t_id),
    FOREIGN KEY (p_id) REFERENCES PATIENTS(p_id),
    FOREIGN KEY (doctor_id) REFERENCES STAFF(s_id)
);

CREATE TABLE schedules (
	scheduled_id INT NOT NULL AUTO_INCREMENT,
    scheduled_date DATE NOT NULL,
    s_id INT NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    description VARCHAR(255),
    PRIMARY KEY (scheduled_id),
    FOREIGN KEY (s_id) REFERENCES STAFF(s_id)
);

CREATE TABLE reports (
    report_id INT NOT NULL AUTO_INCREMENT,
    t_id INT NOT NULL,
    workload INT,
    performance INT,
    billing DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (report_id),
    FOREIGN KEY (t_id) REFERENCES TREATMENTS(t_id)
);


-- Insert roles
INSERT INTO roles (role_name) VALUES 
('Admin'), 
('Staff'),
('Patient');

-- Insert users
INSERT INTO users (role, username, pw, phone, email) VALUES 
(1, 'superadmin', 'admin1234', '1234567890', 'admin@rmit.edu.vn'),
(2, 'duyRMIT', 'duy1234', '0987654321', 'duy@rmit.edu.vn'),
(2, 'anhRMIT', 'anh1234', '1122334455', 'anh@rmit.edu.vn'),
(3, 'khanhRMIT', 'khanh1234', '2233445566', 'khanh@rmit.edu.vn'),
(3, 'tienRMIT', 'tien1234', '3344556677', 'tien@rmit.edu.vn');

