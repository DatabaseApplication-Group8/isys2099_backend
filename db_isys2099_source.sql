-- -------------------------------------------------------------
-- TablePlus 6.1.2(568)
--
-- https://tableplus.com/
--
-- Database: db_isys2099
-- Generation Time: 2024-08-17 21:16:10.5360
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
  `meeting_date` date NOT NULL,
  `p_id` int NOT NULL,
  `s_id` int NOT NULL,
  `purpose` varchar(255) NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `meeting_link` varchar(255) DEFAULT NULL,
  `meeting_status` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`meeting_date`,`p_id`,`s_id`),
  KEY `p_id` (`p_id`),
  KEY `s_id` (`s_id`),
  CONSTRAINT `appointments_ibfk_1` FOREIGN KEY (`p_id`) REFERENCES `patients` (`p_id`),
  CONSTRAINT `appointments_ibfk_2` FOREIGN KEY (`s_id`) REFERENCES `staff` (`s_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
  `s_id` int NOT NULL,
  `job_id` int NOT NULL,
  `start_date` date NOT NULL,
  `job_status` tinyint(1) NOT NULL,
  PRIMARY KEY (`s_id`,`job_id`),
  KEY `job_id` (`job_id`),
  CONSTRAINT `job_history_ibfk_1` FOREIGN KEY (`s_id`) REFERENCES `staff` (`s_id`),
  CONSTRAINT `job_history_ibfk_2` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`job_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `jobs`;
CREATE TABLE `jobs` (
  `job_id` int NOT NULL AUTO_INCREMENT,
  `job_title` varchar(50) NOT NULL,
  `description` varchar(255) NOT NULL,
  PRIMARY KEY (`job_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
  KEY `manager_id` (`manager_id`),
  CONSTRAINT `staff_ibfk_1` FOREIGN KEY (`s_id`) REFERENCES `users` (`id`),
  CONSTRAINT `staff_ibfk_2` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`job_id`),
  CONSTRAINT `staff_ibfk_3` FOREIGN KEY (`dept_id`) REFERENCES `departments` (`dept_id`),
  CONSTRAINT `staff_ibfk_4` FOREIGN KEY (`manager_id`) REFERENCES `staff` (`s_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `treatments`;
CREATE TABLE `treatments` (
  `t_id` int NOT NULL AUTO_INCREMENT,
  `p_id` int NOT NULL,
  `doctor_id` int NOT NULL,
  `description` varchar(255) NOT NULL,
  `treatment_date` datetime NOT NULL,
  PRIMARY KEY (`t_id`),
  KEY `p_id` (`p_id`),
  KEY `doctor_id` (`doctor_id`),
  CONSTRAINT `treatments_ibfk_1` FOREIGN KEY (`p_id`) REFERENCES `patients` (`p_id`),
  CONSTRAINT `treatments_ibfk_2` FOREIGN KEY (`doctor_id`) REFERENCES `staff` (`s_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role` int NOT NULL,
  `username` varchar(20) NOT NULL,
  `pw` varchar(20) NOT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `roles` (`role_id`, `role_name`) VALUES
(1, 'Admin'),
(2, 'Staff'),
(3, 'Patient');

INSERT INTO `users` (`id`, `role`, `username`, `pw`, `Fname`, `Minit`, `Lname`, `phone`, `email`, `sex`, `birth_date`) VALUES
(1, 1, 'superadmin', 'admin1234', 'Admin', NULL, 'S', '1234567890', 'admin@rmit.edu.vn', NULL, NULL),
(2, 2, 'duyRMIT', 'duy1234', 'Duy', NULL, 'Nguyen', '0987654321', 'duy@rmit.edu.vn', NULL, NULL),
(3, 2, 'anhRMIT', 'anh1234', 'Anh', NULL, 'Tran', '1122334455', 'anh@rmit.edu.vn', NULL, NULL),
(4, 3, 'khanhRMIT', 'khanh1234', 'Khanh', NULL, 'Ton', '2233445566', 'khanh@rmit.edu.vn', NULL, NULL),
(5, 3, 'tienRMIT', 'tien1234', 'Tien', NULL, 'Tran', '3344556677', 'tien@rmit.edu.vn', NULL, NULL);



/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;