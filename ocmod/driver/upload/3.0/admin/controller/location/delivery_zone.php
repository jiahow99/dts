<?php

class ControllerLocationDeliveryZone extends Controller {
	
	private $error = array();

	public function index() {
		$this->load->language('location/delivery_zone');
	
		$this->document->setTitle($this->language->get('heading_title'));
	
		$this->load->model('location/delivery_zone');
	
		$this->getList();
	}	
	
	public function add() {
		$this->load->language('location/delivery_zone');

		$this->document->setTitle($this->language->get('heading_title'));
	
		$this->load->model('location/delivery_zone');
	
		if (($this->request->server['REQUEST_METHOD'] == 'POST' && $this->validateForm())) {
			$this->model_location_delivery_zone->addDeliveryZone($this->request->post);

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
	
			$this->response->redirect($this->url->link('location/delivery_zone', 'user_token=' . $this->session->data['user_token'] . $url, true));
		}
	
		$this->getForm();
	}
	
	public function edit() {
		$this->load->language('location/delivery_zone');
	
		$this->document->setTitle($this->language->get('heading_title'));
	
		$this->load->model('location/delivery_zone');

		if (($this->request->server['REQUEST_METHOD'] == 'POST') && $this->validateForm()) {		
			// Update the warehouse data
			$this->model_location_delivery_zone->editDeliveryZone($this->request->get['delivery_zone_id'], $this->request->post);
	
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
	
			$this->response->redirect($this->url->link('location/delivery_zone', 'user_token=' . $this->session->data['user_token'] . $url, true));
			
			}

		$this->getForm();
	}	

	public function delete() {
		$this->load->language('location/delivery_zone');

		$this->document->setTitle($this->language->get('heading_title'));

		$this->load->model('location/delivery_zone');

		if (isset($this->request->post['selected']) && $this->validateDelete()) {
			foreach ($this->request->post['selected'] as $delivery_zone_id) {
				$this->model_location_delivery_zone->deleteDeliveryZone($delivery_zone_id);
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

			$this->response->redirect($this->url->link('location/delivery_zone', 'user_token=' . $this->session->data['user_token'] . $url, true));
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
			'href' => $this->url->link('location/delivery_zone', 'user_token=' . $this->session->data['user_token'] . $url, true)
		);
	
		$data['add'] = $this->url->link('location/delivery_zone/add', 'user_token=' . $this->session->data['user_token'] . $url, true);
		$data['delete'] = $this->url->link('location/delivery_zone/delete', 'user_token=' . $this->session->data['user_token'] . $url, true);

		$data['delivery_zone'] = array();
	
		$filter_data = array(
			'sort'  => $sort,
			'order' => $order,
			'start' => ($page - 1) * $this->config->get('config_limit_admin'),
			'limit' => $this->config->get('config_limit_admin')
		);

		$delivery_zone_total = $this->model_location_delivery_zone->getTotalDeliveryZone();

		// Delivery zones
		$data['delivery_zones'] = $this->model_location_delivery_zone->getDeliveryZones($filter_data);
		
		foreach ($data['delivery_zones'] as &$zone) {
			$zone['edit'] = $this->url->link('location/delivery_zone/edit', 'user_token=' . $this->session->data['user_token'] . '&delivery_zone_id=' . $zone['delivery_zone_id'] . $url, true);
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
	
		$data['sort_name'] = $this->url->link('location/delivery_zone', 'user_token=' . $this->session->data['user_token'] . '&sort=name' . $url, true);
		$data['sort_description'] = $this->url->link('location/delivery_zone', 'user_token=' . $this->session->data['user_token'] . '&sort=description' . $url, true);
	
		$url = '';
	
		if (isset($this->request->get['sort'])) {
			$url .= '&sort=' . $this->request->get['sort'];
		}
	
		if (isset($this->request->get['order'])) {
			$url .= '&order=' . $this->request->get['order'];
		}
	
		$pagination = new Pagination();
		$pagination->total = $delivery_zone_total;
		$pagination->page = $page;
		$pagination->limit = $this->config->get('config_limit_admin');
		$pagination->url = $this->url->link('location/delivery_zone', 'user_token=' . $this->session->data['user_token'] . $url . '&page={page}', true);
	
		$data['pagination'] = $pagination->render();
	
		$data['results'] = sprintf($this->language->get('text_pagination'), ($delivery_zone_total) ? (($page - 1) * $this->config->get('config_limit_admin')) + 1 : 0, ((($page - 1) * $this->config->get('config_limit_admin')) > ($delivery_zone_total - $this->config->get('config_limit_admin'))) ? $delivery_zone_total : ((($page - 1) * $this->config->get('config_limit_admin')) + $this->config->get('config_limit_admin')), $delivery_zone_total, ceil($delivery_zone_total / $this->config->get('config_limit_admin')));
	
		$data['sort'] = $sort;
		$data['order'] = $order;
	
		$data['header'] = $this->load->controller('common/header');
		$data['column_left'] = $this->load->controller('common/column_left');
		$data['footer'] = $this->load->controller('common/footer');
	
		$this->response->setOutput($this->load->view('location/delivery_zone_list', $data));
	}
	
    protected function getForm() {
        $this->load->language('location/delivery_zone');
    
        $data['text_form'] = !isset($this->request->get['delivery_zone_id']) ? $this->language->get('text_add') : $this->language->get('text_edit');
    
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
    
        if (isset($this->error['driver'])) {
            $data['error_driver'] = $this->error['driver'];
        } else {
            $data['error_driver'] = '';
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
            'href' => $this->url->link('location/delivery_zone', 'user_token=' . $this->session->data['user_token'] . $url, true)
        );
    
        if (!isset($this->request->get['delivery_zone_id'])) {
            $data['action'] = $this->url->link('location/delivery_zone/add', 'user_token=' . $this->session->data['user_token'] . $url, true);
        } else {
            $data['action'] = $this->url->link('location/delivery_zone/edit', 'user_token=' . $this->session->data['user_token'] . '&delivery_zone_id=' . $this->request->get['delivery_zone_id'] . $url, true);
        }
    
        $data['cancel'] = $this->url->link('location/delivery_zone', 'user_token=' . $this->session->data['user_token'] . $url, true);
    
        if (isset($this->request->get['delivery_zone_id']) && ($this->request->server['REQUEST_METHOD'] != 'POST')) {
            $delivery_zone_info = $this->model_location_delivery_zone->getDeliveryZone($this->request->get['delivery_zone_id']);
        }
		
        $data['user_token'] = $this->session->data['user_token'];
    
        if (isset($this->request->post['name'])) {
            $data['name'] = $this->request->post['name'];
        } elseif (!empty($delivery_zone_info)) {
            $data['name'] = $delivery_zone_info['name'];
        } else {
            $data['name'] = '';
        }

		if (isset($this->request->post['user_id'])) {
            $data['user_id'] = $this->request->post['user_id'];
        } elseif (!empty($delivery_zone_info)) {
            $data['user_id'] = $delivery_zone_info['user_id'];
        } else {
            $data['user_id'] = '';
        }

		// Drivers
		$this->load->model('user/user');
		$data['drivers'] = $this->model_user_user->getUsersByUserGroup($this->config->get('config_user_group_driver'));


		$data['header'] = $this->load->controller('common/header');
        $data['column_left'] = $this->load->controller('common/column_left');
        $data['footer'] = $this->load->controller('common/footer');

		$this->response->setOutput($this->load->view('location/delivery_zone_form', $data));
    }

	protected function validateForm() {
		
		if (!$this->user->hasPermission('modify', 'location/delivery_zone')) {
			$this->error['warning'] = $this->language->get('error_permission');
		}
	
		if ((utf8_strlen($this->request->post['name']) < 3) || (utf8_strlen($this->request->post['name']) > 50)) {
			$this->error['name'] = $this->language->get('error_name');
		}

		// if (!isset($this->request->post['user_id']) || $this->request->post['user_id'] == '') {
		// 	$this->error['driver'] = $this->language->get('error_driver');
		// }
	
		if ($this->error && !isset($this->error['warning'])) {
			$this->error['warning'] = $this->language->get('error_warning');
		}

		return !$this->error;
	}
	
	protected function validateDelete() {
		if (!$this->user->hasPermission('modify', 'location/delivery_zone')) {
			$this->error['warning'] = $this->language->get('error_permission');
		}

		return !$this->error;
	}
}