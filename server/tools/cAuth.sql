/*
 Navicat Premium Data Transfer

 Source Server         : Localhost
 Source Server Type    : MySQL
 Source Server Version : 50717
 Source Host           : localhost
 Source Database       : cAuth

 Target Server Type    : MySQL
 Target Server Version : 50717
 File Encoding         : utf-8

 Date: 08/10/2017 22:22:52 PM
*/

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `cSessionInfo`
-- ----------------------------
DROP TABLE IF EXISTS `cSessionInfo`;
CREATE TABLE `cSessionInfo` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `open_id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `uuid` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `skey` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_visit_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `session_key` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_info` json NOT NULL,
  `city` varchar(100) COLLATE utf8mb4_unicode_ci GENERATED ALWAYS AS (json_unquote(json_extract(`user_info`,'$.city'))) VIRTUAL,
  `gender` tinyint(20) GENERATED ALWAYS AS (json_extract(`user_info`,'$.gender')) STORED,
  `country` varchar(100) COLLATE utf8mb4_unicode_ci GENERATED ALWAYS AS (json_unquote(json_extract(`user_info`,'$.country'))) VIRTUAL,
  `language` varchar(100) COLLATE utf8mb4_unicode_ci GENERATED ALWAYS AS (json_unquote(json_extract(`user_info`,'$.language'))) VIRTUAL,
  `nick_name` varchar(100) COLLATE utf8mb4_unicode_ci GENERATED ALWAYS AS (json_unquote(json_extract(`user_info`,'$.nickName'))) VIRTUAL,
  `province` varchar(100) COLLATE utf8mb4_unicode_ci GENERATED ALWAYS AS (json_unquote(json_extract(`user_info`,'$.province'))) VIRTUAL,
  `avatar_url` varchar(255) COLLATE utf8mb4_unicode_ci GENERATED ALWAYS AS (json_unquote(json_extract(`user_info`,'$.avatarUrl'))) VIRTUAL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '手机号',
  `address_id` int(11) DEFAULT NULL COMMENT '地址id',
  `province_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '省份名称',
  `city_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '城市名称',
  `last_modify` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `invalid` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `open_id` (`open_id`),
  KEY `openid` (`open_id`) USING BTREE,
  KEY `skey` (`skey`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='会话管理用户信息';

SET FOREIGN_KEY_CHECKS = 1;
