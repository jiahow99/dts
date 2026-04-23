<?php

return array(
	'export' => array(
		'3.0' => array(
			'admin/controller/extension/module/distribution_center.php',
			'admin/model/extension/module/dc_order.php',
			'admin/view/template/extension/module/distribution_center/*',
			'admin/view/stylesheet/dts.css',
			'admin/view/template/extension/module/components/*',
			'admin/view/template/extension/module/layout/*',
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
