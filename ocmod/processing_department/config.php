<?php

return array(
	'export' => array(
		'3.0' => array(
			'admin/controller/extension/module/processing_department.php',
			'system/warehouse.ocmod.xml',
			'admin/model/extension/module/warehouse_order.php',
			'admin/model/extension/module/warehouse_order_history.php',
			'admin/view/template/extension/module/processing_department/*',
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
