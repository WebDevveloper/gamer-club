-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: game_club
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `computer_id` int NOT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  `status` enum('pending','confirmed','completed','cancelled') NOT NULL DEFAULT 'pending',
  `total_price` decimal(10,2) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `computer_id` (`computer_id`),
  CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`computer_id`) REFERENCES `computers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (1,1,1,'2025-06-24 23:00:00','2025-06-25 04:00:00','completed',75.00,'2025-06-24 22:22:06'),(2,1,1,'2025-06-24 21:00:00','2025-06-25 02:00:00','completed',75.00,'2025-06-24 23:19:36'),(3,1,3,'2025-06-25 08:00:00','2025-06-25 09:00:00','confirmed',8.00,'2025-06-25 07:52:12'),(4,1,2,'2025-06-25 09:00:00','2025-06-25 10:00:00','pending',12.00,'2025-06-25 08:30:42'),(5,5,3,'2025-06-27 12:12:00','2025-06-27 17:12:00','pending',40.00,'2025-06-26 23:26:52'),(6,6,4,'2025-06-27 07:00:00','2025-06-27 13:00:00','pending',90.00,'2025-06-27 06:07:38'),(7,6,5,'2025-06-27 07:00:00','2025-06-27 08:00:00','pending',12.00,'2025-06-27 06:09:10'),(8,6,7,'2025-06-27 07:00:00','2025-06-27 15:00:00','pending',144.00,'2025-06-27 06:13:17');
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `computers`
--

DROP TABLE IF EXISTS `computers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `computers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `type` enum('gaming','standard','premium') NOT NULL,
  `cpu` varchar(100) NOT NULL,
  `gpu` varchar(100) NOT NULL,
  `ram` varchar(50) NOT NULL,
  `storage` varchar(50) NOT NULL,
  `monitor` varchar(100) NOT NULL,
  `status` enum('available','booked','maintenance') NOT NULL DEFAULT 'available',
  `hourly_rate` decimal(10,2) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `computers`
--

LOCK TABLES `computers` WRITE;
/*!40000 ALTER TABLE `computers` DISABLE KEYS */;
INSERT INTO `computers` VALUES (1,'Станция ПК 1','gaming','Intel Core i9-12900K','NVIDIA RTX 4080','32GB','2TB NVMe SSD','27″ 240 Гц','booked',15.00,'','2025-05-28 16:38:49'),(2,'Станция ПК 2','premium','AMD Ryzen 9 5950X','NVIDIA RTX 3070','32GB','1TB NVMe SSD','27″ 165 Гц','booked',12.00,'','2025-05-28 16:38:49'),(3,'Станция ПК 3','standard','Intel Core i5-12400F','NVIDIA GTX 1660','16GB','512GB NVMe SSD','24″ 144 Гц','booked',8.00,'','2025-05-28 16:38:49'),(4,'Станция ПК 4','gaming','AMD Ryzen 7 5800X3D','NVIDIA RTX 4080','32GB','2TB NVMe SSD','27″ 240 Гц','booked',15.00,'','2025-05-28 16:38:49'),(5,'Станция ПК 5','premium','Intel Core i7-12700K','NVIDIA RTX 3070 Ti','32GB','1TB NVMe SSD','27″ 165 Гц','booked',12.00,'','2025-05-28 16:38:49'),(6,'Станция ПК 6','standard','AMD Ryzen 5 5600X','NVIDIA GTX 1660 Super','16GB','512GB NVMe SSD','24″ 144 Гц','available',8.00,'','2025-05-28 16:38:49'),(7,'Станция ПК 7','gaming','Intel Core i9-13900K','NVIDIA RTX 4090','64GB','2TB NVMe SSD','27″ 240 Гц','booked',18.00,'','2025-05-28 16:38:49'),(8,'Станция ПК 8','premium','AMD Ryzen 9 7950X','NVIDIA RTX 4070','32GB','1TB NVMe SSD','27″ 165 Гц','available',12.00,'','2025-05-28 16:38:49'),(9,'Станция ПК 9','standard','Intel Core i5-13600K','NVIDIA RTX 3060','16GB','512GB NVMe SSD','24″ 144 Гц','available',8.00,'','2025-05-28 16:38:49'),(10,'Станция ПК 10','gaming','AMD Ryzen 7 7700X','NVIDIA RTX 4080','32GB','2TB NVMe SSD','27″ 240 Гц','available',15.00,'','2025-05-28 16:38:49'),(11,'Станция ПК 11','premium','Intel Core i7-13700K','NVIDIA RTX 3070','32GB','1TB NVMe SSD','27″ 165 Гц','available',12.00,'','2025-05-28 16:38:49'),(12,'Станция ПК 12','standard','AMD Ryzen 5 7600X','NVIDIA GTX 1660','16GB','512GB NVMe SSD','24″ 144 Гц','available',8.00,'','2025-05-28 16:38:49'),(13,'Станция ПК 13','gaming','Intel Core i9-12900KS','NVIDIA RTX 4080 Ti','64GB','2TB NVMe SSD','27″ 240 Гц','available',16.00,'','2025-05-28 16:38:49'),(14,'Станция ПК 14','premium','AMD Ryzen 9 5900X','NVIDIA RTX 3070 Ti','32GB','1TB NVMe SSD','27″ 165 Гц','available',12.00,'','2025-05-28 16:38:49'),(15,'Станция ПК 15','standard','Intel Core i3-12100','NVIDIA GTX 1650','8GB','512GB SSD','24″ 60 Гц','available',6.00,'','2025-05-28 16:38:49'),(16,'Станция ПК 16','gaming','AMD Ryzen 5 5600','NVIDIA RTX 3060 Ti','16GB','1TB NVMe SSD','27″ 144 Гц','available',10.00,'','2025-05-28 16:38:49'),(17,'Станция ПК 17','premium','Intel Core i7-12700F','NVIDIA RTX 3080','32GB','1TB NVMe SSD','27″ 165 Гц','available',14.00,'','2025-05-28 16:38:49'),(18,'Станция ПК 18','standard','AMD Ryzen 3 3300X','NVIDIA GTX 1650','8GB','256GB SSD','24″ 60 Гц','available',6.00,'','2025-05-28 16:38:49'),(19,'Станция ПК 19','gaming','Intel Core i9-14900K','NVIDIA RTX 4090','64GB','2TB NVMe SSD','27″ 240 Гц','available',20.00,'','2025-05-28 16:38:49'),(20,'Станция ПК 20','premium','AMD Ryzen 7 5800X','NVIDIA RTX 3070','32GB','1TB NVMe SSD','27″ 165 Гц','available',12.00,'','2025-05-28 16:38:49'),(21,'Станция ПК 21','standard','Intel Core i5-12400','NVIDIA GTX 1650 Super','16GB','512GB SSD','24″ 144 Гц','available',7.00,'','2025-05-28 16:38:49'),(22,'Станция ПК 22','gaming','AMD Ryzen 9 7900X','NVIDIA RTX 4080','32GB','2TB NVMe SSD','27″ 240 Гц','available',15.00,'','2025-05-28 16:38:49'),(23,'Станция ПК 23','premium','Intel Core i7-13700KF','NVIDIA RTX 4070 Ti','32GB','1TB NVMe SSD','27″ 165 Гц','available',13.00,'','2025-05-28 16:38:49'),(24,'Станция ПК 24','standard','AMD Ryzen 5 5600X','NVIDIA GTX 1660 Ti','16GB','512GB NVMe SSD','24″ 144 Гц','available',8.00,'','2025-05-28 16:38:49'),(25,'Станция ПК 25','gaming','Intel Core i9-13900KS','NVIDIA RTX 4090','64GB','2TB NVMe SSD','27″ 240 Гц','available',20.00,'','2025-05-28 16:38:49'),(26,'Станция ПК 26','premium','AMD Ryzen 7 7700X','NVIDIA RTX 3080','32GB','1TB NVMe SSD','27″ 165 Гц','available',14.00,'','2025-05-28 16:38:49'),(27,'Станция ПК 27','standard','Intel Core i5-13400','NVIDIA GTX 1660','16GB','512GB NVMe SSD','24″ 144 Гц','available',8.00,'','2025-05-28 16:38:49'),(28,'Станция ПК 28','gaming','AMD Ryzen 7 5800X','NVIDIA RTX 3080 Ti','32GB','2TB NVMe SSD','27″ 240 Гц','available',16.00,'','2025-05-28 16:38:49'),(29,'Станция ПК 29','premium','Intel Core i7-12700KF','NVIDIA RTX 3070','32GB','1TB NVMe SSD','27″ 165 Гц','available',12.00,'','2025-05-28 16:38:49'),(30,'Станция ПК 30','standard','AMD Ryzen 5 3600','NVIDIA GTX 1660','16GB','512GB NVMe SSD','24″ 144 Гц','available',8.00,'','2025-05-28 16:38:49');
/*!40000 ALTER TABLE `computers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(100) NOT NULL,
  `role` enum('user','admin') NOT NULL DEFAULT 'user',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `phone` varchar(20) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'user@example.com','$2b$10$U8DBZTPFmno1S7vZK9Z0a.3K1gSKhNKGw6CEAPNQxC4A0aZYVrxgm','user','user','2025-05-28 17:14:01',NULL,NULL),(2,'admin@example.com','$2b$10$YH/.70KaibJsWpa4MoJNLewWzQVIYR2ZtmionPmu40cRqyWP57X3q','admin','admin','2025-05-28 17:21:54',NULL,NULL),(3,'kirill@email.com','$2b$10$dzqJmq7tnKfD1WiylhNkduBoOgpaWPxLgpQ1eQEuOslMTLdBD6HUq','kirill','user','2025-05-30 09:51:18',NULL,NULL),(4,'ksjdksjd@adad.com','$2b$10$Dpiy.0HL5oqMX8NH5aRJhOQ0hwx.SXar6.U8jZaMxWfbzsJ.mb7rC','Аркадий','user','2025-05-30 10:01:56',NULL,NULL),(5,'test1@gmail.com','$2b$10$uYe74ux9Cls06DddwWXIyuk73ug5OEyaCb1yNzXoJ7Xpmh7hXL33.','Test1','user','2025-06-26 23:25:19',NULL,NULL),(6,'test2@gmail.com','$2b$10$5NLQPUXLKfiwSFU3QNGhIuu5jfBDP4.h7iyIaF.zM2fLZxtTJeyiK','Test2','user','2025-06-27 06:07:21',NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-27  7:09:15
