<?php

return array(
	'export' => array(
		'3.0' => array(
			'admin/view/template/extension/module/driver.twig',
			'admin/controller/extension/module/driver.php',
			'admin/model/extension/module/driver_order.php',
			'admin/view/template/extension/module/components/*',
			'admin/view/template/extension/module/layout/*',
			'admin/controller/location/*',
			'admin/view/template/location/*',
			'admin/language/en-gb/location/*',
			'admin/view/template/components/*',
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
