<?php
class ModelExtensionModuleDriverOrder extends Model {
    public function getOrders($order_status_id, $filters) {
        $this->load->model('sale/order');
        $this->load->model('tool/image');

        $driver_id = $this->session->data['user_id'];
        $sql = "
            SELECT o.*, dz.name as delivery_zone, CONCAT(u.firstname, '', u.lastname) AS driver, do.doc_no, os.name as order_status
            FROM " . DB_PREFIX . "order o 
            LEFT JOIN " . DB_PREFIX . "user u on u.user_id = o.driver_id
            LEFT JOIN " . DB_PREFIX . "delivery_zone dz on dz.delivery_zone_id = o.delivery_zone_id
            LEFT JOIN " . DB_PREFIX . "aflex_autocount_delivery_order do on do.order_id = o.order_id
            LEFT JOIN " . DB_PREFIX . "order_status os on os.order_status_id = o.order_status_id
            WHERE o.driver_id = '" . (int)$driver_id . "' 
            AND o.order_status_id = '" . (int)$order_status_id . "' 
        ";

        // Filter
        if (isset($filters['doc_no']) && $filters['doc_no'] != '') {
            $sql .= " AND do.doc_no LIKE '%{$filters['doc_no']}%'";
        }
        if (isset($filters['order_id']) && $filters['order_id'] != '') {
            $sql .= " AND o.order_id LIKE '%{$filters['order_id']}%'";
        }
        if (isset($filters['customer']) && $filters['customer'] != '') {
            $sql .= " AND (o.shipping_firstname LIKE '%{$filters['customer']}%' OR o.shipping_lastname LIKE '%{$filters['customer']}%')";
        }

        // Order by
        if ($order_status_id == $this->config->get('config_order_status_ac_doc')) {
            $sql .= ' ORDER BY o.delivery_date ASC';
        } else {
            $sql .= ' ORDER BY o.date_modified DESC';
        }

        // Pagination
		$page = isset($filters['page']) ? (int)$filters['page'] : 1; 
		$limit = isset($filters['limit']) ? (int)$filters['limit'] : 10;
		$start = ($page - 1) * $limit;
		$sql .= " LIMIT $start, $limit"; 

        $orders = $this->db->query($sql)->rows;

        foreach ($orders as &$order) {
            $status_shipped = $this->config->get('config_order_status_shipped');
            
            // For 'shipped'
            if ($order_status_id == $status_shipped) {
                // Delivered On
                $date = $this->db->query("SELECT date_added FROM " . DB_PREFIX . "order_history WHERE order_status_id = '" . (int)$status_shipped . "' ORDER BY order_history_id DESC LIMIT 1")->row['date_added'];
                $delivered_on = new DateTime($date);
                $order['delivered_on'] = $delivered_on->format('d/m/Y g:ia');
            }
            
            // Delivery Date
            $delivery_date = new DateTime($order['delivery_date']);
            $order['delivery_date'] = $delivery_date->format('d/m/Y');

            // Pod
            $order['pods'] = $this->getPods($order['order_id']);
            $order['can_submit'] = $this->user->getId() == $order['driver_id'];
        }            
        
        return $orders;
    }

    public function getTotalOrders($order_status_id) {
        $driver_id = $this->session->data['user_id'];
        $query = $this->db->query("SELECT COUNT(*) AS total FROM `" . DB_PREFIX . "order` WHERE driver_id = '" . (int)$driver_id . "' AND order_status_id = '" . (int)$order_status_id . "'");
        return $query->row['total'];
    }

    public function markShipped($order_id) {
        $this->updateOrderStatus($order_id, $this->config->get('config_order_status_shipped'));
    }

    public function updateOrderStatus($order_id, $order_status_id) {
        $this->db->query("UPDATE " . DB_PREFIX . "order SET order_status_id = '" . (int)$order_status_id . "' WHERE order_id = '" . (int)$order_id . "'");
        $this->db->query("INSERT INTO " . DB_PREFIX . "order_history SET order_id = '" . (int)$order_id . "', order_status_id = '" . (int)$order_status_id . "', notify = '0', comment = '', date_added = NOW(), added_by = '" . (int)$this->user->getId() . "'");
    }

    public function createPod($order_id, $path) {
        $this->db->query("INSERT INTO " . DB_PREFIX . "order_pod SET order_id = '" . (int)$order_id . "', image = '" . $this->db->escape($path) . "'");
        return $this->db->getLastId();
    }

    public function deletePod($order_pod_id) {
        $this->db->query("DELETE FROM " . DB_PREFIX . "order_pod WHERE order_pod_id = '" . (int)$order_pod_id . "'");
    }

    public function getPods($order_id, $format_image = true) {
        $pods = $this->db->query("SELECT * FROM " . DB_PREFIX . "order_pod WHERE order_id = '" . (int)$order_id . "'")->rows;
        
        $results = array();
        foreach ($pods as $pod) {
            $result['order_pod_id'] = $pod['order_pod_id'];
            $result['created_at'] = $pod['created_at'];
            $result['image'] = $pod['image'];
            $result['url'] = $format_image
                ? $this->model_tool_image->resize($pod['image'], 400, 400)
                : $pod['image'];

            $results[] = $result;
        }
        
        return array_values($results);
    }
}