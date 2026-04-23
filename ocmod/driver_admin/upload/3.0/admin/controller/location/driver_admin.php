<?php
class ControllerLocationDriverAdmin extends Controller {
    public function __construct($registry) {
        parent::__construct($registry);
        $this->load->model('location/driver_admin');
        $this->load->model('location/delivery_zone');
        $this->load->language('location/driver_admin');
    }

    public function index() {
		$this->document->setTitle($this->language->get('heading_title'));

        $data['heading_title'] = $this->language->get('heading_title');

        if (isset($this->request->get['filter_delivery_date'])) {
			$filter_delivery_date = $this->request->get['filter_delivery_date'];
		} else {
			$filter_delivery_date = '';
		}

		if (isset($this->request->get['order'])) {
			$order = $this->request->get['order'];
		} else {
			$order = 'DESC';
		}

		if (isset($this->request->get['sort'])) {
			$sort = $this->request->get['sort'];
		} else {
			$sort = 'delivery_date';
		}

		if (isset($this->request->get['page'])) {
			$page = (int)$this->request->get['page'];
		} else {
			$page = 1;
		}

        $url = '';

		if (isset($this->request->get['filter_delivery_date'])) {
			$url .= '&filter_delivery_date=' . urlencode(html_entity_decode($this->request->get['filter_delivery_date'], ENT_QUOTES, 'UTF-8'));
		}

		if (isset($this->request->get['sort'])) {
			$url .= '&sort=' . $this->request->get['sort'];
		}

		if (isset($this->request->get['order'])) {
			$url .= '&order=' . $this->request->get['order'];
		}

        $data['breadcrumbs'] = array();

        $data['breadcrumbs'][] = array(
            'text' => $this->language->get('text_home'),
            'href' => $this->url->link('common/dashboard', 'user_token=' . $this->session->data['user_token'], true)
        );

        $data['breadcrumbs'][] = array(
            'text' => $this->language->get('heading_title'),
            'href' => $this->url->link('location/driver_admin', 'user_token=' . $this->session->data['user_token'] . $url, true)
        );

        $limit = $this->config->get('config_limit_admin') ?? 10;

        $filter_data = array(
			'filter_delivery_date' => $filter_delivery_date,
			'sort'              => $sort,
			'order'             => $order,
			'start'             => ($page - 1) * $limit,
			'limit'             => $limit
		);

        // Summary
        $summary = $this->model_location_driver_admin->getOrderSummary($filter_data);
        $data['summaries'] = $summary['summaries'];

        // Pagination
        $pagination = new Pagination();
		$pagination->total = $summary['total_days'];
		$pagination->page = $page;
		$pagination->limit = $limit;
		$pagination->url = $this->url->link('location/driver_admin', 'user_token=' . $this->session->data['user_token'] . $url . '&page={page}', true);
		
        $data['pagination'] = $pagination->render();

        $data['sort'] = $sort;
		$data['order'] = $order;
        
        $data['filter_delivery_date'] = $filter_delivery_date != '' ? date('Y-m-d', strtotime($filter_delivery_date)) : '';

        $data['base_url'] = HTTPS_SERVER . 'view/template';
        $data['user_token'] = $this->session->data['user_token'];
        $data['header'] = $this->load->controller('common/header');
        $data['column_left'] = $this->load->controller('common/column_left');
        $data['footer'] = $this->load->controller('common/footer');

        $this->response->setOutput($this->load->view('location/driver_admin', $data));
	}

	public function assign() {
		$this->document->setTitle($this->language->get('heading_title'));

        $data['heading_title'] = $this->language->get('heading_title');

        $data['breadcrumbs'] = array();

        $data['breadcrumbs'][] = array(
            'text' => $this->language->get('text_home'),
            'href' => $this->url->link('common/dashboard', 'user_token=' . $this->session->data['user_token'], true)
        );

        $data['breadcrumbs'][] = array(
            'text' => $this->language->get('heading_title'),
            'href' => $this->url->link('location/driver', 'user_token=' . $this->session->data['user_token'], true)
        );

        $data['breadcrumbs'][] = array(
            'text' => $this->language->get('text_assign'),
            'href' => $this->url->link('location/driver/assign', 'user_token=' . $this->session->data['user_token'], true)
        );
        
        $filter_data = $this->request->get;

        // Orders
        $data['available_orders'] = json_encode($this->model_location_driver_admin->getAvailableOrders($filter_data));
        $data['driver_orders'] = json_encode($this->model_location_driver_admin->getDriverOrders($filter_data));
        $data['delivery_zones'] = json_encode($this->model_location_delivery_zone->getDeliveryZones());

        $data['filter_delivery_date'] = $this->request->get['filter_delivery_date'];

        $data['action'] = $this->url->link('location/driver_admin/change_driver', 'user_token=' . $this->session->data['user_token'] . '&filter_delivery_date=' . $data['filter_delivery_date'], true);

        $data['base_url'] = HTTPS_SERVER . 'view/template';
        $data['user_token'] = $this->session->data['user_token'];

        $data['header'] = $this->load->controller('common/header');
        $data['column_left'] = $this->load->controller('common/column_left');
        $data['footer'] = $this->load->controller('common/footer');

        $this->response->setOutput($this->load->view('location/driver_admin_assign', $data));
	}
    
    public function change_driver() {
        // Data
        $saved_data = $this->request->post['saved_data'];
        $delivery_date = $this->request->get['filter_delivery_date'];

        foreach ($saved_data as $data) {
            $from_driver_id = $data['from_driver_id'];
            $to_driver_id = $data['to_driver_id'];
            $order_id = $data['order_id'];

            // Get order
            $order_info = $this->db->query("SELECT * FROM `" . DB_PREFIX . "order` WHERE order_id = '" . (int)$order_id . "'")->row;
    
            // Order not found
            if (empty($order_info)) {
                $data['error'] = 'Order not found !';
            }
    
            $extra_driver_ids = (array) explode(',', $order_info['extra_driver_ids']);

            // if (in_array($from_driver_id, $extra_driver_ids)) {
            //     $extra_driver_ids = array_diff($extra_driver_ids, [$from_driver_id]);
            // }
            // $extra_driver_ids_query = empty($extra_driver_ids)
            //     ? "NULL"
            //     : "'" . implode(',', $extra_driver_ids) . "'";

            // if (isset($to_driver_id) && $to_driver_id != '') {
            //     $this->db->query("UPDATE `" . DB_PREFIX . "order` SET driver_id = '" . (int)$to_driver_id . "', extra_driver_ids = " . $extra_driver_ids_query . " WHERE order_id = '" . (int)$order_id . "'");
            // } else {
            //     $this->db->query("UPDATE `" . DB_PREFIX . "order` SET driver_id = NULL, delivery_zone_id = NULL, extra_driver_ids = NULL WHERE order_id = '" . (int)$order_id . "'");
            // }
            
            if ($to_driver_id == '') {
                // Move to available space
                $this->db->query("UPDATE `" . DB_PREFIX . "order` SET driver_id = NULL, extra_driver_ids = NULL WHERE order_id = '" . (int)$order_id . "'");
                
            } elseif ($to_driver_id == '') {
                // Directly change driver 
                $this->db->query("UPDATE `" . DB_PREFIX . "order` SET driver_id = '" . (int)$to_driver_id . "' WHERE order_id = '" . (int)$order_id . "'");

            } else {
                $extra_driver_ids = explode(',', $order_info['extra_driver_ids']);
                $from_main_driver = $order_info['driver_id'] == $from_driver_id;
                $from_helper_driver = in_array($from_driver_id, $extra_driver_ids);
                $to_main_driver = $order_info['driver_id'] == $to_driver_id;
                $to_helper_driver = in_array($to_driver_id, $extra_driver_ids);
    
                // From main to helper
                if ($from_main_driver && $to_helper_driver) {
                    $extra_driver_ids = array_diff($extra_driver_ids, [$to_driver_id]);                
                    array_push($extra_driver_ids, $from_driver_id);
                    $this->db->query("UPDATE `" . DB_PREFIX . "order` SET driver_id = '" . (int)$to_driver_id . "', extra_driver_ids = '" . implode(',', $extra_driver_ids) . "' WHERE order_id = '" . (int)$order_id . "'");
    
                // From helper to main
                } else if ($from_helper_driver && $to_main_driver) {
                    $extra_driver_ids = array_diff($extra_driver_ids, [$from_driver_id]);
                    array_push($extra_driver_ids, $to_driver_id);
                    $this->db->query("UPDATE `" . DB_PREFIX . "order` SET driver_id = '" . (int)$from_driver_id . "', extra_driver_ids = '" . implode(',', $extra_driver_ids) . "' WHERE order_id = '" . (int)$order_id . "'");
                
                // Change main driver
                } else if ($from_main_driver && !$to_helper_driver) {
                    $this->db->query("UPDATE `" . DB_PREFIX . "order` SET driver_id = '" . (int)$to_driver_id . "' WHERE order_id = '" . (int)$order_id . "'");
                
                // Change helper driver
                } else if ($from_helper_driver && !$to_main_driver) {
                    $index = array_search($from_driver_id, $extra_driver_ids);
                    $extra_driver_ids[$index] = $to_driver_id;
                    $this->db->query("UPDATE `" . DB_PREFIX . "order` SET extra_driver_ids = '" . implode(',', $extra_driver_ids) . "' WHERE order_id = '" . (int)$order_id . "'");
                
                } else {
                    $this->response->setOutput(json_encode(['error' => 'No condition matched !'])); return;
                }
            }
        }

        $url = '';
        if (isset($delivery_date)) {
            $url .= '&filter_delivery_date=' . $delivery_date;
        }

        $this->response->redirect($this->url->link('location/driver_admin/assign', 'user_token=' . $this->session->data['user_token'] . $url, true));
    }

    public function duplicate_order() {
        // Validation
        $requred = ['order_id', 'driver_id'];
        foreach ($requred as $key) {
            if (!isset($this->request->post[$key])) {
                $this->response->setOutput(json_encode(['error' => $key . ' is required !'])); return;
            }
        }

        // Data
        $order_id = $this->request->post['order_id'];
        $new_driver_id = $this->request->post['driver_id'];
        $filter = $this->request->post['filter'];

        // Get order
        $order_info = $this->db->query("SELECT * FROM `" . DB_PREFIX . "order` WHERE order_id = '" . (int)$order_id . "'")->row;
        $driver_info = $this->db->query("SELECT * FROM `" . DB_PREFIX . "user` WHERE user_id = '" . (int)$new_driver_id . "'")->row;

        // Order not found
        if (empty($order_info)) {
            $this->response->setOutput(json_encode(['error' => 'Order not found !'])); return;
        }

        // Extra driver ids
        if ($order_info['extra_driver_ids'] == null) {
            $extra_driver_ids = $new_driver_id;
        } else {
            $extra_driver_ids = explode(',', $order_info['extra_driver_ids']);
            // Add new driver
            if (!in_array($new_driver_id, $extra_driver_ids)) {
                $extra_driver_ids[] = $new_driver_id;
                $extra_driver_ids = implode(',', $extra_driver_ids);
            // Already added
            } else {
                $this->response->setOutput(json_encode(['error' => 'Driver already added !'])); return;
            }
        }

        $this->db->query("UPDATE `" . DB_PREFIX . "order` SET extra_driver_ids = '" . $extra_driver_ids . "' WHERE order_id = '" . (int)$order_id . "'");
        
        // Filter
        $filter_data = [
            'filter_delivery_date' => $filter['delivery_date']
        ];

        // Update driver's order that has been changed
        $driver_changes = array_merge([$order_info['driver_id']], explode(',', $extra_driver_ids));
        $data['order_changed'] = array();
        foreach ($driver_changes as $user_id) {
            $data['order_changed'][] = $this->model_location_driver_admin->getDriverOrder($user_id, $filter_data);
        }

        $data['success'] = "{$driver_info['firstname']} {$driver_info['lastname']} has been added to Order $order_id !";
        $data['driver_ids'] = array_merge([$order_info['driver_id']], explode(',', $extra_driver_ids));

        $this->response->setOutput(json_encode($data));
    }

    public function set_main() {
        // Validation
        $requred = ['order_id', 'driver_id'];
        foreach ($requred as $key) {
            if (!isset($this->request->post[$key])) {
                $this->response->setOutput(json_encode(['error' => $key . ' is required !'])); return;
            }
        }

        // Data
        $order_id = $this->request->post['order_id'];
        $driver_id = $this->request->post['driver_id'];
        $filter = $this->request->post['filter'];

        // Get order
        $order_info = $this->db->query("SELECT * FROM `" . DB_PREFIX . "order` WHERE order_id = '" . (int)$order_id . "'")->row;
        $driver_info = $this->db->query("SELECT * FROM `" . DB_PREFIX . "user` WHERE user_id = '" . (int)$driver_id . "'")->row;

        // Order not found
        if (empty($order_info)) {
            $this->response->setOutput(json_encode(['error' => 'Order not found !'])); return;
        }

        // Check in extra_driver_ids
        $extra_driver_ids = explode(',', $order_info['extra_driver_ids']);
        if (!in_array($driver_id, $extra_driver_ids)) {
            $this->response->setOutput(json_encode(['error' => 'Driver is not a helper !'])); return;
        }

        // Move main to extra_driver_ids
        $index = array_search($driver_id, $extra_driver_ids);
        $extra_driver_ids[$index] = $order_info['driver_id'];

        // Update order 
        $extra_driver_ids = implode(',', $extra_driver_ids);
        $this->db->query("UPDATE `" . DB_PREFIX . "order` SET driver_id = '" . (int)$driver_id . "', extra_driver_ids = '" . $extra_driver_ids . "' WHERE order_id = '" . (int)$order_id . "'");

        // Filter
        $filter_data = [
            'filter_delivery_date' => $filter['delivery_date']
        ];

        // Update driver's order that has been changed
        $driver_changes = array_merge([$order_info['driver_id']], explode(',', $order_info['extra_driver_ids']));
        $data['order_changed'] = array();
        foreach ($driver_changes as $user_id) {
            $data['order_changed'][] = $this->model_location_driver_admin->getDriverOrder($user_id, $filter_data);
        }

        $data['success'] = "Order {$order_id} driver has set to {$driver_info['firstname']} {$driver_info['lastname']} !";
        
        $this->response->setOutput(json_encode($data));
    }

    public function remove_driver() {
        // Validation
        $requred = ['order_id', 'driver_id'];
        foreach ($requred as $key) {
            if (!isset($this->request->post[$key])) {
                $this->response->setOutput(json_encode(['error' => $key . ' is required !'])); return;
            }
        }

        // Data
        $order_id = $this->request->post['order_id'];
        $driver_id = $this->request->post['driver_id'];
        $filter = $this->request->post['filter'];

        // Get order
        $order_info = $this->db->query("SELECT * FROM `" . DB_PREFIX . "order` WHERE order_id = '" . (int)$order_id . "'")->row;
        $driver_info = $this->db->query("SELECT * FROM `" . DB_PREFIX . "user` WHERE user_id = '" . (int)$driver_id . "'")->row;

        // Order not found
        if (empty($order_info)) {
            $this->response->setOutput(json_encode(['error' => 'Order not found !'])); return;
        }

        $extra_driver_ids = (array) explode(',', $order_info['extra_driver_ids']);
        
        if (in_array($driver_id, $extra_driver_ids)) {
            $extra_driver_ids = array_diff($extra_driver_ids, [$driver_id]);

            $extra_driver_ids_query = empty($extra_driver_ids)
                ? "NULL"
                : "'" . implode(',', $extra_driver_ids) . "'";

            $extra_driver_ids = implode(',', $extra_driver_ids);
            $this->db->query("UPDATE `" . DB_PREFIX . "order` SET extra_driver_ids = $extra_driver_ids_query WHERE order_id = '" . (int)$order_id . "'");
            
            // Filter
            $filter_data = [
                'filter_delivery_date' => $filter['delivery_date']
            ];
            
            // Update driver's order that has been changed
            $driver_changes = array_merge([$order_info['driver_id'], $driver_id], explode(',', $extra_driver_ids));
            $data['order_changed'] = array();
            foreach ($driver_changes as $user_id) {
                $data['order_changed'][] = $this->model_location_driver_admin->getDriverOrder($user_id, $filter_data);
            }

            $data['success'] = "{$driver_info['firstname']} {$driver_info['lastname']} has been removed from Order $order_id !";
        } else {
            $data['error'] = "Driver not found in Order $order_id !";
        }

        $this->response->setOutput(json_encode($data)); return;
    }

    public function autocomplete() {
        $json = array();

        $sql = "SELECT * FROM " . DB_PREFIX . "user WHERE user_group_id = '" . (int)$this->config->get('config_user_group_driver') . "'";                

        if (isset($this->request->get['filter_name']) && $this->request->get['filter_name'] != '') {
            $sql .= " AND CONCAT(firstname, ' ', lastname) LIKE '%" . $this->db->escape($this->request->get['filter_name']) . "%'";
        }

        $results = $this->db->query($sql)->rows;

		foreach ($results as $result) {
            $json[] = array(
                'user_id' => $result['user_id'],
                'name'      => strip_tags(html_entity_decode($result['firstname'] . $result['lastname'], ENT_QUOTES, 'UTF-8'))
            );
        }
        
        $sort_order = array();

        foreach ($json as $key => $value) {
            $sort_order[$key] = $value['name'];
        }

        array_multisort($sort_order, SORT_ASC, $json);

        $this->response->addHeader('Content-Type: application/json');
        $this->response->setOutput(json_encode($json));
    }
}
