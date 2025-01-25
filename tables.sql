-- MySQL dump 10.13  Distrib 8.0.31, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: mydb
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
-- Table structure for table `Servico`
--

DROP TABLE IF EXISTS `Servico`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Servico` (
  `idServico` int NOT NULL AUTO_INCREMENT,
  `nome_servico` varchar(45) NOT NULL,
  `preco_servico` decimal(8,2) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deletado` int DEFAULT '0',
  PRIMARY KEY (`idServico`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Servico`
--

LOCK TABLES `Servico` WRITE;
/*!40000 ALTER TABLE `Servico` DISABLE KEYS */;
INSERT INTO `Servico` VALUES (1,'corte',50.00,'2025-01-25 13:28:50','2025-01-25 13:28:50',0),(2,'escova',60.00,'2025-01-25 13:28:50','2025-01-25 13:28:50',0),(3,'unha',30.00,'2025-01-25 13:28:50','2025-01-25 13:28:50',0),(4,'tratamento',100.00,'2025-01-25 13:28:50','2025-01-25 13:28:50',0),(5,'alisamento',150.00,'2025-01-25 13:28:50','2025-01-25 13:28:50',0),(6,'progressiva',200.00,'2025-01-25 13:28:50','2025-01-25 13:28:50',0),(7,'mecha',90.00,'2025-01-25 13:28:50','2025-01-25 13:28:50',0),(8,'sobrancelha',35.00,'2025-01-25 13:28:50','2025-01-25 13:28:50',0),(9,'depilacao',25.00,'2025-01-25 13:28:50','2025-01-25 13:28:50',0),(10,'maquiagem',65.00,'2025-01-25 13:28:50','2025-01-25 13:28:50',0);
/*!40000 ALTER TABLE `Servico` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Usuario`
--

DROP TABLE IF EXISTS `Usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Usuario` (
  `idUsuario` int NOT NULL AUTO_INCREMENT,
  `nome_user` varchar(50) NOT NULL,
  `email` varchar(45) NOT NULL,
  `senha` varchar(45) NOT NULL,
  `cargo` varchar(45) DEFAULT 'cliente',
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deletado` int DEFAULT '0',
  PRIMARY KEY (`idUsuario`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Usuario`
--

LOCK TABLES `Usuario` WRITE;
/*!40000 ALTER TABLE `Usuario` DISABLE KEYS */;
INSERT INTO `Usuario` VALUES (1,'Teste','teste@email.com','qwer','cliente','2025-01-25 13:28:52','2025-01-25 13:28:52',0),(2,'Teste2','teste2@email.com','Qw!2erty','cliente','2025-01-25 13:28:52','2025-01-25 13:28:52',0);
/*!40000 ALTER TABLE `Usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Usuario_has_Servico`
--

DROP TABLE IF EXISTS `Usuario_has_Servico`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Usuario_has_Servico` (
  `idAgenda` int NOT NULL AUTO_INCREMENT,
  `Usuario_idUsuario` int NOT NULL,
  `Servico_idServico` int NOT NULL,
  `data_atendimento` datetime NOT NULL,
  `obs` varchar(280) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ativo` int NOT NULL DEFAULT '1',
  `deletado` int DEFAULT '0',
  PRIMARY KEY (`idAgenda`,`Usuario_idUsuario`,`Servico_idServico`),
  KEY `fk_Usuario_has_Servico_Servico1_idx` (`Servico_idServico`),
  KEY `fk_Usuario_has_Servico_Usuario_idx` (`Usuario_idUsuario`),
  CONSTRAINT `fk_Usuario_has_Servico_Servico1` FOREIGN KEY (`Servico_idServico`) REFERENCES `Servico` (`idServico`),
  CONSTRAINT `fk_Usuario_has_Servico_Usuario` FOREIGN KEY (`Usuario_idUsuario`) REFERENCES `Usuario` (`idUsuario`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Usuario_has_Servico`
--

LOCK TABLES `Usuario_has_Servico` WRITE;
/*!40000 ALTER TABLE `Usuario_has_Servico` DISABLE KEYS */;
INSERT INTO `Usuario_has_Servico` VALUES (1,1,2,'2025-01-24 13:30:00',NULL,'2025-01-25 13:28:53','2025-01-25 13:31:10',0,0),(2,1,6,'2025-01-24 13:30:00',NULL,'2025-01-25 13:28:53','2025-01-25 13:31:10',0,0),(3,1,4,'2025-01-26 13:30:00',NULL,'2025-01-25 13:28:53','2025-01-25 13:28:53',1,0),(4,1,7,'2025-01-29 09:30:00',NULL,'2025-01-25 13:28:53','2025-01-25 13:28:53',1,0),(5,1,10,'2025-01-29 09:30:00',NULL,'2025-01-25 13:28:53','2025-01-25 13:28:53',1,0),(6,2,10,'2025-01-29 09:30:00',NULL,'2025-01-25 13:28:53','2025-01-25 13:28:53',1,0),(7,2,3,'2025-01-31 09:30:00',NULL,'2025-01-25 13:28:53','2025-01-25 13:28:53',1,0),(8,1,2,'2025-01-19 13:30:00',NULL,'2025-01-25 13:28:53','2025-01-25 13:31:10',0,0),(9,1,5,'2025-01-03 13:30:00',NULL,'2025-01-25 13:28:53','2025-01-25 13:31:10',0,0),(10,1,1,'2025-01-23 13:30:00',NULL,'2025-01-25 13:28:53','2025-01-25 13:31:10',0,0),(11,1,2,'2025-01-29 09:30:00',NULL,'2025-01-25 13:32:01','2025-01-25 13:32:01',1,0),(12,1,4,'2025-02-03 14:30:00',NULL,'2025-01-25 13:33:13','2025-01-25 13:33:13',1,0),(13,1,1,'2025-02-06 17:00:00',NULL,'2025-01-25 13:33:24','2025-01-25 13:33:24',1,0),(14,1,10,'2025-02-03 14:30:00',NULL,'2025-01-25 13:33:37','2025-01-25 13:33:37',1,0);
/*!40000 ALTER TABLE `Usuario_has_Servico` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `session_id` varchar(128) NOT NULL,
  `expires` int NOT NULL,
  `data` mediumtext,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-01-25  9:38:50
