CREATE TABLE IF NOT EXISTS `job` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` varchar(36) NOT NULL,
  `job` varchar(255) NOT NULL,
  `config` text NOT NULL,
  `progress` int(11) NOT NULL DEFAULT '0',
  `status` enum('wait','start','finish','error') NOT NULL DEFAULT 'wait',
  `from` varchar(15) NOT NULL,
  `agent` text NOT NULL,
  `log` text NOT NULL,
  `recordTime` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
)DEFAULT CHARSET=utf8;