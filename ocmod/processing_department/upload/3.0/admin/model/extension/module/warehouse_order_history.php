<?php
class ModelExtensionModuleWarehouseOrderHistory extends Model {
    public function getWarehouseOrderHistory($warehouse_order_id) {
        return $this->db->query("SELECT * FROM `" . DB_PREFIX . "warehouse_order_history` WHERE warehouse_order_id = '" . (int)$warehouse_order_id . "' ORDER BY date_added DESC")->rows;
    }

	public function getLastWarehouseOrderHistory($warehouse_order_id) {
        return $this->db->query("SELECT * FROM `" . DB_PREFIX . "warehouse_order_history` WHERE warehouse_order_id = '" . (int)$warehouse_order_id . "' ORDER BY date_added DESC LIMIT 1")->row;
    }
    
    public function addWarehouseOrderHistory($warehouse_order, $new_status_id, $include_products=true) {
		$this->load->model('user/user');
		$this->load->model('extension/module/warehouse_order');

		$admin_id = $this->user->getId();
		$old_wh_order = $this->model_extension_module_warehouse_order->getWarehouseOrder($warehouse_order['warehouse_order_id']);
		$old_products = $old_wh_order['products'];

		$json = array();
		$changes = array('warehouse_qty', 'weight');

		// Status
		$old_status = $this->model_extension_module_warehouse_order->statusName($old_wh_order['order_status_id']);
		$new_status = $this->model_extension_module_warehouse_order->statusName($new_status_id);
		$json['old_status'] = $old_status;
		$json['new_status'] = $new_status;

		// Products
		if ($include_products) {
			foreach ($warehouse_order['products'] as $new_product) {
				$order_product_id = $new_product['order_product_id'];
				$old_product = array_values(array_filter($old_products, function($product) use ($order_product_id) {
					return $product['order_product_id'] == $order_product_id;
				}))[0];
	
				$data = array();
				$data['order_product_id'] = $order_product_id;
	
				foreach ($changes as $field) {
					if ($old_product[$field] != $new_product[$field]) {
						$data['changes'][] = array(
							'field' => $field,
							'old_value' => $old_product[$field],
							'new_value' => $new_product[$field]
						);
					}
				}
				$json['products'][] = $data;
			}
		}

		$json = json_encode($json);
		
		$this->db->query("
			INSERT INTO " . DB_PREFIX . "warehouse_order_history 
				(warehouse_order_id, remark, date_added, added_by) 
			VALUES ('" . (int)$warehouse_order['warehouse_order_id'] . "', '$json', NOW(), '" . $admin_id . "')
		");
	}
}