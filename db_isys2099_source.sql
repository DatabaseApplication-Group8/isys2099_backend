-- -------------------------------------------------------------
-- TablePlus 6.1.2(568)
--
-- https://tableplus.com/
--
-- Database: db_isys2099
-- Generation Time: 2024-09-09 00:08:10.0660
-- -------------------------------------------------------------


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


DROP TABLE IF EXISTS `appointments`;
CREATE TABLE `appointments` (
  `appointment_id` int NOT NULL AUTO_INCREMENT,
  `meeting_date` date NOT NULL,
  `p_id` int NOT NULL,
  `s_id` int NOT NULL,
  `purpose` varchar(255) NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `meeting_status` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`appointment_id`),
  KEY `p_id` (`p_id`),
  KEY `s_id` (`s_id`),
  CONSTRAINT `appointments_ibfk_1` FOREIGN KEY (`p_id`) REFERENCES `patients` (`p_id`),
  CONSTRAINT `appointments_ibfk_2` FOREIGN KEY (`s_id`) REFERENCES `staff` (`s_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `departments`;
CREATE TABLE `departments` (
  `dept_id` int NOT NULL,
  `dept_name` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`dept_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `dept_locations`;
CREATE TABLE `dept_locations` (
  `uuid` int NOT NULL AUTO_INCREMENT,
  `dept_id` int NOT NULL,
  `location` varchar(255) NOT NULL,
  PRIMARY KEY (`uuid`),
  KEY `dept_id` (`dept_id`),
  CONSTRAINT `dept_locations_ibfk_1` FOREIGN KEY (`dept_id`) REFERENCES `departments` (`dept_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `job_history`;
CREATE TABLE `job_history` (
  `job_history_id` int NOT NULL AUTO_INCREMENT,
  `s_id` int NOT NULL,
  `job_id` int NOT NULL,
  `start_date` date NOT NULL,
  `job_status` tinyint(1) NOT NULL,
  PRIMARY KEY (`job_history_id`),
  KEY `job_id` (`job_id`),
  KEY `idx_sid_jobid` (`s_id`,`job_id`,`start_date`) USING BTREE,
  CONSTRAINT `job_history_ibfk_1` FOREIGN KEY (`s_id`) REFERENCES `users` (`id`),
  CONSTRAINT `job_history_ibfk_2` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`job_id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `jobs`;
CREATE TABLE `jobs` (
  `job_id` int NOT NULL AUTO_INCREMENT,
  `job_title` varchar(50) NOT NULL,
  `description` varchar(255) NOT NULL,
  PRIMARY KEY (`job_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `patients`;
CREATE TABLE `patients` (
  `p_id` int NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `allergies` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`p_id`),
  CONSTRAINT `patients_ibfk_1` FOREIGN KEY (`p_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `reports`;
CREATE TABLE `reports` (
  `report_id` int NOT NULL AUTO_INCREMENT,
  `t_id` int NOT NULL,
  `workload` int DEFAULT NULL,
  `performance` int DEFAULT NULL,
  `billing` decimal(10,2) NOT NULL,
  PRIMARY KEY (`report_id`),
  KEY `t_id` (`t_id`),
  CONSTRAINT `reports_ibfk_1` FOREIGN KEY (`t_id`) REFERENCES `treatments` (`t_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `role_id` int NOT NULL AUTO_INCREMENT,
  `role_name` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `schedules`;
CREATE TABLE `schedules` (
  `scheduled_id` int NOT NULL AUTO_INCREMENT,
  `scheduled_date` date NOT NULL,
  `s_id` int NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`scheduled_id`),
  KEY `s_id` (`s_id`),
  CONSTRAINT `schedules_ibfk_1` FOREIGN KEY (`s_id`) REFERENCES `staff` (`s_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `staff`;
CREATE TABLE `staff` (
  `s_id` int NOT NULL,
  `job_id` int NOT NULL,
  `dept_id` int NOT NULL,
  `manager_id` int DEFAULT NULL,
  `qualifications` varchar(255) NOT NULL,
  `salary` decimal(10,2) NOT NULL,
  PRIMARY KEY (`s_id`),
  KEY `job_id` (`job_id`),
  KEY `dept_id` (`dept_id`),
--   KEY `manager_id` (`manager_id`),
  CONSTRAINT `staff_ibfk_1` FOREIGN KEY (`s_id`) REFERENCES `users` (`id`),
  CONSTRAINT `staff_ibfk_2` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`job_id`),
  CONSTRAINT `staff_ibfk_3` FOREIGN KEY (`dept_id`) REFERENCES `departments` (`dept_id`)
--   CONSTRAINT `staff_ibfk_4` FOREIGN KEY (`manager_id`) REFERENCES `staff` (`s_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `treatments`;
CREATE TABLE `treatments` (
  `t_id` int NOT NULL AUTO_INCREMENT,
  `p_id` int NOT NULL,
  `doctor_id` int NOT NULL,
  `description` varchar(255) NOT NULL,
  `treatment_date` datetime NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `billing` int NOT NULL,
  PRIMARY KEY (`t_id`),
  KEY `p_id` (`p_id`),
  KEY `doctor_id` (`doctor_id`),
  CONSTRAINT `treatments_ibfk_1` FOREIGN KEY (`p_id`) REFERENCES `patients` (`p_id`),
  CONSTRAINT `treatments_ibfk_2` FOREIGN KEY (`doctor_id`) REFERENCES `staff` (`s_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role` int NOT NULL,
  `username` varchar(20) NOT NULL,
  `pw` varchar(128) NOT NULL,
  `Fname` varchar(50) NOT NULL,
  `Minit` varchar(50) DEFAULT NULL,
  `Lname` varchar(50) NOT NULL,
  `phone` varchar(11) NOT NULL,
  `email` varchar(50) NOT NULL,
  `sex` char(1) DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  KEY `role` (`role`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role`) REFERENCES `roles` (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `appointments` (`appointment_id`, `meeting_date`, `p_id`, `s_id`, `purpose`, `start_time`, `end_time`, `location`, `meeting_status`) VALUES
(1, '2024-09-12', 1, 8, 'Check-up', '22:00:00', '23:00:00', 'Room 101', 1),
(2, '2023-02-01', 1, 8, 'Check-up', '09:00:00', '10:00:00', 'Room 101', NULL);

INSERT INTO `departments` (`dept_id`, `dept_name`, `description`) VALUES
(1, 'Test', 'Test nha');

INSERT INTO `job_history` (`job_history_id`, `s_id`, `job_id`, `start_date`, `job_status`) VALUES
(1, 8, 2, '2024-09-07', 0),
(3, 1, 2, '2024-09-07', 0),
(10, 1, 2, '2024-09-07', 0),
(11, 1, 2, '2024-09-07', 1),
(12, 8, 2, '2024-09-08', 1),
(13, 17, 1, '2024-09-08', 1),
(14, 17, 2, '2024-09-08', 1),
(19, 19, 1, '2024-09-08', 0),
(41, 19, 1, '2024-09-08', 1),
(42, 19, 2, '2024-09-08', 0),
(43, 19, 2, '2024-09-08', 0),
(44, 19, 2, '2024-09-08', 1);

INSERT INTO `jobs` (`job_id`, `job_title`, `description`) VALUES
(1, 'doctor', 'take care patient'),
(2, 'nurse', 'dam vao mom patient');

INSERT INTO `patients` (`p_id`, `address`, `allergies`) VALUES
(1, 'abcbc', 'seafood');

INSERT INTO `roles` (`role_id`, `role_name`) VALUES
(1, 'Admin'),
(2, 'Staff'),
(3, 'Patient');

INSERT INTO `schedules` (`scheduled_id`, `scheduled_date`, `s_id`, `start_time`, `end_time`, `description`) VALUES
(1, '2024-09-12', 8, '20:15:00', '21:00:00', 'Meeting with department heann'),
(5, '2024-10-10', 8, '08:00:00', '17:00:00', 'Scheduled work day for staff member.'),
(6, '2024-09-14', 8, '20:00:00', '21:00:00', 'asdfasdf');

INSERT INTO `staff` (`s_id`, `job_id`, `dept_id`, `manager_id`, `qualifications`, `salary`) VALUES
(1, 1, 1, 1, 'abc', 60000.00),
(8, 1, 1, 1, 'sdfasd', 10000.00),
(11, 1, 1, 1, 'sdfasdff', 10000.00),
(12, 2, 1, 11, 'asdfas', 1000.00),
(14, 1, 1, 1, 'adsf', 989.00),
(15, 1, 1, 14, 'asdfasd', 1000.00),
(16, 2, 1, 15, 'asdfa', 20000.00),
(17, 1, 1, 16, 'asdfa', 10000.00),
(18, 2, 1, 17, 'asdfas', 1000.00),
(19, 1, 1, 17, 'asdf', 100.00);

INSERT INTO `treatments` (`t_id`, `p_id`, `doctor_id`, `description`, `treatment_date`, `start_time`, `end_time`, `billing`) VALUES
(9, 1, 1, 'Comprehensive dental cleaning and examination.', '2024-09-12 00:00:00', '09:00:00', '10:00:00', 5);

INSERT INTO `users` (`id`, `role`, `username`, `pw`, `Fname`, `Minit`, `Lname`, `phone`, `email`, `sex`, `birth_date`) VALUES
(1, 1, 'superadmin', 'admin1234', 'Admin', NULL, 'S', '1234567890', 'admin@rmit.edu.vn', NULL, '1970-01-01'),
(2, 2, 'duyRMIT', 'duy1234', 'Duy', NULL, 'Nguyen', '0987654321', 'duy@rmit.edu.vn', NULL, NULL),
(3, 2, 'anhRMIT', 'anh1234', 'Anh', NULL, 'Tran', '1122334455', 'anh@rmit.edu.vn', NULL, NULL),
(4, 3, 'khanhRMIT', 'khanh1234', 'Khanh', NULL, 'Ton', '2233445566', 'khanh@rmit.edu.vn', NULL, NULL),
(5, 3, 'tienRMIT', 'tien1234', 'Tien', NULL, 'Tran', '3344556677', 'tien@rmit.edu.vn', NULL, NULL),
(6, 2, 'dfdf', '$2b$10$24VvJKB0Yu0lJVQcPgYY1e2qmwxOAuftY1u.EzRK0ztMn6e.IV1fa', 'asdf', '', 'dasf', '0933103627', 'tranvuquanganh87@gmail.com', 'O', '2003-10-17'),
(7, 1, 'admin@gmail.com', '$2b$10$5A7/9NGTCi5GUexGPXiCteQPA4LPD3zwBHDwN1GQVShiuhhoE.xUO', 'Tran', 'Vu', 'Quang Anh', '0909872211', 'admin@gmail.com', 'O', '2003-05-02'),
(8, 2, 's3916566@rmit.edu.vn', '$2b$10$tNFDzKZIosaM2aGQI4PZL.pgiTXfY3zdPs5tAZPF7hsSDkxvbsZn.', 'Tran', 'Vu Quang', 'Anh', '0933103627', 'tranvuquangah87@gmail.com', 'O', '2003-10-17'),
(9, 2, 'tranvuquanganh87', '$2b$10$KtW1R.8yuMlG0P4iCZnboOmbnguACxiKoUEC0UMA58X8YTGAOWeEm', 'sdfadf', 'Vu Quang', 'asdf', '0933103627', 'tranvuquangah8777@gmail.com', 'O', '2003-10-17'),
(10, 2, 'tranvuquanganh878', '$2b$10$BsX5fIf54LZahYUHziSv.esXzW1bpPk6T98TI08mtyIXIwHZBcQKy', 'fdfdfd', 'Vu Quang', 'dfd', '0933103627', 'tranvuquanganh8777777777@gmail.com', 'O', '2003-10-17'),
(11, 2, '200lab_keycloak', '$2b$10$7Wm4TQMFedQpQUvFps6f/eWX7oY82jk8H996/N.71mmTaC3TrKjjy', 'Tran', 'Vu Quang', 'Anh', '0933103627', 'tranvuquangah1919@gmail.com', 'O', '2003-10-17'),
(12, 2, 'anhtranvl', '$2b$10$sbxWrF0//SGPyMM0/XqBBuYdURqec7lwNqfHT.h3KhDxMAGzVnRqu', 'Tran', 'Vu Quang', 'Anh', '0933103627', 'tranvuquangah91919191@gmail.com', 'O', '2003-10-17'),
(14, 2, 'fff', '$2b$10$VHlN.ZQsIaRuW6cBlQbwwen4UDw/mvAqPBNU1ccaBV8Yq3uRDK8Xu', 'a', 'd', 's', '0933103627', 'tranvuquangah0909@gmail.com', 'O', '2003-10-17'),
(15, 2, 'd', '$2b$10$DSjYDxGsnjPymaOKaWWimumUjSpLKlZmTA0TFLjHz/qmh/wkopUxG', 's', 'a', 'a', '0933103627', 'tranvuquangah2929@gmail.com', 'O', '2003-10-17'),
(16, 2, 'a', '$2b$10$0K2HTSpKnbHkxr14JTjMoOLV7IZk2rOiFZmG1EWsrSbng3E0o.yU2', 'f', 'v', 's', '0933103627', 'tranvuquangah999@gmail.com', 'O', '2003-10-17'),
(17, 2, 'a1', '$2b$10$Iqt4MaU/u09iElWP2TzSKOFfYqfWMMRm.fvA3yAANvH/u73V.U7ei', 'b', 'c', 'd', '0933103627', 'tranvuquangah45@gmail.com', 'O', '2003-10-17'),
(18, 2, 'c', '$2b$10$g4u7WN2knCN3KUjda9M3t.XaS16b4D6PahnXZH82duejMXziQTJL2', 's', 'Vu Quang', 'a', '0933103627', 'tranvuquangah@gmail.com', 'O', '2003-10-17'),
(19, 2, 'q', '$2b$10$bEp1KB4MdE5lnF7mlM5gZ.GdAt2ePUBK1YL5VejRcc.cg/qYWlKQS', 'w', 'Vu Quang', 'c c cc c ', '0933103627', 'tranvuquanganhvc@gmail.com', 'O', '0023-10-17');



/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;