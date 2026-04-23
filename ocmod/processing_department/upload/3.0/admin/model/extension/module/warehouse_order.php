<?php

use Symfony\Component\Validator\Constraints\Date;

class ModelExtensionModuleWarehouseOrder extends Model {
	const STATUS_NEW = 1;
    const STATUS_PROCESSING = 2;
    const STATUS_COMPLETED = 3;
	const PRODUCT_STATUS_OUT_OF_STOCK = 1;

	public function createWarehouseOrder($data) {
		$this->db->query("DELETE FROM " . DB_PREFIX . "warehouse_order where order_id = '" . (int)$data['order_id'] ."'");
		$this->db->query("INSERT INTO " . DB_PREFIX . "warehouse_order SET warehouse_id = '" . (int)$data['warehouse_id'] . "', order_id = '" . (int)$data['order_id'] . "', visible_datetime = '" . $this->db->escape($data['visible_time']) . "', warehouse_order_batch_id = '0',  order_status_id = '" . (int)self::STATUS_NEW . "'");
	}

    public function editWarehouseOrder($warehouse_order_id, $data) {
		$this->db->query("UPDATE " . DB_PREFIX . "warehouse_order SET 
            warehouse_id = '" . (int)$data['warehouse_id'] . "',
            order_id = '" . (int)$data['order_id'] . "',
            visible_datetime = '" . $this->db->escape($data['visible_datetime']) . "',
            warehouse_order_batch_id = '" . (int)$data['warehouse_order_batch_id'] . "',
            order_status_id = '" . (int)$data['order_status_id'] . "',
            date_completed = " . $this->db->escape($data['date_completed']) . "
            WHERE warehouse_order_id = '" . (int)$warehouse_order_id . "'");
	}

    public function getWarehouseOrder($warehouse_order_id) {
		$this->load->model('user/user');
		$admin = $this->model_user_user->getUser($this->user->getId());

		$query = $this->db->query("SELECT * FROM " . DB_PREFIX . "warehouse_order WHERE warehouse_order_id = '" . (int)$warehouse_order_id . "'");
		
		if (!empty($query->row)) {
			$order = $query->row;
			$order['products'] = $this->getOrderProducts($order['order_id'], $admin['warehouse_id']);
			return $order;
		} else {
			return [];
		}
	}

	public function getWarehouseOrders($warehouse_id, $order_status, $filter=[]) {
		$data = array();
		$this->load->model('tool/image');
		$this->load->model('localisation/order_status');
		$this->load->model('extension/module/warehouse_order_history');

		$and = '';

		// For new orders
		if ($order_status == 'main' || $order_status == 'advance') {
			$new_type = $order_status;
			$order_status = $this->statusNew();
			$and .= $new_type == 'main'
				? " AND DATE(o.delivery_date) IN (CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 DAY))"
				: " AND DATE(o.delivery_date) > CURDATE()";
		}

		// Warehouse orders
		$sql = "
			SELECT *, wob.picklist_id, wo.order_status_id, wob.added_by
			FROM " . DB_PREFIX . "warehouse_order wo
			LEFT JOIN " . DB_PREFIX . "warehouse_order_batch wob ON wo.warehouse_order_batch_id = wob.warehouse_order_batch_id
			LEFT JOIN " . DB_PREFIX . "order o ON o.order_id = wo.order_id
			WHERE wo.warehouse_id = '" . (int)$warehouse_id . "' 
			AND wo.order_status_id = '" . (int)$order_status . "' 
			AND wo.visible_datetime < NOW()
			$and
		";

		// Filter
		if ($filter['customer'] != '') {
			$sql .= " AND o.shipping_firstname LIKE '%" . $this->db->escape($filter['customer']) . "%' OR o.shipping_lastname LIKE '%" . $filter['customer'] . "%'";
		}
		if ($filter['order_id'] != '') {
			$sql .= " AND o.order_id LIKE '%" . (int)$filter['order_id'] . "%'";
		}	
		if ($filter['batch_id'] != '') {
			$sql .= " AND wob.warehouse_order_batch_name LIKE '%" . (int)$filter['batch_id'] . "%'";
		}	
		if ($filter['delivery_date'] != '') {
			$date = DateTime::createFromFormat('m/d/Y', $filter['delivery_date']);
			$delivery_date = $date->format('Y-m-d');
			$sql .= " AND o.delivery_date = '" . $delivery_date . "'";
		}		

		// Completed
		if ($order_status == self::STATUS_COMPLETED) {
			$sql .= ' ORDER BY wo.date_completed DESC, wo.warehouse_order_id DESC';
		} else {
			$sql .= ' ORDER BY o.delivery_date DESC, o.order_id DESC';
		}
		
		// Pagination
		$page = isset($filter['page']) ? (int)$filter['page'] : 1; 
		$limit = isset($filter['limit']) ? (int)$filter['limit'] : 10;
		$start = ($page - 1) * $limit;
		
		$sql .= " LIMIT $start, $limit"; 

		$warehouse_orders = $this->db->query($sql);		

		foreach ($warehouse_orders->rows as $warehouse_order) {
			$array = array();
			$order_id = $warehouse_order['order_id'];
			
			$array['warehouse_order_id'] = $warehouse_order['warehouse_order_id'];
			$array['order_id'] = $order_id;
			$array['shipping_firstname'] = $warehouse_order['shipping_firstname'];
			$array['shipping_lastname'] = $warehouse_order['shipping_lastname'];
			$array['order_status_id'] = $warehouse_order['order_status_id'];
			$array['order_status'] = $this->statusName($warehouse_order['order_status_id']);
			$array['warehouse_order_batch_id'] = $warehouse_order['warehouse_order_batch_id'];
			$array['warehouse_order_batch_name'] = $warehouse_order['warehouse_order_batch_name'];
			$array['added_by'] = $warehouse_order['added_by'];
			$array['picklist_id'] = $warehouse_order['picklist_id'];
			$array['date_added'] = $warehouse_order['date_added'];
			$array['date_completed'] = $warehouse_order['date_completed'];
			$array['can_revert'] = $this->canRevert($warehouse_order['date_completed']);
			$delivery_date = new DateTime($warehouse_order['delivery_date']);
			$array['delivery_date'] = $delivery_date->format('d/m/Y');

			// Products
			$array['products'] = $this->getOrderProducts($order_id, $warehouse_id);	

			// Revert order
			$array['revert_order'] = $this->isRevertOrder($array);
			
			// Updated by
			$latest_history = $this->model_extension_module_warehouse_order_history->getLastWarehouseOrderHistory($warehouse_order['warehouse_order_id']);
			if (isset($latest_history['added_by'])) {
				$updated_by = $this->model_user_user->getUser($latest_history['added_by']);
				$updated_at = new DateTime($latest_history['date_added']);
				$array['updated_by'] = sprintf('%s (%s)', $updated_by['firstname'] . ' ' . $updated_by['lastname'], $updated_at->format('m/d/Y g:i a'));
			}
			
			$data[] = $array;
		}

		return $data;
	}

	public function getOrderProducts($order_id, $warehouse_id=null, $and='') {
		$this->load->model('tool/image');
		
		$warehouse_id_sql = '';
		if ($warehouse_id != null) {
			$warehouse_id_sql = "AND op.warehouse_id = '" . (int)$warehouse_id . "'";
		}

		$query = $this->db->query("
			SELECT 
				o.delivery_date,
				op.order_id,
				op.name,
				op.product_id,
				op.weight,
				op.order_weight,
				op.order_product_id,
				op.quantity,
				op.warehouse_qty,
				op.dc_qty,
				op.product_status_id,
				op.remark,
				op.revert_order,
				op.checked,
				op.partial_weights,
				p.image,
				p.ac_uom,
				wcd.unit,
				oopt.image as option_image,
				oopt.option,
				oopt.option_value,
				oopt.option2,
				oopt.option_value2,
				oopt.order_option_id,
				oopt.product_option_value_id,
				pu.name as product_unit
			FROM " . DB_PREFIX . "order_product op
			LEFT JOIN " . DB_PREFIX . "order o ON o.order_id = op.order_id
			LEFT JOIN " . DB_PREFIX . "product p ON op.product_id = p.product_id
			LEFT JOIN " . DB_PREFIX . "product_unit pu ON pu.product_unit_id = p.product_unit_id
			LEFT JOIN " . DB_PREFIX . "order_option oopt ON op.order_product_id = oopt.order_product_id
			LEFT JOIN " . DB_PREFIX . "product_option_value pov ON pov.product_option_value_id = oopt.product_option_value_id
			LEFT JOIN " . DB_PREFIX . "weight_class_description wcd ON p.weight_class_id = wcd.weight_class_id
			WHERE op.order_id = '" . (int)$order_id . "'
			$and
			$warehouse_id_sql
			GROUP BY op.order_product_id
		");

		$products = $query->rows;

		foreach ($products as &$product) {
			// Option image
			if ($product['product_option_value_id']) {
				$image = $product['option_image']
					? $this->model_tool_image->resize($product['option_image'], 200, 200)
					: $this->model_tool_image->resize($product['image'], 200, 200);
			// Base image
			} else {
				$image = $this->model_tool_image->resize($product['image'], 200, 200);
			}
			// No image
			if ($image == null) {
				$image = $this->model_tool_image->resize('no_image.png', 200, 200);
			}
			// Weight
			$product['order_weight'] = floatval($product['order_weight']);
			$product['checked'] = $product['checked'] ? true : false;
			$product['image'] = $image;
			$product['out_of_stock'] = $product['product_status_id'] == $this->productStatusOutOfStock();
			$product['weight'] = floatval($product['weight']);
			$product['partial_weights'] = $product['partial_weights'] == null ? [$product['weight']] : unserialize($product['partial_weights']);
			$product['show_weight'] = $product['order_weight'] > 0;
			$product['product_unit'] = strtolower($product['product_unit']) == 'kg' ? null : $product['product_unit'];
		}

		return $products;
	}

	public function getPicklistByBatchId($batch_id) {
        $query = $this->db->query("
            SELECT 
                wob.warehouse_order_batch_id,
                wob.warehouse_order_batch_name,
                pi.*
            FROM " . DB_PREFIX . "warehouse_order_batch wob
            LEFT JOIN " . DB_PREFIX . "picklist pi ON pi.picklist_id = wob.picklist_id
            WHERE wob.warehouse_order_batch_id = '" . (int)$batch_id . "'
        ");

		$result = $query->row;
		if ($result['json'] != null) {
			$result['json'] = json_decode($result['json'], true);
		}

		return $result;
	}

	public function getWarehouseOrderByOrderId($order_id) {
        $query = $this->db->query("SELECT visible_datetime FROM " . DB_PREFIX . "warehouse_order WHERE order_id = '" . (int)$order_id . "' LIMIT 1");
        return $query->row;
    }

	public function getBatch($batch_id) {
		return $this->db->query("SELECT * FROM `" . DB_PREFIX . "warehouse_order_batch` WHERE warehouse_order_batch_id = '" . (int)$batch_id . "'")->row;
	}

	public function getBatches($data) {
		$grouped = array();

		$this->load->model('user/user');
		
		$admin_id = $this->user->getId();
		$admin = $this->model_user_user->getUser($admin_id);

		// Orders
		$orders = $this->getWarehouseOrders($admin['warehouse_id'], $this->statusProcessing(), $data);
		
		// Orders by batch
		foreach ($orders as $warehouse_order) {
			$batchId = $warehouse_order["warehouse_order_batch_id"];

			$added_by = $this->model_user_user->getUser($warehouse_order['added_by']);

			if (!isset($grouped[$batchId])) {
				$grouped[$batchId] = [
					'warehouse_order_batch_id' => $batchId,
					'warehouse_order_batch_name' => $warehouse_order['warehouse_order_batch_name'],
					'picklist_id' => $warehouse_order['picklist_id'],
					'date_added' => $warehouse_order['date_added'],
					'delivery_date' => $warehouse_order['delivery_date'],
					'revert_order' => $warehouse_order['revert_order'],
					'added_by' => $added_by['firstname'] . ' ' . $added_by['lastname'],
					'warehouse_orders' => []
				];
			}
			
			$grouped[$batchId]['warehouse_orders'][] = [
				'warehouse_order_id' => $warehouse_order['warehouse_order_id'],
				'order_id' => $warehouse_order['order_id'],
				'date_added' => $warehouse_order['date_added'],
				'products' => $warehouse_order['products'],
				'shipping_firstname' => $warehouse_order['shipping_firstname'],
				'shipping_lastname' => $warehouse_order['shipping_lastname'],
				'delivery_date' => $warehouse_order['delivery_date'],
				'revert_order' => $warehouse_order['revert_order'],
			];
		}

		// Sort by batch id
		usort($grouped, function($a, $b) {
			return $b['warehouse_order_batch_id'] - $a['warehouse_order_batch_id'];
		});

		return $grouped;
	}

	public function getOverdueOrders($filter=array()) {
		$this->load->model('user/user');
		$admin = $this->model_user_user->getUser($this->user->getId());

		$and = '';

		// Filter
		if (isset($filter['customer']) && $filter['customer'] != '') {
			$and .= " AND o.shipping_firstname LIKE '%" . $this->db->escape($filter['customer']) . "%' OR o.shipping_lastname LIKE '%" . $filter['customer'] . "%'";
		}
		if (isset($filter['order_id']) && $filter['order_id'] != '') {
			$and .= " AND o.order_id LIKE '%" . (int)$filter['order_id'] . "%'";
		}	
		if (isset($filter['delivery_date']) && $filter['delivery_date'] != '') {
			$date = DateTime::createFromFormat('m/d/Y', $filter['delivery_date']);
			$delivery_date = $date->format('Y-m-d');
			$and .= " AND o.delivery_date = '" . $delivery_date . "'";
		}

		// Pagination
		$page = isset($filter['page']) ? (int)$filter['page'] : 1; 
		$limit = isset($filter['limit']) ? (int)$filter['limit'] : 10;
		$start = ($page - 1) * $limit;
		
		$order_by = " ORDER BY o.delivery_date ASC";
		$order_by .= " LIMIT $start, $limit";
		
		// Warehouse order
		$orders = $this->db->query("
			SELECT wo.*, o.*
			FROM " . DB_PREFIX . "warehouse_order wo
			LEFT JOIN " . DB_PREFIX . "order o ON o.order_id = wo.order_id
			WHERE wo.warehouse_id = '" . (int)$admin['warehouse_id'] . "' 
			AND wo.order_status_id = '" . (int)self::STATUS_NEW . "' 
			AND o.order_status_id = '" . (int)$this->config->get('config_order_status_confirm') . "'
			AND wo.visible_datetime < NOW()
			AND DATE(o.delivery_date) < CURDATE()
			$and
			$order_by
		")->rows;

		$results = array();
		foreach ($orders as $order) {
			$data = array();
			$data['warehouse_order_id'] = $order['warehouse_order_id'];
			$data['order_id'] = $order['order_id'];
			$data['shipping_firstname'] = $order['shipping_firstname'];
			$data['shipping_lastname'] = $order['shipping_lastname'];
			$data['order_status_id'] = $order['order_status_id'];
			$data['order_status'] = $this->statusName($order['order_status_id']);
			$data['delivery_date'] = date('d/m/Y', strtotime($order['delivery_date']));

			// Order products
			$data['products'] = $this->getOrderProducts($order['order_id'], $admin['warehouse_id']);

			$results[] = $data;
		}
		
		return $results;
	}

	public function getRevertOrders($warehouse_id=null, $data=array()) {
		$this->load->model('user/user');
		$admin = $this->model_user_user->getUser($this->user->getId());

		$and = '';
		if (isset($warehouse_id)) {
			$and .= " AND op.warehouse_id = '" . (int)$warehouse_id . "'";
		}

		$order_status_id = [
			$this->config->get('config_order_status_processed'),
			$this->config->get('config_order_status_processing'),
			$this->config->get('config_order_status_confirm'),
		];

		// Filter
		if (isset($data['customer']) && $data['customer'] != '') {
			$and .= " AND o.shipping_firstname LIKE '%" . $this->db->escape($data['customer']) . "%' OR o.shipping_lastname LIKE '%" . $data['customer'] . "%'";
		}
		if (isset($data['order_id']) && $data['order_id'] != '') {
			$and .= " AND o.order_id LIKE '%" . (int)$data['order_id'] . "%'";
		}	
		if (isset($data['delivery_date']) && $data['delivery_date'] != '') {
			$date = DateTime::createFromFormat('m/d/Y', $data['delivery_date']);
			$delivery_date = $date->format('Y-m-d');
			$and .= " AND o.delivery_date = '" . $delivery_date . "'";
		}	

		// Warehouse order
		$orders = $this->db->query("
			SELECT *, wo.order_status_id
			FROM " . DB_PREFIX . "warehouse_order wo
			LEFT JOIN " . DB_PREFIX . "order_product op ON op.order_id = wo.order_id
			LEFT JOIN " . DB_PREFIX . "order o ON o.order_id = wo.order_id
			WHERE op.revert_order = '1'
			AND o.order_status_id IN (" . implode(',', $order_status_id) . ")
			$and
			ORDER BY o.delivery_date ASC
		")->rows;

		$results = array();
		foreach ($orders as $order) {
			$data = array();
			$data['warehouse_order_id'] = $order['warehouse_order_id'];
			$data['order_id'] = $order['order_id'];
			$data['shipping_firstname'] = $order['shipping_firstname'];
			$data['shipping_lastname'] = $order['shipping_lastname'];
			$data['order_status_id'] = $order['order_status_id'];
			$data['order_status'] = $this->statusName($order['order_status_id']);
			$delivery_date = new DateTime($order['delivery_date']);
			$data['delivery_date'] = $delivery_date->format('d/m/Y');
			$data['revert_order'] = 1;

			// Order products
			$and = " AND op.revert_order = '1'";
			$data['products'] = $this->getOrderProducts($order['order_id'], $admin['warehouse_id'], $and);

			$results[] = $data;
		}

		$data = [
			'orders' => $results,
			'total' => count($orders),
		];
		
		return $data;
	}

	public function createWarehouseOrderBatch($data) {
		// Batch naming
		$query = $this->db->query("SELECT COALESCE(MAX(warehouse_order_batch_id), 0) AS latest_id FROM " . DB_PREFIX . "warehouse_order_batch");
		$id = (int)$query->row['latest_id'] + 1;
		
		// PIC
		if (isset($data['pic'])) {
			$batch_name = sprintf("%s-%s-%s", date('Y'), $id, $data['pic']);
		} else {
			$batch_name = sprintf("%s-%s", date('Y'), $id);
		}

		// Create batch
		$this->db->query("INSERT INTO " . DB_PREFIX . "warehouse_order_batch SET warehouse_order_batch_name = '" . $batch_name . "', date_added = NOW(), added_by = '" . $this->user->getId() . "'");
		$batch_id =  $this->db->getLastId();

		// Warehouse order history
		$this->load->model('extension/module/warehouse_order_history');
		foreach ($data['warehouse_order_ids'] as $warehouse_order_id) {
			$warehouse_order = $this->getWarehouseOrder($warehouse_order_id);
			$this->model_extension_module_warehouse_order_history->addWarehouseOrderHistory($warehouse_order, self::STATUS_PROCESSING, false);
		}
		
		// Update warehouse_order
		$this->db->query("
			UPDATE " . DB_PREFIX . "warehouse_order
			SET 
				warehouse_order_batch_id = '" . (int)$batch_id . "',
				order_status_id = '" . (int)self::STATUS_PROCESSING . "'
			WHERE warehouse_order_id IN (" . implode(',', $data['warehouse_order_ids']) . ")
		");

		// Update main order
		foreach ($data['order_ids'] as $order_id) {
			$this->load->model('extension/module/dc_order');
			$this->model_extension_module_dc_order->updateOrderStatus($order_id, $this->config->get('config_order_status_processing'));
		}

		return $batch_id;
	}

	public function updateWeights($data) {
		$partial_weights = serialize(array_map('floatval', $data['partial_weights']));
		$weight = array_sum($data['partial_weights']);
		$this->db->query("UPDATE " . DB_PREFIX . "order_product SET partial_weights = '" . $this->db->escape($partial_weights) . "', weight = '" . $this->db->escape($weight) . "' WHERE order_product_id = '" . (int)$data['order_product_id'] . "'");
		
		$product = $this->db->query("SELECT * FROM " . DB_PREFIX . "order_product WHERE order_product_id = '" . (int)$data['order_product_id'] . "'")->row;
		return $product;
	}

	public function deleteWarehouseOrder($warehouse_order_id) {
		$this->db->query("DELETE FROM " . DB_PREFIX . "warehouse_order WHERE warehouse_order_id = " . (int)$warehouse_order_id);
	}

	public function getWarehouseOrderBatch($warehouse_order_batch_id) {
		$query = $this->db->query("SELECT * FROM `" . DB_PREFIX . "warehouse_order_batch` WHERE warehouse_order_batch_id = '" . (int)$warehouse_order_batch_id . "'");
		return $query->row;
	}

	public function canRevert($date_completed=null) {
		if (!$date_completed) return false;
		
		$now = new DateTime();
		$completed = new DateTime($date_completed);
		$interval = $now->diff($completed);

		return $interval->days == 0 && $interval->h == 0 && $interval->i <= $this->config->get('config_order_revert_window');
	}

	public function getWarehouseOrdersByBatch($warehouse_order_batch_id) {
		$query = $this->db->query("
			SELECT wo.*, o.delivery_date, o.shipping_firstname, o.shipping_lastname
			FROM " . DB_PREFIX . "warehouse_order wo 
			LEFT JOIN  " . DB_PREFIX . "order o ON wo.order_id = o.order_id
			WHERE wo.warehouse_order_batch_id = '" . (int)$warehouse_order_batch_id . "'
			AND wo.order_status_id = '" . (int)$this->statusProcessing() . "'
		");

		foreach ($query->rows as &$result) {
			// Date format
			$date = new DateTime($result['delivery_date']);
			$result['delivery_date'] = $date->format('d/m/Y');
		}

		return $query->rows;
	}

	
	public function getTotalWarehouseOrder($status_id) {
        $this->load->model('user/user');
        $this->load->model('extension/module/warehouse_order');

        $admin = $this->model_user_user->getUser($this->user->getId());
		
		$sql = "
			SELECT COUNT(*) as total
			FROM " . DB_PREFIX . "warehouse_order wo
			LEFT JOIN " . DB_PREFIX . "order o ON o.order_id = wo.order_id
			LEFT JOIN " . DB_PREFIX . "warehouse_order_batch wob ON wo.warehouse_order_batch_id = wob.warehouse_order_batch_id
			WHERE wo.warehouse_id = '" . (int)$admin['warehouse_id'] . "' 
			AND wo.order_status_id = '" . (int)$status_id . "' 
			AND wo.visible_datetime < NOW()
		";

		// New - today/advance orders
		if ($status_id == $this->statusNew()) {
			$today_order_query = $sql . " AND (DATE(o.delivery_date) = CURRENT_DATE() OR DATE(o.delivery_date) = CURRENT_DATE() + INTERVAL 1 DAY)";
			$advance_order_query = $sql . " AND DATE(o.delivery_date) > CURRENT_DATE()";
			return [
				'today' => $this->db->query($today_order_query)->row['total'],
				'advance' => $this->db->query($advance_order_query)->row['total'],
			];

		} else {
			return $this->db->query($sql)->row['total'];
		}
	}

	public function getTotalOverdueOrders() {
		$this->load->model('user/user');
		$admin = $this->model_user_user->getUser($this->user->getId());

		$result = $this->db->query("
			SELECT COUNT(*) as total
			FROM " . DB_PREFIX . "warehouse_order wo
			LEFT JOIN " . DB_PREFIX . "order o ON o.order_id = wo.order_id
			WHERE wo.warehouse_id = '" . (int)$admin['warehouse_id'] . "' 
			AND wo.order_status_id = '" . (int)self::STATUS_NEW . "' 
			AND o.order_status_id = '" . (int)$this->config->get('config_order_status_confirm') . "'
			AND wo.visible_datetime < NOW()
			AND DATE(o.delivery_date) < CURDATE()
		");

		return $result->row['total'];
	}

	public function hasCompletedAll($order_id) {
		$query = $this->db->query("SELECT COUNT(*) AS total FROM " . DB_PREFIX . "warehouse_order WHERE order_id = '" . (int)$order_id . "' AND order_status_id != " . (int)self::STATUS_COMPLETED);
		return $query->row['total'] == 0;
	}

	public function revert($warehouse_order_id, $order_id) {
		$this->load->model('extension/module/warehouse_order_history');
		$warehouse_order = $this->getWarehouseOrder($warehouse_order_id);
		$this->model_extension_module_warehouse_order_history->addWarehouseOrderHistory($warehouse_order, self::STATUS_PROCESSING);

		// Warehouse Order
		$this->db->query("UPDATE " . DB_PREFIX . "warehouse_order SET order_status_id = '" . (int)self::STATUS_PROCESSING . "' WHERE warehouse_order_id = '" . (int)$warehouse_order_id . "'");
		// Order
		$this->load->model('extension/module/dc_order');
		$this->model_extension_module_dc_order->updateOrderStatus($order_id, $this->config->get('config_order_status_processing'));
	}
		
	public function completeOrder($warehouse_order) {
		$this->load->model('extension/module/warehouse_order_history');

		$order = $this->getWarehouseOrder($warehouse_order['warehouse_order_id']);
		if (!$order) {
			return 'Order not found';
		}

		$this->model_extension_module_warehouse_order_history->addWarehouseOrderHistory($warehouse_order, self::STATUS_COMPLETED);
		
		// Warehouse Order
		$this->db->query("UPDATE " . DB_PREFIX . "warehouse_order SET order_status_id = '" . (int)self::STATUS_COMPLETED . "', date_completed = NOW() WHERE warehouse_order_id = '" . $warehouse_order['warehouse_order_id'] . "'");

		// Products 
		foreach ($warehouse_order['products'] as $product) {
			// Out of stock
			if ($product['warehouse_qty'] == 0) {
				$product_status_id = $this->productStatusOutOfStock();
			} else {
				$product_status_id = 0;
			}
			// Partial Weights
			if (count($product['partial_weights']) == 1) {
				$pw_sql = "partial_weights = NULL";
			} else {
				$pw_sql = "partial_weights = '" . serialize($product['partial_weights']) . "'";
			}
			// Weight
			$weight = array_sum($product['partial_weights']);
			// Update
			$this->db->query("
				UPDATE " . DB_PREFIX . "order_product 
				SET 
					warehouse_qty = '" . $product['warehouse_qty'] . "',
					product_status_id = '" . (int)$product_status_id . "',
					weight = '" . $weight . "',
					revert_order = '0',
					$pw_sql
				WHERE
					order_product_id = '" . $product['order_product_id'] . "'
			");
		}
		
		// Update main order if all items are packed
		$order_id = $warehouse_order['order_id'];
		if ($this->hasCompletedAll($order_id)) {
			$this->load->model('extension/module/dc_order');
			$this->model_extension_module_dc_order->updateOrderStatus($order_id, $this->config->get('config_order_status_processed'));
		}
	}

	public function statusNew() {
		return self::STATUS_NEW;
	}

	public function statusProcessing() {
		return self::STATUS_PROCESSING;
	}

	public function statusCompleted() {
		return self::STATUS_COMPLETED;
	}

	public function productStatusOutOfStock() {
		return self::PRODUCT_STATUS_OUT_OF_STOCK;
	}

	public function statusName($order_status_id) {
		$statuses = [
			self::STATUS_NEW => 'New',
			self::STATUS_PROCESSING => 'Processing',
			self::STATUS_COMPLETED => 'Completed',
		];

		return $statuses[$order_status_id];
	}

	private function isRevertOrder($order) {
		foreach ($order['products'] as $product) {
			if ($product['revert_order'] == 1) {
				return true;
			}
		}
		return false;
	}
}