<?php

	/**************************/
	/* DASUV 		init.php  */
	/**************************/

	error_reporting(0);

	$config['db'] = array(
		'host' => 'dasuv.db.10233176.hostedresource.com',
		'user' => 'dasuv',
		'pass' => 'Zavod666!',
		'dbname' => 'dasuv'
	);

	$db = new PDO(
		'mysql:host='.$config['db']['host'].
		';dbname='.$config['db']['dbname'],
		$config['db']['user'],
		$config['db']['pass']
	);	

	$db -> exec("SET CHARACTER SET utf8");

?>