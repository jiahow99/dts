<?php

return array(
	'export' => array(
		'3.0' => array(
			'admin/model/location/driver_admin.php',
			'admin/controller/location/driver_admin.php',
			'admin/language/en-gb/location/driver_admin.php',
			'admin/view/template/location/driver_admin.twig',
			'admin/view/template/location/driver_admin_assign.twig',
			'admin/view/template/components/driver_admin/*',
			'system/driver.ocmod.xml',
		),
		'1.5' => array(

		)
	),
	'twig_to_tpl' => array(
		
	),
	'build' => array(
		'3.0' => array(
			'3.0/admin/*' => 'upload/admin',
			'3.0/catalog/*' => 'upload/catalog',
			'3.0/module.ocmod.xml' => ''
		),
		'2.3' => array(
			'3.0/admin/*' => 'upload/admin',
			'3.0/catalog/*' => 'upload/catalog',
			'3.0/module.ocmod.xml' => ''
		),
		'2.0' => array(
			'3.0/admin/*' => 'upload/admin',
			'3.0/catalog/*' => 'upload/catalog',
			'3.0/module.ocmod.xml' => ''
		),
		'1.5' => array(
			'3.0/admin/*' => 'upload/admin',
			'3.0/catalog/*' => 'upload/catalog',
			'1.5/vqmod/xml/module.xml' => 'vqmod/xml/'
		),
		'extra' => array(
		)
	)
);
