<?php
class ModelLocationDriverAdmin extends Model {
    const PERIOD_WEEK = 'week';
    const PERIOD_MONTH = 'month';
    const PERIOD_CUSTOM = 'custom';

    public function getAvailableOrders($filter_data) {
        // Delivery date
        if (isset($filter_data['filter_delivery_date'])) {
            $delivery_date = $filter_data['filter_delivery_date'];
        } else {
            $delivery_date = date('Y-m-d');
        }

        $and = "
            AND o.driver_id IS NULL 
            AND DATE(o.delivery_date) = '" . $this->db->escape($delivery_date) . "'
        ";
        $order_by = "ORDER BY o.order_id DESC";
        $sql = $this->getMainQuery($and, $order_by);

        $results = $this->db->query($sql)->rows;

        $orders = array();
        foreach ($results as $order) {
            $result = $this->formatOrder($order);
            $orders[] = $result;
        }

        return $orders;
    }

    public function getDriverOrders($filter_data) {
        $this->load->model('user/user');
        $driver_rows = $this->model_user_user->getUsersByUserGroup($this->config->get('config_user_group_driver'));
        usort($driver_rows, function($a, $b) {
            return strcmp($a['firstname'], $b['firstname']);
        });

        // Delivery date
        if (isset($filter_data['filter_delivery_date'])) {
            $delivery_date = $filter_data['filter_delivery_date'];
        } else {
            $delivery_date = date('Y-m-d');
        }

        // Drivers
        $drivers = array();
        foreach ($driver_rows as $driver) {
            $driver_id = $driver['user_id'];    
            
            $and = "
                AND (o.driver_id = '" . (int)$driver_id . "' OR FIND_IN_SET('" . $driver_id . "', o.extra_driver_ids))
                AND DATE(o.delivery_date) = '" . $this->db->escape($delivery_date) . "'
            ";
            $order_by = "ORDER BY dz.name ASC, CONCAT(o.shipping_firstname, o.shipping_lastname) ASC, o.order_id DESC";
            $sql = $this->getMainQuery($and, $order_by);

            // Orders
            $orders = $this->db->query($sql)->rows;
            foreach ($orders as &$order) {
                $order = $this->formatOrder($order, $driver_id);
            }

            $result = $this->formatDriver($driver);
            $result['orders'] = $orders;
            $drivers[] = $result;
        }

        // Move driver with no orders to bottom
        usort($drivers, function($a, $b) {
            return count($a['orders']) == 0;
        });

        return $drivers;
    }

    public function getDriverOrder($driver_id, $filter_data) {       
        $this->load->model('user/user');
        $driver = $this->model_user_user->getUser($driver_id);

        if (empty($driver)) return array();

        if (isset($filter_data['filter_delivery_date'])) {
            $delivery_date = $filter_data['filter_delivery_date'];
        } else {
            $delivery_date = date('Y-m-d');
        }

        $and = "
            AND (o.driver_id = '" . (int)$driver_id . "' OR FIND_IN_SET('" . $driver_id . "', o.extra_driver_ids))
            AND DATE(o.delivery_date) = '" . $this->db->escape($delivery_date) . "'
        ";
        $order_by = "ORDER BY dz.name ASC, o.order_id DESC";
        $sql = $this->getMainQuery($and, $order_by);
        
        // Orders
        $orders = $this->db->query($sql)->rows;
        foreach ($orders as &$order) {
            $order = $this->formatOrder($order, $driver_id);
        }


        $driver = $this->formatDriver($driver);
        $driver['orders'] = $orders;
        return $driver;
    }

    public function getOrderSummary($filter_data) {
        $limit = isset($filter_data['limit']) ? (int)$filter_data['limit'] : 10;
        $start = isset($filter_data['start']) ? (int)$filter_data['start'] : 0;
        
        // Get the earliest delivery date
        $sql = "SELECT MIN(DATE(delivery_date)) as earliest_date FROM " . DB_PREFIX . "order";
        $query = $this->db->query($sql);
        $earliest_date = $query->row['earliest_date'];

        // Calculate the number of days from the earliest date to today
        $earliest_date_time = new DateTime($earliest_date);
        $today_date_time = new DateTime();
        $interval = $earliest_date_time->diff($today_date_time);
        $total_days = $interval->days;
        
        // Dates
        $dates = [];
        if (isset($filter_data['filter_delivery_date']) && $filter_data['filter_delivery_date'] != '') {
            $dates[] = $filter_data['filter_delivery_date'];
        } else {
            for ($i = 0; $i < $limit; $i++) {
                $date = date('Y-m-d', strtotime('-' . ($start + $i) . ' days', strtotime('tomorrow')));
                if ($date < $earliest_date) {
                    break;
                }
                $dates[] = $date;
            }
        }
        
        $summaries = array();
        // Summary
        foreach ($dates as $date) {
            $result['delivery_date'] = date('d/m/Y', strtotime($date));
            $result['is_today'] = $date == date('Y-m-d');
            $result['total_orders'] = $this->getTotalOrders($date);
            $result['total_delivered'] = $this->getTotalDelivered($date);
            $result['total_without_driver'] = $this->getTotalWithoutDriver($date);
            $result['action'] = $this->url->link('location/driver_admin/assign', 'user_token=' . $this->session->data['user_token'] . '&filter_delivery_date=' . urlencode($date), true);
            $summaries[] = $result;
        }

        $data['total_days'] = $total_days;
        $data['summaries'] = $summaries;

        return $data;
    }

    public function getTotalOrders($date) {
        $sql = "SELECT COUNT(*) as total FROM " . DB_PREFIX . "order WHERE DATE(`delivery_date`) = '" . $this->db->escape($date) . "'";
        $query = $this->db->query($sql);
        return $query->row['total'];
    }

    public function getTotalDelivered($date) {
        $shipped_status = $this->config->get('config_order_status_shipped');
        $sql = "SELECT COUNT(*) as total FROM " . DB_PREFIX . "order WHERE DATE(`delivery_date`) = '" . $this->db->escape($date) . "' AND order_status_id = '" . (int)$shipped_status . "'";
        $query = $this->db->query($sql);
        return $query->row['total'];
    }

    public function getTotalWithoutDriver($date) {
        $sql = "SELECT COUNT(*) as total FROM " . DB_PREFIX . "order WHERE DATE(`delivery_date`) = '" . $this->db->escape($date) . "' AND driver_id IS NULL";
        $query = $this->db->query($sql);
        return $query->row['total'];
    }

    public function getTotalInProgress($date) {
        $shipped_status = $this->config->get('config_order_status_shipped');
        $sql = "SELECT COUNT(*) as total FROM " . DB_PREFIX . "order o 
            WHERE DATE(o.delivery_date) = '" . $this->db->escape($date) . "' 
            AND o.order_status_id != '" . (int)$shipped_status . "' 
            AND EXISTS (
                SELECT 1 FROM " . DB_PREFIX . "order_pod op 
                WHERE op.order_id = o.order_id
            )";
        $query = $this->db->query($sql);
        return $query->row['total'];
    }

    public function getAvailableIntervals() {
        return array(
            ['label' => 'This Week', 'value' => self::PERIOD_WEEK],
            ['label' => 'This Month', 'value' => self::PERIOD_MONTH],
            ['label' => 'Custom', 'value' => self::PERIOD_CUSTOM],
        );
    }

    private function getMainQuery($and='', $order='') {
        $status = array(
            $this->config->get('config_order_status_processing'),
            $this->config->get('config_order_status_processed'),
            $this->config->get('config_order_status_ready'),
            $this->config->get('config_order_status_ac_doc'),
        );

        return "
            SELECT *, CONCAT(u.firstname, ' ', u.lastname) AS driver, o.driver_id, os.name as order_status, o.delivery_zone_id, dz.name as delivery_zone
            FROM " . DB_PREFIX . "order o
            LEFT JOIN " . DB_PREFIX . "delivery_zone dz on dz.delivery_zone_id = o.delivery_zone_id
            LEFT JOIN " . DB_PREFIX . "user u on u.user_id = o.driver_id
            LEFT JOIN " . DB_PREFIX . "order_status os on os.order_status_id = o.order_status_id
            WHERE o.order_status_id IN (" . implode(',', $status) . ")
            $and
            $order
        ";
    }

    private function formatDriver($driver) {
        $result = array();
        $result['user_id'] = $driver['user_id'];
        $result['name'] = $driver['firstname'] . ' ' . $driver['lastname'];

        return $result;
    }

    private function formatOrder($order, $driver_id=null) {
        $result = array();
        $extra_driver_ids = explode(',', $order['extra_driver_ids']);
        $result['order_id'] = $order['order_id'];
        $result['customer_id'] = $order['customer_id'];
        $result['delivery_zone_id'] = $order['delivery_zone_id'];
        $result['delivery_zone'] = $order['delivery_zone'];
        $result['driver_id'] = $order['driver_id'];
        $result['delivery_date'] = $order['delivery_date'];
        $result['shipping_firstname'] = $order['shipping_firstname'];
        $result['shipping_lastname'] = $order['shipping_lastname'];
        $result['driver'] = $order['driver'];
        $result['order_status'] = $order['order_status'];
        $result['can_duplicate'] = true;
        $result['can_set_main'] = in_array($driver_id, $extra_driver_ids);
        $result['has_helper'] = $order['extra_driver_ids'] != null;

        if (isset($driver_id)) {
            $result['is_main'] = $order['driver_id'] == $driver_id;
            if ($result['has_helper']) {
                // first driver
                if ($order['driver_id'] == $driver_id) {
                    $result['is_last'] = true;
                    $result['index'] = count($extra_driver_ids);
                } else {
                    $extra_driver_ids = explode(',', $order['extra_driver_ids']);
                    $index = array_search($driver_id, $extra_driver_ids);
                    $result['index'] = $index + 1;
                }
            }
        }


        return $result;
    }


}
