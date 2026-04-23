<?php

class ControllerLocationWarehouse extends Controller {
	
	private $error = array();

	public function index() {
		$this->load->language('location/warehouse');
	
		$this->document->setTitle($this->language->get('heading_title'));
	
		$this->load->model('location/warehouse');
	
		$this->getList();
	}	
	
	public function add() {

		$this->load->language('location/warehouse');

		$this->document->setTitle($this->language->get('heading_title'));
	
		$this->load->model('location/warehouse');
		$this->load->model('localisation/zone');
	
		if (($this->request->server['REQUEST_METHOD'] == 'POST' && $this->validateForm())) {
			
			$this->model_location_warehouse->addWarehouse($this->request->post);
			
			// Set success message and redirect
			$this->session->data['success'] = $this->language->get('text_success');

				$url = '';
	
				if (isset($this->request->get['sort'])) {
					$url .= '&sort=' . $this->request->get['sort'];
				}
	
				if (isset($this->request->get['order'])) {
					$url .= '&order=' . $this->request->get['order'];
				}
	
				if (isset($this->request->get['page'])) {
					$url .= '&page=' . $this->request->get['page'];
				}

				// Extract zone_id from POST data
				$zone_id = isset($this->request->post['zone_id']) ? $this->request->post['zone_id'] : '';
		
				// Get zone name using the zone_id
				$zone_info = $this->model_localisation_zone->getZone($zone_id);
				$zone_name = isset($zone_info['name']) ? $zone_info['name'] : '';
		
				// Construct the address string
				$address = $this->request->post['address_1'] . ', ' .
						(isset($this->request->post['address_2']) ? $this->request->post['address_2'] . ', ' : '') .
						$this->request->post['city'] . ', ' .
						$this->request->post['postcode'] . ', ' .
						$zone_name;
		
				// Prepare data for saving
				$data = array(
				'name'         => $this->request->post['name'],
				'address_1'    => $this->request->post['address_1'],
				'address_2'    => isset($this->request->post['address_2']) ? $this->request->post['address_2'] : '',
				'city'         => $this->request->post['city'],
				'postcode'     => $this->request->post['postcode'],
				'country_id'   => isset($this->request->post['country_id']) ? $this->request->post['country_id'] : '',
				'zone_id'      => $zone_id,
				'zone_name'    => $zone_name,
				'address'      => $address,
			);
	
				$this->response->redirect($this->url->link('location/warehouse', 'user_token=' . $this->session->data['user_token'] . $url, true));
			
		}
	
		$this->getForm();
	}
	
	public function edit() {

		$this->load->language('location/warehouse');
	
		$this->document->setTitle($this->language->get('heading_title'));
	
		$this->load->model('location/warehouse');
		$this->load->model('localisation/zone');
		$this->load->model('localisation/country');
	
		
		if (($this->request->server['REQUEST_METHOD'] == 'POST') && $this->validateForm()) {
						
			// Update the warehouse data
			$this->model_location_warehouse->editWarehouse($this->request->get['warehouse_id'], $this->request->post);
	
			// Set success message and redirect
			$this->session->data['success'] = $this->language->get('text_success');
	
			$url = '';
	
			if (isset($this->request->get['sort'])) {
				$url .= '&sort=' . $this->request->get['sort'];
			}
	
			if (isset($this->request->get['order'])) {
				$url .= '&order=' . $this->request->get['order'];
			}
	
			if (isset($this->request->get['page'])) {
				$url .= '&page=' . $this->request->get['page'];
			}
	
			$this->response->redirect($this->url->link('location/warehouse', 'user_token=' . $this->session->data['user_token'] . $url, true));
			
			}

		$this->getForm();
	}	

	public function delete() {
		$this->load->language('location/warehouse');

		$this->document->setTitle($this->language->get('heading_title'));

		$this->load->model('location/warehouse');

		if (isset($this->request->post['selected']) && $this->validateDelete()) {
			foreach ($this->request->post['selected'] as $warehouse_id) {
				$this->model_location_warehouse->deleteWarehouse($warehouse_id);
			}

			$this->session->data['success'] = $this->language->get('text_success');

			$url = '';

			if (isset($this->request->get['sort'])) {
				$url .= '&sort=' . $this->request->get['sort'];
			}

			if (isset($this->request->get['order'])) {
				$url .= '&order=' . $this->request->get['order'];
			}

			if (isset($this->request->get['page'])) {
				$url .= '&page=' . $this->request->get['page'];
			}

			$this->response->redirect($this->url->link('location/warehouse', 'user_token=' . $this->session->data['user_token'] . $url, true));
		}

		$this->getList();
	}

	protected function getList() {
		if (isset($this->request->get['sort'])) {
			$sort = $this->request->get['sort'];
		} else {
			$sort = 'name';
		}
	
		if (isset($this->request->get['order'])) {
			$order = $this->request->get['order'];
		} else {
			$order = 'ASC';
		}
	
		if (isset($this->request->get['page'])) {
			$page = $this->request->get['page'];
		} else {
			$page = 1;
		}
	
		$url = '';
	
		if (isset($this->request->get['sort'])) {
			$url .= '&sort=' . $this->request->get['sort'];
		}
	
		if (isset($this->request->get['order'])) {
			$url .= '&order=' . $this->request->get['order'];
		}
	
		if (isset($this->request->get['page'])) {
			$url .= '&page=' . $this->request->get['page'];
		}
	
		$data['breadcrumbs'] = array();
	
		$data['breadcrumbs'][] = array(
			'text' => $this->language->get('text_home'),
			'href' => $this->url->link('common/dashboard', 'user_token=' . $this->session->data['user_token'], true)
		);
	
		$data['breadcrumbs'][] = array(
			'text' => $this->language->get('heading_title'),
			'href' => $this->url->link('location/warehouse', 'user_token=' . $this->session->data['user_token'] . $url, true)
		);
	
		$data['add'] = $this->url->link('location/warehouse/add', 'user_token=' . $this->session->data['user_token'] . $url, true);
		$data['delete'] = $this->url->link('location/warehouse/delete', 'user_token=' . $this->session->data['user_token'] . $url, true);

		$data['warehouse'] = array();
	
		$filter_data = array(
			'sort'  => $sort,
			'order' => $order,
			'start' => ($page - 1) * $this->config->get('config_limit_admin'),
			'limit' => $this->config->get('config_limit_admin')
		);

		// Address
		$this->load->model('localisation/country');
    	$this->load->model('localisation/zone');

		// Fetch POST data with defaults if not set
		$zone_id = isset($this->request->post['zone_id']) ? $this->request->post['zone_id'] : '';
		$zone_name = isset($this->request->post['zone_name']) ? $this->request->post['zone_name'] : '';
		$address = isset($this->request->post['address']) ? $this->request->post['address'] : '';

		// Construct the address string
		$address_string = $address . ', ' . $zone_name;
	
		$warehouse_total = $this->model_location_warehouse->getTotalWarehouse();
	
		$results = $this->model_location_warehouse->getWarehouses($filter_data);

		foreach ($results as $result) {
			
			// Fetch country information
			$country_info = $this->model_localisation_country->getCountry(isset($result['country_id']) ? $result['country_id'] : 0);
			
			// Fetch zone information
			$zone_info = isset($result['zone_id']) ? $this->model_localisation_zone->getZone($result['zone_id']) : array();
		
			// Build the address string safely
			$address = '';

			if (isset($result['address_1'])) {
				$address .= $result['address_1'];
			}

			if (isset($result['address_2']) && $result['address_2']) {
				$address .= ', ' . $result['address_2'];
			}

			if (isset($result['postcode'])) {
				$address .= ', ' . $result['postcode'];
			}
			if (isset($result['city'])) {
				$address .= ', ' . $result['city'];
			}
			if (isset($zone_info['name'])) {
				$address .= ', ' . $zone_info['name'];
			}
			if (isset($country_info['name'])) {
				$address .= ', ' . $country_info['name'];
			}
		
			// Prepare data array
			$data['warehouses'][] = array(
				'warehouse_id' => isset($result['warehouse_id']) ? $result['warehouse_id'] : '',
				'name' => isset($result['name']) ? $result['name'] : '',
				'address' => $address, // Concatenated address
				'edit' => $this->url->link('location/warehouse/edit', 'user_token=' . $this->session->data['user_token'] . '&warehouse_id=' . (isset($result['warehouse_id']) ? $result['warehouse_id'] : ''), true)
			);

		}
	
		if (isset($this->error['warning'])) {
			$data['error_warning'] = $this->error['warning'];
		} else {
			$data['error_warning'] = '';
		}
	
		if (isset($this->session->data['success'])) {
			$data['success'] = $this->session->data['success'];
			unset($this->session->data['success']);
		} else {
			$data['success'] = '';
		}
	
		if (isset($this->request->post['selected'])) {
			$data['selected'] = (array)$this->request->post['selected'];
		} else {
			$data['selected'] = array();
		}
	
		$url = '';
	
		if ($order == 'ASC') {
			$url .= '&order=DESC';
		} else {
			$url .= '&order=ASC';
		}
	
		if (isset($this->request->get['page'])) {
			$url .= '&page=' . $this->request->get['page'];
		}
	
		$data['sort_name'] = $this->url->link('location/warehouse', 'user_token=' . $this->session->data['user_token'] . '&sort=name' . $url, true);
		$data['sort_address'] = $this->url->link('location/warehouse', 'user_token=' . $this->session->data['user_token'] . '&sort=address' . $url, true);
	
		$url = '';
	
		if (isset($this->request->get['sort'])) {
			$url .= '&sort=' . $this->request->get['sort'];
		}
	
		if (isset($this->request->get['order'])) {
			$url .= '&order=' . $this->request->get['order'];
		}
	
		$pagination = new Pagination();
		$pagination->total = $warehouse_total;
		$pagination->page = $page;
		$pagination->limit = $this->config->get('config_limit_admin');
		$pagination->url = $this->url->link('location/warehouse', 'user_token=' . $this->session->data['user_token'] . $url . '&page={page}', true);
	
		$data['pagination'] = $pagination->render();
	
		$data['results'] = sprintf($this->language->get('text_pagination'), ($warehouse_total) ? (($page - 1) * $this->config->get('config_limit_admin')) + 1 : 0, ((($page - 1) * $this->config->get('config_limit_admin')) > ($warehouse_total - $this->config->get('config_limit_admin'))) ? $warehouse_total : ((($page - 1) * $this->config->get('config_limit_admin')) + $this->config->get('config_limit_admin')), $warehouse_total, ceil($warehouse_total / $this->config->get('config_limit_admin')));
	
		$data['sort'] = $sort;
		$data['order'] = $order;
	
		$data['header'] = $this->load->controller('common/header');
		$data['column_left'] = $this->load->controller('common/column_left');
		$data['footer'] = $this->load->controller('common/footer');
	
		$this->response->setOutput($this->load->view('location/warehouse_list', $data));
	}
	
	protected function getForm() {
		
		$data['text_form'] = !isset($this->request->get['warehouse_id']) ? $this->language->get('text_add') : $this->language->get('text_edit');
	
		if (isset($this->error['warning'])) {
			$data['error_warning'] = $this->error['warning'];
		} else {
			$data['error_warning'] = '';
		}
	
		if (isset($this->error['name'])) {
			$data['error_name'] = $this->error['name'];
		} else {
			$data['error_name'] = '';
		}
	
		if (isset($this->error['address_1'])) {
			$data['error_address_1'] = $this->error['address_1'];
		} else {
			$data['error_address_1'] = '';
		}

		if (isset($this->error['city'])) {
			$data['error_city'] = $this->error['city'];
		} else {
			$data['error_city'] = '';
		}
	
		if (isset($this->error['postcode'])) {
			$data['error_postcode'] = $this->error['postcode'];
		} else {
			$data['error_postcode'] = '';
		}
	
		if (isset($this->error['country_id'])) {
			$data['error_country'] = $this->error['country_id'];
		} else {
			$data['error_country'] = '';
		}
	
		if (isset($this->error['zone_id'])) {
			$data['error_zone'] = $this->error['zone_id'];
		} else {
			$data['error_zone'] = '';
		}
	
		$url = '';
	
		if (isset($this->request->get['sort'])) {
			$url .= '&sort=' . $this->request->get['sort'];
		}
	
		if (isset($this->request->get['order'])) {
			$url .= '&order=' . $this->request->get['order'];
		}
	
		if (isset($this->request->get['page'])) {
			$url .= '&page=' . $this->request->get['page'];
		}
	
		$data['breadcrumbs'] = array();
	
		$data['breadcrumbs'][] = array(
			'text' => $this->language->get('text_home'),
			'href' => $this->url->link('common/dashboard', 'user_token=' . $this->session->data['user_token'], true)
		);
	
		$data['breadcrumbs'][] = array(
			'text' => $this->language->get('heading_title'),
			'href' => $this->url->link('location/warehouse', 'user_token=' . $this->session->data['user_token'] . $url, true)
		);
	
		if (!isset($this->request->get['warehouse_id'])) {
			$data['action'] = $this->url->link('location/warehouse/add', 'user_token=' . $this->session->data['user_token'] . $url, true);
		} else {
			$data['action'] = $this->url->link('location/warehouse/edit', 'user_token=' . $this->session->data['user_token'] .  '&warehouse_id=' . $this->request->get['warehouse_id'] . $url, true);
		}
	
		$data['cancel'] = $this->url->link('location/warehouse', 'user_token=' . $this->session->data['user_token'] . $url, true);

		$data['user_token'] = $this->session->data['user_token'];

		if (isset($this->request->get['warehouse_id']) && ($this->request->server['REQUEST_METHOD'] != 'POST')) {
			$warehouse_info = $this->model_location_warehouse->getWarehouse($this->request->get['warehouse_id']);
		}

		if (isset($this->request->post['name'])) {
			$data['name'] = $this->request->post['name'];
		} elseif (!empty($warehouse_info) && isset($warehouse_info['name'])) {
			$data['name'] = $warehouse_info['name'];
		} else {
			$data['name'] = '';
		}

		if (isset($this->request->post['address_1'])) {
			$data['address_1'] = $this->request->post['address_1'];
		} elseif (!empty($warehouse_info) && isset($warehouse_info['address_1'])) {
			$data['address_1'] = $warehouse_info['address_1'];
		} else {
			$data['address_1'] = '';
		}
	
		if (isset($this->request->post['address_2'])) {
			$data['address_2'] = $this->request->post['address_2'];
		} elseif (!empty($warehouse_info) && isset($warehouse_info['address_2'])) {
			$data['address_2'] = $warehouse_info['address_2'];
		} else {
			$data['address_2'] = '';
		}

		if (isset($this->request->post['postcode'])) {
			$data['postcode'] = $this->request->post['postcode'];
		} elseif (!empty($warehouse_info) && isset($warehouse_info['postcode'])) {
			$data['postcode'] = $warehouse_info['postcode'];
		} else {
			$data['postcode'] = '';
		}
		
		if (isset($this->request->post['city'])) {
			$data['city'] = $this->request->post['city'];
		} elseif (!empty($warehouse_info) && isset($warehouse_info['city'])) {
			$data['city'] = $warehouse_info['city'];
		} else {
			$data['city'] = '';
		}
	
		if (isset($this->request->post['zone_id'])) {
			$data['zone_id'] = $this->request->post['zone_id'];
		} elseif (!empty($warehouse_info) && isset($warehouse_info['zone_id'])) {
			$data['zone_id'] = $warehouse_info['zone_id'];
		} else {
			$data['zone_id'] = '';
		}

		if (isset($this->request->post['country_id'])) {
			$data['country_id'] = $this->request->post['country_id'];
		} elseif (!empty($warehouse_info) && isset($warehouse_info['country_id'])) {
			$data['country_id'] = $warehouse_info['country_id'];
		} else {
			$data['country_id'] = '';
		}
		
		$country_id = isset($this->request->post['country_id']) ? (int)$this->request->post['country_id'] : 0;
		$zone_id = isset($this->request->post['zone_id']) ? (int)$this->request->post['zone_id'] : 0;

		$this->load->model('localisation/country');

		$data['countries'] = $this->model_localisation_country->getCountries();

		$data['user_token'] = $this->session->data['user_token'];

		// Load views
		$data['header'] = $this->load->controller('common/header');
		$data['column_left'] = $this->load->controller('common/column_left');
		$data['footer'] = $this->load->controller('common/footer');

		$this->response->setOutput($this->load->view('location/warehouse_form', $data));

	}

	protected function validateForm() {
		
		if (!$this->user->hasPermission('modify', 'location/warehouse')) {
			$this->error['warning'] = $this->language->get('error_permission');
		}
	
		if ((utf8_strlen($this->request->post['name']) < 3) || (utf8_strlen($this->request->post['name']) > 50)) {
			$this->error['name'] = $this->language->get('error_name');
		}
	
		if ((utf8_strlen($this->request->post['address_1']) < 3) || (utf8_strlen($this->request->post['address_1']) > 128)) {
			$this->error['address_1'] = $this->language->get('error_address_1');
		}

		if ((utf8_strlen($this->request->post['city']) < 2) || (utf8_strlen($this->request->post['city']) > 128)) {
				$this->error['city'] = $this->language->get('error_city');
		}

		if (utf8_strlen($this->request->post['postcode']) < 2 || utf8_strlen($this->request->post['postcode']) > 10) {
			$this->error['postcode'] = $this->language->get('error_postcode');
		}

		if ($this->request->post['country_id'] == '') {
			$this->error['country'] = $this->language->get('error_country');
		}

		if (!isset($this->request->post['zone_id']) || $this->request->post['zone_id'] == '') {
			$this->error['zone'] = $this->language->get('error_zone');
		}
	
		if ($this->error && !isset($this->error['warning'])) {
			$this->error['warning'] = $this->language->get('error_warning');
		}

		return !$this->error;
	}
	
	protected function validateDelete() {
		if (!$this->user->hasPermission('modify', 'location/warehouse')) {
			$this->error['warning'] = $this->language->get('error_permission');
		}

		return !$this->error;
	}
}