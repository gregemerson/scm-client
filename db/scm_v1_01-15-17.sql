-- MySQL dump 10.13  Distrib 5.7.12, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: scm_v1
-- ------------------------------------------------------
-- Server version	5.7.15-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `accesstoken`
--

use scm_v1;

DROP TABLE IF EXISTS `accesstoken`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `accesstoken` (
  `id` varchar(255) NOT NULL,
  `ttl` int(11) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accesstoken`
--

LOCK TABLES `accesstoken` WRITE;
/*!40000 ALTER TABLE `accesstoken` DISABLE KEYS */;
INSERT INTO `accesstoken` VALUES ('MCLXGi20lLDTXRBTWkiz7sbQXRx5qk8IPEcwTFBhlYPTDfG0WZDDAhjYHDuIaBEX',1209600000,'2016-10-06 03:14:15',5),('Z8KUcnGGp7U056cB7CkRp3viYdQ15xwuGYKtUNOcYM2YTZOTZa1wH6ntG635CLwo',31556926,'2017-01-15 21:54:32',4);
/*!40000 ALTER TABLE `accesstoken` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `acl`
--

DROP TABLE IF EXISTS `acl`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `acl` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `model` varchar(512) DEFAULT NULL,
  `property` varchar(512) DEFAULT NULL,
  `accessType` varchar(512) DEFAULT NULL,
  `permission` varchar(512) DEFAULT NULL,
  `principalType` varchar(512) DEFAULT NULL,
  `principalId` varchar(512) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `acl`
--

LOCK TABLES `acl` WRITE;
/*!40000 ALTER TABLE `acl` DISABLE KEYS */;
/*!40000 ALTER TABLE `acl` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `client`
--

DROP TABLE IF EXISTS `client`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `client` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created` datetime DEFAULT NULL,
  `username` varchar(40) NOT NULL,
  `realm` varchar(512) DEFAULT NULL,
  `password` varchar(512) NOT NULL,
  `credentials` text,
  `challenges` text,
  `email` varchar(512) NOT NULL,
  `emailVerified` tinyint(1) DEFAULT NULL,
  `verificationToken` varchar(512) DEFAULT NULL,
  `status` varchar(512) DEFAULT NULL,
  `lastUpdated` datetime DEFAULT NULL,
  `clientId` int(11) DEFAULT NULL,
  `usersettingsId` int(11) DEFAULT NULL,
  `subscriptionId` int(11) DEFAULT NULL,
  `clientcol` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `usersettings_ibfk_1` (`usersettingsId`),
  KEY `subscription_ibfk_1` (`subscriptionId`),
  CONSTRAINT `subscription_ibfk_1` FOREIGN KEY (`subscriptionId`) REFERENCES `subscription` (`id`),
  CONSTRAINT `usersettings_ibfk_1` FOREIGN KEY (`usersettingsId`) REFERENCES `usersettings` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `client`
--

LOCK TABLES `client` WRITE;
/*!40000 ALTER TABLE `client` DISABLE KEYS */;
INSERT INTO `client` VALUES (4,'2016-10-06 03:03:19','gemerson',NULL,'$2a$10$Lxc2SMQEr.zixFYUSsbUt.k1b.O4Bgs4pCkiLTN5EehRMdWDXKv/6',NULL,NULL,'amazatron@hotmail.com',1,NULL,NULL,'2016-10-06 03:03:19',NULL,1,1,NULL),(5,'2016-10-06 03:08:12','guest',NULL,'$2a$10$UZyy74iwtAsmzLrlKvixqe36KPzoMrYkSx321VFI3NjZpF5QC2lvC',NULL,NULL,'guest@guest.com',1,NULL,NULL,'2016-10-06 03:08:12',NULL,2,2,NULL),(20,'2016-12-08 06:16:11','Bobby',NULL,'$2a$10$VxVTAuwZ6EAOT9mQTwnRUuqhJnb.EQ5jPYbck8MDg6R2NCE7C8rOu',NULL,NULL,'bob@bob.com',1,NULL,NULL,'2016-12-08 06:16:11',NULL,9,3,NULL),(28,'2017-01-10 03:58:56','asdfsadf',NULL,'$2a$10$Lxc2SMQEr.zixFYUSsbUt.k1b.O4Bgs4pCkiLTN5EehRMdWDXKv/6',NULL,NULL,'asdf@sdfg.com',NULL,NULL,NULL,'2017-01-10 03:58:56',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `client` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clientexerciseset`
--

DROP TABLE IF EXISTS `clientexerciseset`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `clientexerciseset` (
  `clientId` int(11) DEFAULT NULL,
  `exercisesetId` int(11) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clientexerciseset`
--

LOCK TABLES `clientexerciseset` WRITE;
/*!40000 ALTER TABLE `clientexerciseset` DISABLE KEYS */;
INSERT INTO `clientexerciseset` VALUES (4,1,1),(5,1,2),(4,2,17),(4,24,18),(5,2,19),(4,25,20),(4,26,21),(20,2,37),(20,1,38),(28,1,55),(28,24,56),(28,2,57),(28,25,58);
/*!40000 ALTER TABLE `clientexerciseset` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exercise`
--

DROP TABLE IF EXISTS `exercise`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `exercise` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created` datetime NOT NULL,
  `name` varchar(40) DEFAULT 'Unnamed',
  `notation` varchar(600) NOT NULL DEFAULT '#',
  `category` varchar(20) NOT NULL DEFAULT 'Uncategorized',
  `comments` varchar(300) DEFAULT '',
  `exerciseSetId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `owning_exercise_set_fk` (`exerciseSetId`),
  CONSTRAINT `owning_exercise_set_fk` FOREIGN KEY (`exerciseSetId`) REFERENCES `exerciseset` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exercise`
--

LOCK TABLES `exercise` WRITE;
/*!40000 ALTER TABLE `exercise` DISABLE KEYS */;
INSERT INTO `exercise` VALUES (1,'2016-10-05 23:31:29','B1','#rlrl rlrl rlrl rlrl','Basic','Single stroke roll - right hand lead',1),(2,'2016-10-05 23:31:29','B2','#lrlr lrlr lrlr lrlr','Basic','',1),(3,'2016-10-05 23:31:29','B3','#rrll rrll rrll rrll','Basic','',1),(4,'2016-10-05 23:31:29','B4','#llrr llrr llrr llrr','Basic','',1),(5,'2016-10-05 23:31:29','B5','#rlrr lrll rlrr lrll','Basic','',1),(6,'2016-10-05 23:31:29','B6','#rllr lrrl rllr lrrl','Basic','',1),(7,'2016-10-05 23:31:29','B7','#rrlr llrl rrlr llrl','Basic','',1),(8,'2016-10-05 23:31:29','B8','#rlrl lrlr rlrl lrlr','Basic','',1),(9,'2016-10-05 23:31:29','B9','#rrrl rrrl rrrl rrrl','Basic','',1),(10,'2016-10-05 23:31:29','B10','#rlll rlll rlll rlll','Basic','',1),(11,'2016-10-05 23:31:29','B11','#lllr lllr lllr lllr','Basic','',1),(12,'2016-10-05 23:31:29','B12','#lrrr lrrr lrrr lrrr','Basic','',1),(13,'2016-10-05 23:31:29','B13','#rrrr llll rrrr llll','Basic','',1),(14,'2016-10-05 23:31:29','B14','#rlrl rrll rlrl rrll','Basic','',1),(15,'2016-10-05 23:31:29','B15','#lrlr llrr lrlr llrr','Basic','',1),(16,'2016-10-05 23:31:29','B16','#rlrl rlrr lrlr lrll','Basic','',1),(17,'2016-10-05 23:31:29','B17','#rlrl rllr lrlr lrrl','Basic','',1),(18,'2016-10-05 23:31:29','B18','#rlrl rrlr lrlr llrl','Basic','',1),(19,'2016-10-05 23:31:29','B19','#rlrl rrrl rlrl rrrl','Basic','',1),(20,'2016-10-05 23:31:29','B20','#rlrl rlll rlrl rlll','Basic','',1),(21,'2016-10-05 23:31:29','B21','#lrlr lllr lrlr lllr','Basic','',1),(22,'2016-10-05 23:31:29','B22','#lrlr lrrr lrlr lrrr','Basic','',1),(23,'2016-10-05 23:31:29','B23','#rlrl rrrr lrlr llll','Basic','',1),(24,'2016-10-05 23:31:29','B24','#rrll rlrr llrr lrll','Basic','',1),(27,'2016-10-15 04:57:29','Repeats','#rlrl r-lr lrl- rlr-|lrlr|<1:3>|lrlr l-rl rlr- lrl-|rlrl|<1:3>','Demonstration','The top number is the number of previous measures to repeat. The bottom number is the number of times to repeat those measures.',2),(36,'2016-11-26 06:19:49','SS 1','#RlRl rLrl RlRl rLrl','Uncategorized','',24),(37,'2016-11-29 05:46:17','DS 1','#RrLl rRll RrLl rRll','Uncategorized','',24),(38,'2016-11-29 13:19:49','PD 1','#RlRr lRll RlRr lRll','Uncategorized','',24),(40,'2016-12-01 03:55:57','Test 1','#','Uncategorized','',26);
/*!40000 ALTER TABLE `exercise` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exerciseset`
--

DROP TABLE IF EXISTS `exerciseset`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `exerciseset` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created` datetime DEFAULT NULL,
  `name` varchar(40) DEFAULT NULL,
  `category` varchar(20) DEFAULT NULL,
  `disabledExercises` text,
  `exerciseOrdering` text,
  `ownerId` int(11) DEFAULT NULL,
  `comments` varchar(500) DEFAULT '',
  `public` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exerciseset`
--

LOCK TABLES `exerciseset` WRITE;
/*!40000 ALTER TABLE `exerciseset` DISABLE KEYS */;
INSERT INTO `exerciseset` VALUES (1,'2016-11-18 01:47:35','Basic 1','Basic','[]','[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]',4,'These exercises should look familiar!',1),(2,'2016-11-18 01:47:35','Notation Demo','Demonstration','[]','[27]',4,'Learn',1),(24,'2016-11-26 04:20:41','Accents 1','Accents','[]','[36,37,38,39]',4,'Accented single-stroke, double-stroke and paradiddle patterns',1),(25,'2016-11-29 02:07:15','1-34 Ride','Demonstration','[]','[]',4,'',1),(26,'2016-12-01 03:55:42','Test Set','This will be gone','[]','[40]',4,'blah blah',0);
/*!40000 ALTER TABLE `exerciseset` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exercisesetexercise`
--

DROP TABLE IF EXISTS `exercisesetexercise`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `exercisesetexercise` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `exerciseSetId` int(11) DEFAULT NULL,
  `exerciseId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `exerciseSetId` (`exerciseSetId`),
  KEY `exerciseId` (`exerciseId`),
  CONSTRAINT `exercisesetexercise_ibfk_1` FOREIGN KEY (`exerciseSetId`) REFERENCES `exerciseset` (`id`),
  CONSTRAINT `exercisesetexercise_ibfk_2` FOREIGN KEY (`exerciseId`) REFERENCES `exercise` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exercisesetexercise`
--

LOCK TABLES `exercisesetexercise` WRITE;
/*!40000 ALTER TABLE `exercisesetexercise` DISABLE KEYS */;
INSERT INTO `exercisesetexercise` VALUES (1,1,1),(2,1,2),(3,1,3),(4,1,4),(5,1,5),(6,1,6),(7,1,7),(8,1,8),(9,1,9),(10,1,10),(11,1,11),(12,1,12),(13,1,13),(14,1,14),(15,1,15),(16,1,16),(17,1,17),(18,1,18),(19,1,19),(20,1,20),(21,1,21),(22,1,22),(23,1,23),(24,1,24),(27,2,27);
/*!40000 ALTER TABLE `exercisesetexercise` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(512) NOT NULL,
  `description` varchar(512) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `modified` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES (1,'guest',NULL,'2016-10-06 03:16:20','2016-10-06 03:16:20'),(2,'administrator',NULL,'2016-10-06 03:16:20','2016-10-06 03:16:20');
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rolemapping`
--

DROP TABLE IF EXISTS `rolemapping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rolemapping` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `principalType` varchar(512) DEFAULT NULL,
  `principalId` varchar(512) DEFAULT NULL,
  `roleId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rolemapping`
--

LOCK TABLES `rolemapping` WRITE;
/*!40000 ALTER TABLE `rolemapping` DISABLE KEYS */;
INSERT INTO `rolemapping` VALUES (1,'USER','5',1),(2,'USER','4',2);
/*!40000 ALTER TABLE `rolemapping` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sharedexerciseset`
--

DROP TABLE IF EXISTS `sharedexerciseset`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sharedexerciseset` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `exerciseSetId` int(11) NOT NULL,
  `receiverId` int(11) NOT NULL,
  `sharerId` int(11) NOT NULL,
  `created` datetime NOT NULL,
  `comments` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `exerciseSetId` (`exerciseSetId`,`sharerId`,`receiverId`),
  KEY `receiverId` (`receiverId`),
  KEY `sharerId` (`sharerId`),
  CONSTRAINT `sharedexerciseset_ibfk_1` FOREIGN KEY (`exerciseSetId`) REFERENCES `exerciseset` (`id`),
  CONSTRAINT `sharedexerciseset_ibfk_2` FOREIGN KEY (`receiverId`) REFERENCES `client` (`id`),
  CONSTRAINT `sharedexerciseset_ibfk_3` FOREIGN KEY (`sharerId`) REFERENCES `client` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sharedexerciseset`
--

LOCK TABLES `sharedexerciseset` WRITE;
/*!40000 ALTER TABLE `sharedexerciseset` DISABLE KEYS */;
/*!40000 ALTER TABLE `sharedexerciseset` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subscription`
--

DROP TABLE IF EXISTS `subscription`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `subscription` (
  `expires` datetime DEFAULT NULL,
  `kind` int(11) NOT NULL DEFAULT '1',
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `clientId` int(11) DEFAULT NULL,
  `maxExerciseSets` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `sub_client_ibfk_1` (`clientId`),
  CONSTRAINT `sub_client_ibfk_1` FOREIGN KEY (`clientId`) REFERENCES `client` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subscription`
--

LOCK TABLES `subscription` WRITE;
/*!40000 ALTER TABLE `subscription` DISABLE KEYS */;
INSERT INTO `subscription` VALUES ('4000-01-01 00:00:00',1,1,4,1000),(NULL,1,2,5,0),(NULL,1,3,20,1),(NULL,1,13,28,2);
/*!40000 ALTER TABLE `subscription` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `realm` varchar(512) DEFAULT NULL,
  `username` varchar(512) DEFAULT NULL,
  `password` varchar(512) NOT NULL,
  `credentials` text,
  `challenges` text,
  `email` varchar(512) NOT NULL,
  `emailVerified` tinyint(1) DEFAULT NULL,
  `verificationToken` varchar(512) DEFAULT NULL,
  `status` varchar(512) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `lastUpdated` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usersettings`
--

DROP TABLE IF EXISTS `usersettings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usersettings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `currentExerciseSet` varchar(512) NOT NULL,
  `numberOfRepititions` int(11) NOT NULL,
  `minTempo` int(11) NOT NULL,
  `maxTempo` int(11) NOT NULL,
  `tempoStep` int(11) NOT NULL,
  `clientId` int(11) DEFAULT NULL,
  `secondsBeforeStart` int(11) DEFAULT '10',
  PRIMARY KEY (`id`),
  KEY `userset_client_ibfk_1` (`clientId`),
  CONSTRAINT `userset_client_ibfk_1` FOREIGN KEY (`clientId`) REFERENCES `client` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usersettings`
--

LOCK TABLES `usersettings` WRITE;
/*!40000 ALTER TABLE `usersettings` DISABLE KEYS */;
INSERT INTO `usersettings` VALUES (1,'26',20,80,80,0,4,10),(2,'2',20,80,80,0,5,10),(9,'2',20,80,80,10,20,10),(18,'-1',20,80,80,10,28,10);
/*!40000 ALTER TABLE `usersettings` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-01-15 20:01:36
