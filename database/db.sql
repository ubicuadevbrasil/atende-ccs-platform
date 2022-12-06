-- --------------------------------------------------------
-- Servidor:                     10.85.168.230
-- Versão do servidor:           10.4.13-MariaDB-1:10.4.13+maria~buster-log - mariadb.org binary distribution
-- OS do Servidor:               debian-linux-gnu
-- HeidiSQL Versão:              11.0.0.5919
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Copiando estrutura do banco de dados para db_cruzeiro_ccs
CREATE DATABASE IF NOT EXISTS `db_cruzeiro_ccs` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
USE `db_cruzeiro_ccs`;

-- Copiando estrutura para procedure db_cruzeiro_ccs.ccs_consulta
DELIMITER //
CREATE PROCEDURE `ccs_consulta`(
	IN `limitQry` TEXT,
	IN `transdt` TEXT,
	IN `filtros` TEXT,
	IN `choice` TEXT


)
BEGIN
#-
DROP TABLE IF EXISTS dados;
SET @filtros = (SELECT filtros FROM information_schema.parameters LIMIT 1);
SET @choice = (SELECT choice FROM information_schema.parameters LIMIT 1);
#-
SET @limitQry = (SELECT limitQry FROM information_schema.parameters LIMIT 1);
SET @transdt = (SELECT transdt FROM information_schema.parameters LIMIT 1);
#-
CREATE TEMPORARY TABLE dados (
	filename TEXT,
   sessionid TEXT,
   cpf TEXT,
   atendir TEXT,
   atendente TEXT,
   mobile TEXT,
   hora TEXT,
   data TEXT,
   status TEXT,
   dtatendimento TIMESTAMP,
   rgm_aluno TEXT,
   nome TEXT
);
#-
INSERT INTO dados (filename,sessionid,cpf,atendir,atendente,mobile,hora,data,status,dtatendimento,rgm_aluno,nome)
	SELECT ativ.filename,a.sessionid, a.cnpj, atendir, u.nome AS atendente, a.mobile AS mobile, DATE_FORMAT(a.dten, '%H:%i') AS hora, 
	DATE_FORMAT(a.dten, '%d/%m/%Y') AS DATA, (b.descricao) AS STATUS, a.dten, ativ.rgm_aluno, a.name
	FROM tab_encerrain AS a
	LEFT JOIN tab_statusen AS b ON(a.status = b.id)
	LEFT JOIN tab_usuarios AS u ON(a.fkto = u.id)
	LEFT JOIN tab_ativo AS ativ ON (a.mobile = ativ.mobile)
	WHERE a.fkto = @transdt
	GROUP BY a.sessionid
	ORDER BY a.dtin, a.sessionid DESC;
#-
IF @limitQry = "MAX" THEN
	SET @mainQuery = CONCAT('SELECT ', @choice ,' FROM dados ', @filtros ,'ORDER BY dtatendimento DESC');
ELSE
	SET @mainQuery = CONCAT('SELECT ', @choice ,' FROM dados ', @filtros ,'ORDER BY dtatendimento DESC LIMIT ', @limitQry,',20');
	#SET @mainQuery = CONCAT('SELECT ', @choice ,' FROM dados ', @filtros ,'ORDER BY dtatendimento DESC');
END IF;
select @choice, @filtros, @limitQry, @transdt, @mainQuery;
PREPARE stmt FROM @mainQuery;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
#-
DROP TABLE IF EXISTS dados;
#-
END//
DELIMITER ;

-- Copiando estrutura para procedure db_cruzeiro_ccs.css_report
DELIMITER //
CREATE PROCEDURE `css_report`(
	IN `limitQry` TEXT,
	IN `transdt` TEXT



,
	IN `filtros` TEXT
,
	IN `choice` TEXT




















)
BEGIN
#-
DROP TABLE IF EXISTS dados;
SET @filtros = (SELECT filtros FROM information_schema.parameters LIMIT 1);
SET @choice = (SELECT choice FROM information_schema.parameters LIMIT 1);
#-
SET @limitQry = (SELECT limitQry FROM information_schema.parameters LIMIT 1);
SET @transdt = (SELECT transdt FROM information_schema.parameters LIMIT 1);
SET @dtinicio = (SELECT SUBSTRING_INDEX(@transdt, ',', 1));
SET @dtfinal = (SUBSTRING_INDEX(SUBSTRING_INDEX(@transdt, ',', -1), ',', 2));
#-
CREATE TEMPORARY TABLE dados (
	filename TEXT,
   sessionid TEXT,
   cpf TEXT,
   atendir TEXT,
   atendente TEXT,
   mobile TEXT,
   hora TEXT,
   data TEXT,
   status TEXT,
   dtatendimento TIMESTAMP,
   rgm_aluno TEXT,
   nome TEXT
);
#-
INSERT INTO dados (filename,sessionid,cpf,atendir,atendente,mobile,hora,data,status,dtatendimento,rgm_aluno,nome)
	SELECT ativ.filename,a.sessionid, a.cnpj, atendir, u.nome AS atendente, a.mobile AS mobile, DATE_FORMAT(a.dten, '%H:%i') AS hora, 
	DATE_FORMAT(a.dten, '%d/%m/%Y') AS DATA, (b.descricao) AS STATUS, a.dten, ativ.rgm_aluno, a.name
	FROM tab_encerrain AS a
	LEFT JOIN tab_statusen AS b ON(a.status = b.id)
	LEFT JOIN tab_usuarios AS u ON(a.fkto = u.id)
	LEFT JOIN tab_ativo AS ativ ON (a.mobile = ativ.mobile)
	WHERE a.dten BETWEEN @dtinicio AND @dtfinal
	GROUP BY a.sessionid
	ORDER BY a.dtin, a.sessionid DESC;
#-
IF @limitQry = "MAX" THEN
	SET @mainQuery = CONCAT('SELECT ', @choice ,' FROM dados ', @filtros ,'ORDER BY dtatendimento DESC');
ELSE
	SET @mainQuery = CONCAT('SELECT ', @choice ,' FROM dados ', @filtros ,'ORDER BY dtatendimento DESC LIMIT ', @limitQry,',20');
	#SET @mainQuery = CONCAT('SELECT ', @choice ,' FROM dados ', @filtros ,'ORDER BY dtatendimento DESC');
END IF;
select @choice, @filtros, @limitQry, @transdt, @mainQuery;
PREPARE stmt FROM @mainQuery;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
#-
DROP TABLE IF EXISTS dados;
#-
END//
DELIMITER ;

-- Copiando estrutura para procedure db_cruzeiro_ccs.css_report_excel
DELIMITER //
CREATE PROCEDURE `css_report_excel`(
	IN `limitQry` TEXT,
	IN `transdt` TEXT,
	IN `filtros` TEXT,
	IN `choice` TEXT













)
BEGIN
#-
DROP TABLE IF EXISTS dados;
SET @filtros = (SELECT filtros FROM information_schema.parameters LIMIT 1);
SET @choice = (SELECT choice FROM information_schema.parameters LIMIT 1);
#-
SET @limitQry = (SELECT limitQry FROM information_schema.parameters LIMIT 1);
SET @transdt = (SELECT transdt FROM information_schema.parameters LIMIT 1);
SET @dtinicio = (SELECT SUBSTRING_INDEX(@transdt, ',', 1));
SET @dtfinal = (SUBSTRING_INDEX(SUBSTRING_INDEX(@transdt, ',', -1), ',', 2));
#-
CREATE TEMPORARY TABLE dados (
	filename TEXT,
   sessionid TEXT,
   cpf TEXT,
   atendir TEXT,
   atendente TEXT,
   mobile TEXT,
   hora TEXT,
   data TEXT,
   status TEXT,
   dtatendimento TIMESTAMP,
   rgm_aluno TEXT,
   nome TEXT
);
#-
INSERT INTO dados (filename,sessionid,cpf,atendir,atendente,mobile,hora,data,status,dtatendimento,rgm_aluno,nome)
	SELECT ativ.filename,a.sessionid, a.cnpj, atendir, u.nome AS atendente, a.mobile AS mobile, DATE_FORMAT(a.dten, '%H:%i') AS hora, 
	DATE_FORMAT(a.dten, '%d/%m/%Y') AS DATA, (b.descricao) AS STATUS, a.dten, ativ.rgm_aluno, a.name
	FROM tab_encerrain AS a
	LEFT JOIN tab_statusen AS b ON(a.status = b.id)
	LEFT JOIN tab_usuarios AS u ON(a.fkto = u.id)
	LEFT JOIN tab_ativo AS ativ ON (a.mobile = ativ.mobile)
	WHERE a.dten BETWEEN @dtinicio AND @dtfinal
	GROUP BY a.sessionid
	ORDER BY a.dtin, a.sessionid DESC;
#-
IF @limitQry = "MAX" THEN
	SET @mainQuery = CONCAT('SELECT ', @choice ,' FROM dados ', @filtros ,'ORDER BY dtatendimento DESC');
ELSE
	SET @mainQuery = CONCAT('SELECT ', @choice ,' FROM dados ', @filtros ,'ORDER BY dtatendimento DESC LIMIT ', @limitQry,',20');
END IF;
select @choice, @filtros, @limitQry, @transdt, @mainQuery;
PREPARE stmt FROM @mainQuery;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
#-
DROP TABLE IF EXISTS dados;
#-
END//
DELIMITER ;

-- Copiando estrutura para tabela db_cruzeiro_ccs.tab_api_log
CREATE TABLE IF NOT EXISTS `tab_api_log` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `dtaccess` timestamp NOT NULL DEFAULT current_timestamp(),
  `dtable` varchar(50) NOT NULL,
  `log` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2979 DEFAULT CHARSET=utf8mb4;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela db_cruzeiro_ccs.tab_atendein
CREATE TABLE IF NOT EXISTS `tab_atendein` (
  `sessionid` varchar(36) NOT NULL,
  `mobile` bigint(20) NOT NULL,
  `dtin` timestamp NULL DEFAULT NULL,
  `dtat` timestamp NOT NULL DEFAULT current_timestamp(),
  `name` varchar(80) DEFAULT NULL,
  `account` varchar(10) DEFAULT NULL,
  `photo` varchar(100) DEFAULT NULL,
  `fkto` varchar(36) NOT NULL,
  `fkname` varchar(80) NOT NULL,
  `transfer` int(11) NOT NULL DEFAULT 0,
  `status` int(11) NOT NULL DEFAULT 0,
  `atendir` varchar(50) NOT NULL DEFAULT 'in',
  PRIMARY KEY (`sessionid`),
  KEY `idx_mobile` (`mobile`),
  KEY `idx_fkto` (`fkto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela db_cruzeiro_ccs.tab_ativo
CREATE TABLE IF NOT EXISTS `tab_ativo` (
  `id` varchar(50) NOT NULL DEFAULT '',
  `filename` varchar(50) DEFAULT '',
  `nome` varchar(200) DEFAULT NULL,
  `quantidade` int(20) NOT NULL DEFAULT 0,
  `mobile` varchar(20) DEFAULT NULL,
  `rgm_aluno` varchar(50) DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT 0,
  `dtcadastro` timestamp NOT NULL DEFAULT current_timestamp(),
  `cpf` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela db_cruzeiro_ccs.tab_cadastros
CREATE TABLE IF NOT EXISTS `tab_cadastros` (
  `sessionid` varchar(36) NOT NULL,
  `mobile` bigint(20) NOT NULL,
  `dtcadastro` timestamp NOT NULL DEFAULT current_timestamp(),
  `nome` varchar(100) NOT NULL,
  `account` varchar(10) NOT NULL,
  `photo` varchar(100) NOT NULL,
  `status` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`sessionid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela db_cruzeiro_ccs.tab_config
CREATE TABLE IF NOT EXISTS `tab_config` (
  `id` bigint(20) DEFAULT 1,
  `robotsikmedia` int(11) DEFAULT 0,
  `rtserver` varchar(50) DEFAULT NULL,
  `waendpoint` char(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela db_cruzeiro_ccs.tab_encerrain
CREATE TABLE IF NOT EXISTS `tab_encerrain` (
  `sessionid` varchar(36) NOT NULL,
  `mobile` bigint(20) NOT NULL,
  `dtin` timestamp NULL DEFAULT NULL,
  `dtat` timestamp NULL DEFAULT NULL,
  `dten` timestamp NOT NULL DEFAULT current_timestamp(),
  `name` varchar(80) DEFAULT NULL,
  `account` varchar(10) DEFAULT NULL,
  `photo` varchar(100) DEFAULT NULL,
  `fkto` varchar(36) NOT NULL,
  `fkname` varchar(80) NOT NULL,
  `transfer` int(11) NOT NULL,
  `status` int(11) NOT NULL DEFAULT 0,
  `cnpj` varchar(15) DEFAULT NULL,
  `segmento` varchar(50) DEFAULT NULL,
  `atendir` varchar(50) NOT NULL DEFAULT 'in',
  `pedido` varchar(15) DEFAULT NULL,
  `valor` varchar(10) DEFAULT NULL,
  `reports` int(11) DEFAULT 0,
  PRIMARY KEY (`sessionid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela db_cruzeiro_ccs.tab_filain
CREATE TABLE IF NOT EXISTS `tab_filain` (
  `mobile` bigint(20) NOT NULL,
  `dtin` timestamp NOT NULL DEFAULT current_timestamp(),
  `account` varchar(10) DEFAULT NULL,
  `photo` varchar(100) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT 1,
  PRIMARY KEY (`mobile`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela db_cruzeiro_ccs.tab_logins
CREATE TABLE IF NOT EXISTS `tab_logins` (
  `id` varchar(100) NOT NULL,
  `fkid` mediumtext DEFAULT NULL,
  `fkname` mediumtext DEFAULT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `status` mediumtext DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela db_cruzeiro_ccs.tab_logs
CREATE TABLE IF NOT EXISTS `tab_logs` (
  `id` varchar(36) NOT NULL,
  `sessionid` varchar(36) NOT NULL,
  `dt` timestamp NOT NULL DEFAULT current_timestamp(),
  `fromid` varchar(36) DEFAULT NULL,
  `fromname` varchar(100) DEFAULT NULL,
  `toid` varchar(36) DEFAULT NULL,
  `toname` varchar(100) DEFAULT NULL,
  `msgdir` char(1) DEFAULT NULL,
  `stread` int(11) NOT NULL DEFAULT 0,
  `msgtype` varchar(10) DEFAULT NULL,
  `msgtext` text DEFAULT NULL,
  `msgurl` text DEFAULT NULL,
  `msgcaption` text DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `idx_sessionid` (`sessionid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela db_cruzeiro_ccs.tab_outbound
CREATE TABLE IF NOT EXISTS `tab_outbound` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `mobile` varchar(20) NOT NULL DEFAULT '0',
  `msg` varchar(500) NOT NULL DEFAULT '0',
  `status` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela db_cruzeiro_ccs.tab_pedidos
CREATE TABLE IF NOT EXISTS `tab_pedidos` (
  `id` varchar(36) NOT NULL,
  `sessionid` varchar(36) NOT NULL,
  `dtpedido` timestamp NULL DEFAULT current_timestamp(),
  `segmento` varchar(50) DEFAULT NULL,
  `pedido` varchar(15) DEFAULT NULL,
  `valor` varchar(10) DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `idx_sessionid` (`sessionid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela db_cruzeiro_ccs.tab_prior
CREATE TABLE IF NOT EXISTS `tab_prior` (
  `mobile` bigint(20) NOT NULL,
  PRIMARY KEY (`mobile`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela db_cruzeiro_ccs.tab_profiles
CREATE TABLE IF NOT EXISTS `tab_profiles` (
  `mobile` bigint(20) NOT NULL,
  `dt` timestamp NOT NULL DEFAULT current_timestamp(),
  `name` varchar(100) NOT NULL,
  `account` varchar(10) NOT NULL,
  `photo` varchar(100) NOT NULL,
  `status` int(11) NOT NULL DEFAULT 1,
  PRIMARY KEY (`mobile`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela db_cruzeiro_ccs.tab_sikmedia
CREATE TABLE IF NOT EXISTS `tab_sikmedia` (
  `id` varchar(36) NOT NULL,
  `dt` timestamp NOT NULL DEFAULT current_timestamp(),
  `toid` varchar(36) DEFAULT NULL,
  `typefile` varchar(10) DEFAULT NULL,
  `hashfile` varchar(100) DEFAULT NULL,
  `descfile` varchar(500) DEFAULT NULL,
  `status` int(11) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela db_cruzeiro_ccs.tab_statusen
CREATE TABLE IF NOT EXISTS `tab_statusen` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `descricao` varchar(100) DEFAULT NULL,
  `pedido` int(11) DEFAULT 0,
  `status` int(11) DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=326 DEFAULT CHARSET=utf8mb4;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela db_cruzeiro_ccs.tab_timeout
CREATE TABLE IF NOT EXISTS `tab_timeout` (
  `id` varchar(50) NOT NULL,
  `fkid_atendente` mediumtext NOT NULL,
  `nome_atendente` mediumtext NOT NULL,
  `fkid_supervisor` mediumtext DEFAULT NULL,
  `nome_supervisor` mediumtext DEFAULT NULL,
  `motivo_desbloqueio` mediumtext DEFAULT NULL,
  `data_bloqueio` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `data_desbloqueio` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela db_cruzeiro_ccs.tab_treinamento
CREATE TABLE IF NOT EXISTS `tab_treinamento` (
  `training` text DEFAULT NULL,
  `id` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela db_cruzeiro_ccs.tab_usuarios
CREATE TABLE IF NOT EXISTS `tab_usuarios` (
  `id` varchar(36) NOT NULL,
  `dtcadastro` timestamp NOT NULL DEFAULT current_timestamp(),
  `perfil` int(11) DEFAULT 3,
  `photo` varchar(100) DEFAULT NULL,
  `nome` varchar(100) NOT NULL,
  `usuario` varchar(30) NOT NULL,
  `senha` varchar(50) NOT NULL,
  `status` int(11) NOT NULL DEFAULT 1,
  `bloqueado` text DEFAULT 'não',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='perfil: \r\n\r\n1 - Gerente \r\n2 - Supervisor\r\n3 - Atendente\r\n\r\n';

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela db_cruzeiro_ccs.tab_waboxappin
CREATE TABLE IF NOT EXISTS `tab_waboxappin` (
  `id` varchar(36) NOT NULL,
  `host` varchar(30) DEFAULT NULL,
  `uid` text DEFAULT NULL,
  `dtin` timestamp NOT NULL DEFAULT current_timestamp(),
  `contact_uid` text DEFAULT NULL,
  `contact_name` text DEFAULT NULL,
  `contact_type` text DEFAULT NULL,
  `message_dtm` text DEFAULT NULL,
  `message_uid` text DEFAULT NULL,
  `message_cuid` text DEFAULT NULL,
  `message_dir` text DEFAULT NULL,
  `message_type` text DEFAULT NULL,
  `message_ack` text DEFAULT NULL,
  `body_caption` text DEFAULT NULL,
  `body_contact` text DEFAULT NULL,
  `body_duration` text DEFAULT NULL,
  `body_lat` text DEFAULT NULL,
  `body_lng` text DEFAULT NULL,
  `body_mimetype` text DEFAULT NULL,
  `body_name` text DEFAULT NULL,
  `body_size` text DEFAULT NULL,
  `body_text` text DEFAULT NULL,
  `body_thumb` text DEFAULT NULL,
  `body_url` text DEFAULT NULL,
  `body_vcard` text DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para view db_cruzeiro_ccs.vw_agentes
-- Criando tabela temporária para evitar erros de dependência de VIEW
CREATE TABLE `vw_agentes` (
	`fkto` VARCHAR(36) NOT NULL COLLATE 'utf8mb4_general_ci',
	`atendimentos` VARCHAR(9) NOT NULL COLLATE 'utf8mb4_general_ci',
	`total` BIGINT(21) NOT NULL
) ENGINE=MyISAM;

-- Copiando estrutura para view db_cruzeiro_ccs.vw_fila
-- Criando tabela temporária para evitar erros de dependência de VIEW
CREATE TABLE `vw_fila` (
	`tabela` VARCHAR(14) NOT NULL COLLATE 'utf8mb4_general_ci',
	`total` DECIMAL(42,4) NULL
) ENGINE=MyISAM;

-- Copiando estrutura para view db_cruzeiro_ccs.vw_agentes
-- Removendo tabela temporária e criando a estrutura VIEW final
DROP TABLE IF EXISTS `vw_agentes`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `vw_agentes` AS select `tab_atendein`.`fkto` AS `fkto`,'atendein' AS `atendimentos`,count(0) AS `total` from `tab_atendein` group by `tab_atendein`.`fkto` union select `tab_encerrain`.`fkto` AS `fkto`,'encerrain' AS `atendimentos`,count(0) AS `total` from `tab_encerrain` where `tab_encerrain`.`dten` like concat(curdate(),'%') group by `tab_encerrain`.`fkto`;

-- Copiando estrutura para view db_cruzeiro_ccs.vw_fila
-- Removendo tabela temporária e criando a estrutura VIEW final
DROP TABLE IF EXISTS `vw_fila`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `vw_fila` AS (select 'atendein' AS `tabela`,count(0) AS `total` from `tab_atendein` where `tab_atendein`.`account` is null) union (select 'filain' AS `tabela`,count(0) AS `total` from `tab_filain` where `tab_filain`.`status` = 1) union (select 'encerrain' AS `tabela`,count(0) AS `total` from `tab_encerrain` where `tab_encerrain`.`dten` like concat(curdate(),'%') and `tab_encerrain`.`account` is null) union (select 'tma' AS `tabela`,sum(time_to_sec(timediff(`tab_encerrain`.`dten`,`tab_encerrain`.`dtat`))) / (select count(0) from `tab_encerrain` where cast(`tab_encerrain`.`dten` as date) = cast(current_timestamp() as date) and `tab_encerrain`.`account` = 'prior') AS `total` from `tab_encerrain` where cast(`tab_encerrain`.`dten` as date) = cast(current_timestamp() as date) and `tab_encerrain`.`account` = 'prior') union (select 'taf' AS `tabela`,timestampdiff(SECOND,`tab_filain`.`dtin`,current_timestamp()) AS `total` from `tab_filain` where `tab_filain`.`status` = 1 order by `tab_filain`.`dtin` limit 1) union (select 'filaPrior' AS `tabela`,count(0) AS `total` from `tab_filain` where `tab_filain`.`status` = 7) union (select 'atendeinPrior' AS `tabela`,count(0) AS `total` from `tab_atendein` where `tab_atendein`.`account` = 'prior') union (select 'encerrainPrior' AS `tabela`,count(0) AS `total` from `tab_encerrain` where `tab_encerrain`.`dten` like concat(curdate(),'%') and `tab_encerrain`.`account` = 'prior') union (select 'tmaPrior' AS `tabela`,sum(time_to_sec(timediff(`tab_encerrain`.`dten`,`tab_encerrain`.`dtat`))) / (select count(0) from `tab_encerrain` where cast(`tab_encerrain`.`dten` as date) = cast(current_timestamp() as date) and `tab_encerrain`.`account` is null) AS `total` from `tab_encerrain` where cast(`tab_encerrain`.`dten` as date) = cast(current_timestamp() as date) and `tab_encerrain`.`account` is null) union (select 'tafPrior' AS `tabela`,timestampdiff(SECOND,`tab_filain`.`dtin`,current_timestamp()) AS `total` from `tab_filain` where `tab_filain`.`status` = 7 order by `tab_filain`.`dtin` limit 1);

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
