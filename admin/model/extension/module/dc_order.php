<?php
class ModelExtensionModuleDcOrder extends Model {
    public function getOrders($order_status_id, $filter, $overdue=false) {        
        $this->load->model('tool/image');
        $this->load->model('sale/order');

        $status = (array) $order_status_id;

        $sql = "
            SELECT o.*, os.name as order_status, do.doc_no, dz.name as delivery_zone
            FROM " . DB_PREFIX . "order o
            LEFT JOIN " . DB_PREFIX . "order_status os on os.order_status_id = o.order_status_id
            LEFT JOIN " . DB_PREFIX . "aflex_autocount_delivery_order do on do.order_id = o.order_id
            LEFT JOIN " . DB_PREFIX . "delivery_zone dz on dz.delivery_zone_id = o.delivery_zone_id
            LEFT JOIN " . DB_PREFIX . "user u on u.user_id = o.driver_id
            WHERE o.order_status_id IN (" . implode(',', $status) . ")
        ";

        // Filter 
        if (isset($filter['customer']) && $filter['customer'] != '') {
            $customer = $this->db->escape($filter['customer']);
            $sql .= "AND (o.shipping_firstname LIKE '%$customer%' OR o.shipping_lastname LIKE '%$customer%') ";
        }
        if (isset($filter['order_id']) && $filter['order_id'] != '') {
            $order_id = (int) $filter['order_id'];
            $sql .= "AND o.order_id = '" . $order_id . "' ";
        }
        if (isset($filter['delivery_date'])) {
            // Overdue orders
            if ($overdue && $filter['delivery_date'] == '') { 
                $sql .= "AND DATE(o.delivery_date) < CURDATE() ";
            } elseif ($filter['delivery_date'] != '') {
                $delivery_date = DateTime::createFromFormat('m/d/Y', $filter['delivery_date'])->format('Y/m/d');
                $sql .= "AND DATE(o.delivery_date) = '" . $delivery_date . "' ";
            }
        }
        if (isset($filter['with_do']) && $filter['with_do'] != '') {
            if ((bool) $filter['with_do']) {
                $sql .= "AND do.doc_no IS NOT NULL ";
            } else {
                $sql .= "AND do.doc_no IS NULL ";
            }
        }
        if (isset($filter['doc_no']) && $filter['doc_no'] != '') {
            $doc_no = $this->db->escape($filter['doc_no']);
            $sql .= "AND do.doc_no LIKE '%$doc_no%' ";
        }
        if (isset($filter['delivery_zone_id']) && $filter['delivery_zone_id'] != '') {
            $delivery_zone_id = (int) $filter['delivery_zone_id'];
            $sql .= "AND o.delivery_zone_id = '$delivery_zone_id' ";
        }
        
        $sql .= 'GROUP BY o.order_id ';

        // Order by
        if (isset($filter['order_by'])) {
            $order_by = $filter['order_by'];
        } else {
            $order_by = 'ORDER BY o.date_modified DESC';
        }
        
        $sql .= $order_by;
        
		// Pagination
        if (isset($filter['page']) && isset($filter['limit'])) {
            $page = (int) $filter['page'];
            $limit = (int) $filter['limit'];
            $start = ($page - 1) * $limit;
            $sql .= " LIMIT $start, $limit";
        }
        
        $orders = $this->db->query($sql)->rows;
        
        $this->load->model('extension/module/warehouse_order');

        foreach ($orders as &$order) {
            // Products
            $products = $this->model_extension_module_warehouse_order->getOrderProducts($order['order_id']);
            
            // Updated by
            $latest_history = $this->model_sale_order->getOrderHistories($order['order_id'], 0, 1)[0];
            if (isset($latest_history['firstname']) || isset($latest_history['lastname'])) {
                $updated_admin = $latest_history['firstname'] . ' ' . $latest_history['lastname'];
                $updated_at = new DateTime($latest_history['date_added']);
                $updated_by = sprintf('%s (%s)', $updated_admin, $updated_at->format('d/m/Y g:i a'));
            } else {
                $updated_by = null;
            }

            $delivery_date = new DateTime($order['delivery_date']);
            $order['delivery_date'] = $delivery_date->format('d/m/Y');
            $order['products'] = $products;
            $order['can_revert'] = $this->canRevert($order['order_id']);
            $order['can_confirm_order'] = $order['order_status_id'] == $this->config->get('config_order_status_processed');
            $order['updated_by'] = $updated_by;
            $order['revert_order'] = $this->isRevertOrder($order);
            
            // Drivers
            $main_driver = $this->db->query("SELECT * FROM " . DB_PREFIX . "user WHERE user_id = '" . (int)$order['driver_id'] . "'");
            if ($main_driver->num_rows) {
                $main_driver = $main_driver->row['firstname'] . ' ' . $main_driver->row['lastname'];
            } else {
                $main_driver = '';
            }

            $extra_driver_ids = array_filter(explode(',', $order['extra_driver_ids']));
            if (count($extra_driver_ids) > 0) {
                $extra_drivers = $this->db->query("SELECT * FROM " . DB_PREFIX . "user WHERE user_id IN (" . implode(',', $extra_driver_ids) . ")")->rows;
                $extra_drivers = array_map(function($driver) {
                    return $driver['firstname'] . ' ' . $driver['lastname'];
                }, $extra_drivers);
                $order['drivers'] = implode(', ', array_merge($extra_drivers, [$main_driver]));
            } 
        }

        return $orders;
    }

    public function getDeliveryZoneOrders($delivery_zone_id, $order_status_id, $filter=array(), $overdue=false) {
        $filter['delivery_zone_id'] = $delivery_zone_id;

        $filter['order_by'] = 'ORDER BY CONCAT(o.shipping_firstname, " ", o.shipping_lastname)';

        $filter['page'] = null;
        $filter['limit'] = null;

        $orders = $this->getOrders($order_status_id, $filter, $overdue);

        // Group by customer
        $group_by_customer = [];
        foreach ($orders as $order) {
            $customer_id = $order['customer_id'];
            if (!isset($group_by_customer[$customer_id])) {
                $group_by_customer[$customer_id] = [];
            }
            $group_by_customer[$customer_id]['shipping_firstname'] = $order['shipping_firstname'];
            $group_by_customer[$customer_id]['shipping_lastname'] = $order['shipping_lastname'];
            $group_by_customer[$customer_id]['customer_id'] = $order['customer_id'];
            $group_by_customer[$customer_id]['orders'][] = $order;
        }

        return array_values($group_by_customer);
    }

    public function getRevertOrders($data=array()) {
        $this->load->model('extension/module/warehouse_order');
        $and = '';

        // Status
		$order_status_id = [
			$this->config->get('config_order_status_processed'),
			$this->config->get('config_order_status_ready'),
			$this->config->get('config_order_status_ac_doc'),
			$this->config->get('config_order_status_shipped'),
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

		// Orders
		$orders = $this->db->query("
            SELECT o.*, os.name as order_status, do.doc_no, dz.name as delivery_zone, CONCAT(u.firstname, ' ', u.lastname) AS driver
            FROM " . DB_PREFIX . "order o
            LEFT JOIN " . DB_PREFIX . "order_status os on os.order_status_id = o.order_status_id
            LEFT JOIN " . DB_PREFIX . "aflex_autocount_delivery_order do on do.order_id = o.order_id
            LEFT JOIN " . DB_PREFIX . "delivery_zone dz on dz.delivery_zone_id = o.delivery_zone_id
            LEFT JOIN " . DB_PREFIX . "user u on u.user_id = o.driver_id
            LEFT JOIN " . DB_PREFIX . "order_product op on op.order_id = o.order_id
            WHERE o.order_status_id IN (" . implode(',', $order_status_id) . ")
            AND op.revert_order = '1'
            ORDER BY o.delivery_date ASC
        ")->rows;

        foreach ($orders as &$order) {
            // Products
            $and = " AND op.revert_order = '1'";
            $products = $this->model_extension_module_warehouse_order->getOrderProducts($order['order_id'], null, $and);
            
            $delivery_date = new DateTime($order['delivery_date']);
            $order['delivery_date'] = $delivery_date->format('d-m-Y');
            $order['products'] = $products;
            $order['can_revert'] = $this->canRevert($order['order_id']);
            $order['can_confirm_order'] = $order['order_status_id'] == $this->config->get('config_order_status_processed');
            $order['revert_order'] = 1;
        }
		
		return $orders;
	}

    public function getZoneWithOrders($overdue=false) {
        $and = '';
        if ($overdue) {
            $and .= "AND DATE(delivery_date) < CURDATE()";
        } else {
            $and .= "AND DATE(delivery_date) = CURDATE()";
        }
        $sql = "SELECT DISTINCT delivery_zone_id FROM " . DB_PREFIX . "order WHERE order_status_id = '" . (int)$this->config->get('config_order_status_processed') . "' $and AND delivery_zone_id IS NOT NULL";
        $results = $this->db->query($sql);

        // Zones
        if ($results->num_rows) {
            $zone_ids = array_column($results->rows, 'delivery_zone_id');
            $delivery_zones = $this->db->query("SELECT * FROM " . DB_PREFIX . "delivery_zone WHERE delivery_zone_id IN (" . implode(',', $zone_ids) . ") ORDER BY sort_order IS NULL, sort_order ASC")->rows;
        } else {
            $delivery_zones = [];
        }
        // Orderw without zones
        // $orders_without_zone = $this->getOrdersWithoutZone($overdue);
        // if (count($orders_without_zone) > 0) {
        //     $delivery_zones[] = [
        //         'delivery_zone_id' => 0,
        //         'name' => 'No Delivery Zone',
        //     ];
        // }
        // Total orders
        foreach ($delivery_zones as &$zone) {
            $total_sql = "SELECT COUNT(*) AS total FROM " . DB_PREFIX . "order o WHERE o.order_status_id = '" . (int)$this->config->get('config_order_status_processed') . "' $and AND o.delivery_zone_id = '" . (int)$zone['delivery_zone_id'] . "'";
            $zone['total'] = $this->db->query($total_sql)->row['total'];
        }

        $data['delivery_zones'] = $delivery_zones;
        return $delivery_zones;
    }

    public function getOrdersWithoutZone($overdue=false, $and='') {
        $this->load->model('extension/module/warehouse_order');

        if ($overdue) {
            $and .= " AND DATE(o.delivery_date) < CURDATE()";
        }
        
        $sql = "SELECT * FROM " . DB_PREFIX . "order WHERE order_status_id = '" . (int)$this->config->get('config_order_status_processed') . "' $and AND (delivery_zone_id IS NULL OR delivery_zone_id = 0) order by delivery_date DESC";
        
        $orders = $this->db->query($sql);

        foreach ($orders as &$order) {
            $order['products'] = $this->model_warehouse_order->getOrderProducts($order['order_id']);
        }

        return $orders;

    }

    public function getTotal($order_status_id) {
        $status = (array) $order_status_id;

        $and = '';

        // Processed, see today orders
        if ($order_status_id == $this->config->get('config_order_status_processed')) {
            $and .= " AND DATE(o.delivery_date) = CURDATE()";
            $and .= " AND o.driver_id IS NOT NULL AND o.driver_id > 0";
            $and .= " AND o.delivery_zone_id IS NOT NULL AND o.delivery_zone_id > 0";
            $and .= " AND o.delivery_zone_id IS NOT NULL";
        }
        
        $sql = "SELECT COUNT(*) AS total 
            FROM " . DB_PREFIX . "order o
            WHERE o.order_status_id IN (" . implode(',', $status) . ")
            $and
        ";

        $query = $this->db->query($sql);
        return $query->row['total'];
    }

    public function getTotalRevert() {
        // Status
		$order_status_id = [
			$this->config->get('config_order_status_processed'),
			$this->config->get('config_order_status_ready'),
			$this->config->get('config_order_status_ac_doc'),
			$this->config->get('config_order_status_shipped'),
		];

        $results = $this->db->query("
            SELECT COUNT(*) AS total
            FROM " . DB_PREFIX . "order o
            LEFT JOIN " . DB_PREFIX . "order_status os on os.order_status_id = o.order_status_id
            LEFT JOIN " . DB_PREFIX . "order_product op on op.order_id = o.order_id
            WHERE o.order_status_id IN (" . implode(',', $order_status_id) . ")
            AND op.revert_order = '1'
            ORDER BY o.delivery_date ASC
        ");

        return $results->row['total'];
    }

    public function getTotalOverdue() {
        $dz_ids = $this->db->query("SELECT delivery_zone_id FROM " . DB_PREFIX . "delivery_zone")->rows;
        $dz_ids = array_column($dz_ids, 'delivery_zone_id');
        
        $sql = "SELECT COUNT(*) AS total FROM " . DB_PREFIX . "order WHERE order_status_id = '" . (int)$this->config->get('config_order_status_processed') . "' AND DATE(delivery_date) < CURDATE() AND delivery_zone_id IN ('" . implode(',', $dz_ids) . "')";
        
        $query = $this->db->query($sql);

        return $query->row['total'];
    }

    public function getTotalAdvance() {
        $statuses = [
            $this->config->get('config_order_status_processing'),
            $this->config->get('config_order_status_processed'),
        ];

        $sql = "SELECT COUNT(*) AS total FROM " . DB_PREFIX . "order 
            WHERE order_status_id IN (" . implode(',', $statuses) . ")
            AND DATE(delivery_date) > CURDATE()";       

        $query = $this->db->query($sql);

        return $query->row['total'];
    }

    public function updateProducts($products) {
        $this->load->model('extension/module/warehouse_order');
        
        $products = (array) $products;
        // Update order_product
        foreach ($products as $product) {
            $pw = (array) $product['partial_weights'];
            if (count($pw) == 0) {
                $pw_sql = 'partial_weights = NULL';
            } else {
				$pw_sql = "partial_weights = '" . serialize(array_map('floatval', $pw)) . "'";
            }
            $weight = array_sum($pw);

            $product_status_id = $product['dc_qty'] == 0 && $weight == 0
                ? $this->model_extension_module_warehouse_order->productStatusOutOfStock()
                : 0;
            $this->db->query("UPDATE " . DB_PREFIX . "order_product SET dc_qty = '" . (int)$product['dc_qty'] . "', weight = '" . $weight . "', checked = '" . (int)$product['checked'] . "', product_status_id = '" . (int)$product_status_id . "', $pw_sql, revert_order = '0' WHERE order_product_id = '" . (int)$product['order_product_id'] . "'");
        }
    }

    public function completeOrders($orders) {
        $status_ready = $this->config->get('config_order_status_ready');

        foreach ($orders as $order) {
            // Update order_product
            $this->updateProducts($order['products']);            
            // Update order status
            $this->updateOrderStatus($order['order_id'], $status_ready);
        }

    }

    public function canRevert($order_id) {
        $this->load->model('sale/order');
        $histories = $this->model_sale_order->getOrderHistories($order_id);

        if (count($histories) == 0) return false;

        $dateAdded = new DateTime($histories[0]['date_added']);
        $now = new DateTime();
        $interval = $now->diff($dateAdded);
        $diffMinutes = ($interval->days * 24 * 60) + ($interval->h * 60) + $interval->i;

        return $diffMinutes <= $this->config->get('config_order_revert_window');
    }

    public function revert($order_id) {
        $status_processed = $this->config->get('config_order_status_processed');
        $this->updateOrderStatus($order_id, $status_processed);
    }

    public function markPickup($order_ids) {
        foreach ($order_ids as $order_id) {
            $this->updateOrderStatus($order_id, $this->config->get('config_order_status_ac_doc'));
        }
    }

    public function changeDriver($order_id, $delivery_zone_id) {
        $this->load->model('location/delivery_zone');
        // Get delivery zone
        $delivery_zone = $this->model_location_delivery_zone->getDeliveryZone($delivery_zone_id);

        // Update order info
        if ($delivery_zone) {
            $this->db->query("UPDATE " . DB_PREFIX . "order SET `delivery_zone_id` = '" . $this->db->escape($delivery_zone['delivery_zone_id']) . "', `driver_id` = '" . $this->db->escape($delivery_zone['user_id']) . "' WHERE order_id = '" . (int)$order_id . "'");
        }
    }

    public function updateOrderStatus($order_id, $order_status_id) {
        $this->db->query("UPDATE " . DB_PREFIX . "order SET order_status_id = '" . (int)$order_status_id . "' WHERE order_id = '" . (int)$order_id . "'");
        $this->db->query("INSERT INTO " . DB_PREFIX . "order_history SET order_id = '" . (int)$order_id . "', order_status_id = '" . (int)$order_status_id . "', notify = '0', comment = '', date_added = NOW(), added_by = '" . (int)$this->user->getId() . "'");
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