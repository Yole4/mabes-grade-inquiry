-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 04, 2023 at 12:22 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mabes_grading_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `grade_list`
--

CREATE TABLE `grade_list` (
  `id` int(11) NOT NULL,
  `grade` int(11) NOT NULL,
  `isDelete` varchar(20) NOT NULL DEFAULT 'not',
  `date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `grade_list`
--

INSERT INTO `grade_list` (`id`, `grade`, `isDelete`, `date`) VALUES
(1, 1, 'Deleted', '2023-10-01 22:02:46'),
(2, 2, 'Deleted', '2023-10-01 22:03:09'),
(3, 1, 'Deleted', '2023-10-01 22:04:20'),
(4, 4, 'Deleted', '2023-10-01 22:05:26'),
(5, 1, 'Deleted', '2023-10-01 22:05:50'),
(6, 6, 'Deleted', '2023-10-01 22:05:54'),
(7, 1, 'Deleted', '2023-10-01 22:10:58'),
(8, 3, 'Deleted', '2023-10-01 22:13:20'),
(9, 1, 'Deleted', '2023-10-03 19:15:33'),
(10, 4, 'not', '2023-10-04 17:42:29'),
(11, 2, 'not', '2023-10-04 17:42:34');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `notification_type` varchar(50) NOT NULL,
  `content` varchar(255) NOT NULL,
  `seen` int(11) NOT NULL DEFAULT 0,
  `date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `notification_type`, `content`, `seen`, `date`) VALUES
(1, 1, 'Add staff account', 'You added eloy mora paglinawan as Staff.', 0, '2023-09-30 16:58:20'),
(2, 1, 'Add staff account', 'You added other middle last123 as Staff.', 0, '2023-09-30 17:01:42'),
(3, 1, 'Add staff account', 'You added staff staff middle staff last as Staff.', 0, '2023-09-30 18:36:58'),
(4, 1, 'Add new student', 'You added first name middle name last name as new student', 0, '2023-10-01 09:24:41'),
(5, 1, 'Add student account', 'You added first name middle name last name as student account', 0, '2023-10-01 09:24:41'),
(6, 1, 'Add new student', 'You added ssdfs fsdfsdf sdfsdfsd as new student', 0, '2023-10-01 10:19:35'),
(7, 1, 'Add student account', 'You added ssdfs fsdfsdf sdfsdfsd as student account', 0, '2023-10-01 10:19:35'),
(8, 1, 'Add new student', 'You added fdsf sdfsd sdfsdf as new student', 0, '2023-10-01 12:12:42'),
(9, 1, 'Add student account', 'You added fdsf sdfsd sdfsdf as student account', 0, '2023-10-01 12:12:42'),
(10, 1, 'Add new student', 'You added sdfsdfsd fdsfds fdsfsdf as new student', 0, '2023-10-01 17:48:40'),
(11, 1, 'Add student account', 'You added sdfsdfsd fdsfds fdsfsdf as student account', 0, '2023-10-01 17:48:40'),
(12, 1, 'Add student account', 'You added new Enligh subject', 0, '2023-10-01 18:08:39'),
(13, 1, 'Add student account', 'You added new Filipino subject', 0, '2023-10-01 18:09:16'),
(14, 1, 'Add student account', 'You added new Science subject', 0, '2023-10-01 18:39:34'),
(15, 1, 'Add school year', 'You added new school year 2023-2024', 0, '2023-10-01 19:50:40'),
(16, 1, 'Add school year', 'You added new school year 2024-2025', 0, '2023-10-01 19:53:38'),
(17, 1, 'Add grade', 'You added new grade 1', 0, '2023-10-01 22:02:46'),
(18, 1, 'Add grade', 'You added new grade 2', 0, '2023-10-01 22:03:09'),
(19, 1, 'Add grade', 'You added new grade 1', 0, '2023-10-01 22:04:20'),
(20, 1, 'Add grade', 'You added new grade 4', 0, '2023-10-01 22:05:26'),
(21, 1, 'Add grade', 'You added new grade 1', 0, '2023-10-01 22:05:50'),
(22, 1, 'Add grade', 'You added new grade 3', 0, '2023-10-01 22:05:54'),
(23, 1, 'Add grade', 'You added new grade 1', 0, '2023-10-01 22:10:58'),
(24, 1, 'Add grade', 'You added new grade 1', 0, '2023-10-01 22:13:20'),
(25, 1, 'Add staff account', 'You added sdfs dfdsf dfsdf as Staff.', 0, '2023-10-03 17:46:32'),
(26, 1, 'Add staff account', 'You added daisy araneta limpangog as Staff.', 0, '2023-10-03 18:20:04'),
(27, 1, 'Add staff account', 'You added fsdf sdfsdfdsfsd fsdfsdfsdf as Staff.', 0, '2023-10-03 19:12:50'),
(28, 1, 'Add grade', 'You added new grade 1', 0, '2023-10-03 19:15:33'),
(29, 1, 'Add staff account', 'You added eloy eloy eloy as Staff.', 0, '2023-10-04 14:02:08'),
(30, 1, 'Add new student', 'You added shelo yole shelo as new student', 0, '2023-10-04 16:18:01'),
(31, 1, 'Add student account', 'You added shelo yole shelo as student account', 0, '2023-10-04 16:18:01'),
(32, 1, 'Add new student', 'You added 123 123 321 as new student', 0, '2023-10-04 17:14:18'),
(33, 1, 'Add student account', 'You added 123 123 321 as student account', 0, '2023-10-04 17:14:18'),
(34, 1, 'Add grade', 'You added new grade 4', 0, '2023-10-04 17:42:29'),
(35, 1, 'Add grade', 'You added new grade 2', 0, '2023-10-04 17:42:34'),
(36, 1, 'Add new student', 'You added testing testing testing as new student', 0, '2023-10-04 17:54:30'),
(37, 1, 'Add student account', 'You added testing testing testing as student account', 0, '2023-10-04 17:54:30'),
(38, 1, 'Add new student', 'You added dfsd fsdfsdf dsfdsfdf as new student', 0, '2023-10-04 17:57:07'),
(39, 1, 'Add student account', 'You added dfsd fsdfsdf dsfdsfdf as student account', 0, '2023-10-04 17:57:07'),
(40, 1, 'Add new student', 'You added 234234 23w sdfdsf as new student', 0, '2023-10-04 18:15:23'),
(41, 1, 'Add student account', 'You added 234234 23w sdfdsf as student account', 0, '2023-10-04 18:15:23');

-- --------------------------------------------------------

--
-- Table structure for table `school_year`
--

CREATE TABLE `school_year` (
  `id` int(11) NOT NULL,
  `school_year` varchar(20) NOT NULL,
  `current` varchar(20) NOT NULL,
  `isDelete` varchar(20) NOT NULL DEFAULT 'not',
  `date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `school_year`
--

INSERT INTO `school_year` (`id`, `school_year`, `current`, `isDelete`, `date`) VALUES
(1, '2023-2024', 'Yes', 'not', '2023-10-01 19:50:40'),
(2, '2024-2025', 'Yes', 'not', '2023-10-01 19:53:38');

-- --------------------------------------------------------

--
-- Table structure for table `subjects`
--

CREATE TABLE `subjects` (
  `id` int(11) NOT NULL,
  `subject` varchar(20) NOT NULL,
  `applicable_for` varchar(20) NOT NULL,
  `description` text NOT NULL,
  `isDelete` varchar(50) NOT NULL DEFAULT 'not',
  `date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subjects`
--

INSERT INTO `subjects` (`id`, `subject`, `applicable_for`, `description`, `isDelete`, `date`) VALUES
(1, 'Enligh', 'All', 'optional', 'not', '2023-10-01 18:08:39'),
(2, 'Math', 'All', 'dsfdsf', 'not', '2023-10-01 18:09:16'),
(3, 'Science', 'All', 'secret', 'Deleted', '2023-10-01 18:39:34');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `user_type` varchar(50) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `middle_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `image` varchar(255) NOT NULL,
  `isDelete` varchar(10) NOT NULL DEFAULT 'not',
  `date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `user_type`, `first_name`, `middle_name`, `last_name`, `image`, `isDelete`, `date`) VALUES
(1, 'yole143', '8bb0cf6eb9b17d0f7d22b456f121257dc1254e1f01665370476383ea776df414', 'Admin', 'Mr.', '', 'Programmer', '1696331528040_+_PAGLINAWAN, SHELO562060.jpg', 'not', '2023-09-29 21:41:34'),
(2, 'testing', 'z2jozRflAp', 'Staff', 'Jhon', 'Part', 'Portal', '', 'Deleted', '2023-09-30 13:54:02'),
(7, 'finally', 'f78bcfe2b6f3b62a3cfc95a3e29607bda0ba7e3a9af4323f77df373097b72d13', 'Staff', 'final', 'test', 'sd', '', 'Deleted', '2023-09-30 16:58:20'),
(8, 'sdfsdf', 'e62072a803ef1fdf51797bd5ae0ef66ce0fb1fc4cfb9e970bab14b058ffed0df', 'Staff', 'other', 'middlesd', 'Last Name', '', 'Deleted', '2023-09-30 17:01:42'),
(9, 'username', '7bba650e5d1743f93d9671250733a1a62a824a6625edc8affd19efa637882b6f', 'Staff', 'staff', 'staff middle', 'staff last', '', 'Deleted', '2023-09-30 18:36:58'),
(10, 'LRN', 'last name', 'Student', 'first name', 'middle name', 'last name', '', 'Deleted', '2023-10-01 09:24:41'),
(11, '234234324sdfsdfsdf', 'sdfsdfsd', 'Student', 'ssdfs', 'fsdfsdf', 'sdfsdfsd', '', 'not', '2023-10-01 10:19:34'),
(12, '32423452s', '4bac27393bdd9777ce02453256c5577cd02275510b2227f473d03f533924f877', 'Student', 'fdsf', 'sdfsd', 'sdfsdf', '', 'Deleted', '2023-10-01 12:12:42'),
(13, 'fsdf', '4931d26bdefd33bede96b5ca26d22e1ba81d6cbe34eb5bb61e45cc441d4991dc', 'Student', 'sdfsdfsd', 'fdsfds', 'fdsfsdf', '', 'Deleted', '2023-10-01 17:48:40'),
(14, 'sdfsdfsf', '0f859177408f9b026320b70d1e34aa25e78aa85f5efb75710a362360955f0a4c', 'Staff', 'sdfs', 'dfdsf', 'dfsdf', '', 'not', '2023-10-03 17:46:32'),
(15, 'daisy', '7d976191645074b6457d42b1aa91e6fa124b7d09dc6dafa1466cb9b1f8900696', 'Staff', 'daisy', 'araneta', 'limpangog', '', 'not', '2023-10-03 18:20:04'),
(16, 'fsfdsfsdfsdfsdfsdf', 'fa95d39052e7a8019afdb93567d1d7f8d1d04245e9bfedff26ac5abf6052eecc', 'Staff', 'fsdf', 'sdfsdfdsfsd', 'fsdfsdfsdf', '', 'Deleted', '2023-10-03 19:12:50'),
(17, 'eloy143', '016bddf0499a24f9c409509b62da1d0347266d6cb9f4e5f01bf01444288efdc1', 'Staff', 'eloy', 'eloy', 'eloy', '', 'not', '2023-10-04 14:02:08'),
(18, '123', '1b2b8879728530f140ce919a92f7e0e2495fdabc188aab92727e5b2949fb09f2', 'Student', 'shelo', 'yole', 'shelo', '', 'not', '2023-10-04 16:18:01'),
(19, '321', '8d23cf6c86e834a7aa6eded54c26ce2bb2e74903538c61bdd5d2197997ab2f72', 'Student', '123', '123', '321', '', 'not', '2023-10-04 17:14:18'),
(20, 'testing', 'cf80cd8aed482d5d1527d7dc72fceff84e6326592848447d2dc0b0e87dfc9a90', 'Student', 'testing', 'testing', 'testing', '', 'not', '2023-10-04 17:54:30'),
(21, 'ss', 'eb70f8319041e85b5e0ec46e31021b6a7c80874800d042286ed6a8906d8277d5', 'Student', 'dfsd', 'fsdfsdf', 'dsfdsfdf', '', 'not', '2023-10-04 17:57:07'),
(22, '234', '90ba8e42f0820b22e76e477624fb2aaa16b125caa144d94beca223324da54733', 'Student', '234234', '23w', 'sdfdsf', '', 'not', '2023-10-04 18:15:23');

-- --------------------------------------------------------

--
-- Table structure for table `user_info`
--

CREATE TABLE `user_info` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `teacher_id` int(11) NOT NULL,
  `grade` int(11) NOT NULL,
  `school_year` varchar(50) NOT NULL,
  `lrn` varchar(50) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `middle_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `gender` varchar(20) NOT NULL,
  `civil_status` varchar(20) NOT NULL,
  `phone_number` varchar(20) NOT NULL,
  `religion` varchar(20) NOT NULL,
  `birth_place` varchar(50) NOT NULL,
  `address` varchar(50) NOT NULL,
  `date_of_birth` varchar(20) NOT NULL,
  `parent_guardian` varchar(50) NOT NULL,
  `curriculumn` varchar(20) NOT NULL,
  `isDelete` varchar(10) NOT NULL DEFAULT 'not',
  `date` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_info`
--

INSERT INTO `user_info` (`id`, `user_id`, `teacher_id`, `grade`, `school_year`, `lrn`, `first_name`, `middle_name`, `last_name`, `gender`, `civil_status`, `phone_number`, `religion`, `birth_place`, `address`, `date_of_birth`, `parent_guardian`, `curriculumn`, `isDelete`, `date`) VALUES
(1, 10, 0, 0, '', 'LRN', 'first name', 'middle name', 'last name', 'Male', 'Single', '023423470', 'RC', 'LoversLane', 'address', '2023-12-31', 'dsdfsdf', 'Regular', 'Deleted', ''),
(2, 11, 0, 0, '', '234234', 'ssdfs', 'fsdfsdf', 'sdfsdfsd', 'Male', 'Regular', '21323', 'sdfsdf', 'sdfdsf', 'dsfsdfsdfsd', '2023-10-09', 'dfgddfgdfg', 'Regular', 'Deleted', ''),
(3, 12, 0, 0, '', '324234', 'fdsf', 'sdfsd', 'sdfsdf', 'Male', 'Single', 'sdf1234', 'sfsdf', 'sdfsdf', 'sdfsdf', '2023-12-31', 'sfsf', 'Regular', 'Deleted', ''),
(4, 13, 0, 0, '', 'fsdf', 'sdfsdfsd', 'fdsfds', 'fdsfsdf', 'Female', 'Single', '23', 'sdfsdf', 'fdsfdsf', 'sdfsd', '2023-12-31', 'dsfsdfsd', 'Regular', 'Deleted', ''),
(5, 18, 0, 0, '', '123', 'shelo', 'yole', 'shelo', 'Male', 'Single', '123', '123', '234', '234', '2023-10-04', '234', 'Regular', 'Deleted', ''),
(6, 19, 17, 0, '', '321', '123', '123', '321', 'Male', 'Single', '123', '123', '123', '123', '2023-10-04', '123', 'Regular', 'Deleted', ''),
(7, 20, 15, 4, '', 'testing', 'testing', 'testing', 'testing', 'Male', 'Single', '123', 'sfs', 'sdf', 'sdf', '2023-12-31', 'saf', 'Regular', 'not', ''),
(8, 21, 14, 1, '', 'ss', 'dfsd', 'fsdfsdf', 'dsfdsfdf', 'Female', 'Single', 'sdf', 'sdfsdf', 'sdfsd', 'fsdfsdf', '2023-10-27', 'sdf', 'Regular', 'not', ''),
(9, 22, 14, 4, '2023-2024', '234', '234234', '23w', 'sdfdsf', 'Female', 'Single', 'dsfdsf', 'dsfdsf', 'dfsdfsdf', 'sdfsdfsdf', '2023-10-04', 'sdfsdf', 'Regular', 'not', '');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `grade_list`
--
ALTER TABLE `grade_list`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `school_year`
--
ALTER TABLE `school_year`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `subjects`
--
ALTER TABLE `subjects`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_info`
--
ALTER TABLE `user_info`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `grade_list`
--
ALTER TABLE `grade_list`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `school_year`
--
ALTER TABLE `school_year`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `subjects`
--
ALTER TABLE `subjects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `user_info`
--
ALTER TABLE `user_info`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
