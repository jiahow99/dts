<?php
class ControllerExtensionModuleDistributionCenter extends Controller {
    public function index() {
        if (ENV == 'production') {
            $data['src'] = DIR_BUILD . 'distribution_center/distribution_center.js?t=' . time();
        } else {
            $data['src'] = '/admin/view/template/extension/module/distribution_center/javascript/distribution_center.js';
        }
        
        $data['base_url'] = HTTPS_SERVER . 'view/template';
        $data['user_token'] = $this->session->data['user_token'];
        return $this->response->setOutput($this->load->view('extension/module/distribution_center/distribution_center', $data));
    }

    public function advance() {
        if (ENV == 'production') {
            $data['src'] = DIR_BUILD . 'distribution_center/advance_orders.js?t=' . time();
        } else {
            $data['src'] = '/admin/view/template/extension/module/distribution_center/javascript/advance_orders.js';
        }
        $data['base_url'] = HTTPS_SERVER . 'view/template';
        $data['user_token'] = $this->session->data['user_token'];
        return $this->response->setOutput($this->load->view('extension/module/distribution_center/advance_orders', $data));
    }

    public function overdue () {
        $this->load->model('user/user');
        $this->load->model('extension/module/dc_order');
        $this->load->model('location/warehouse');
        $this->load->model('location/delivery_zone');

        if (ENV == 'production') {
            $data['src'] = DIR_BUILD . 'distribution_center/overdue_orders.js?t=' . time();
        } else {
            $data['src'] = '/admin/view/template/extension/module/distribution_center/javascript/overdue_orders.js';
        }

        $data['module'] = 'distribution_center';
        $data['base_url'] = HTTPS_SERVER . 'view/template';
        $data['user_token'] = $this->session->data['user_token'];

        // Delivery zones
        $data['all_delivery_zones'] = $this->model_location_delivery_zone->getDeliveryZones();
        $data['delivery_zones'] = $this->model_extension_module_dc_order->getZoneWithOrders(true);

        // Orders
        if (isset($this->request->get['delivery_zone_id']) && $this->request->get['delivery_zone_id'] != '') {
            $data['orders'] = $this->model_extension_module_dc_order->getDeliveryZoneOrders($this->request->get['delivery_zone_id'], $this->config->get('config_order_status_processed'), $this->request->get, true);
        } else {
            $data['orders'] = array();
        }

        $data['total']['revert'] = $this->model_extension_module_dc_order->getTotalRevert();
        $data['total']['overdue'] = $this->model_extension_module_dc_order->getTotalOverdue();

        // JSON
        if (isset($this->request->get['return_type']) && $this->request->get['return_type'] == 'json') {
            $this->response->addHeader('Content-Type: application/json');
            $this->response->setOutput(json_encode($data));
            return ;
        }

        return $this->response->setOutput($this->load->view('extension/module/distribution_center/overdue_orders', $data));
    }

    public function revertOrders () {
        $this->load->model('user/user');
        $this->load->model('extension/module/dc_order');
        
        if (ENV == 'production') {
            $data['src'] = DIR_BUILD . 'processing_department/revert_orders.js?t=' . time();
        } else {
            $data['src'] = '/admin/view/template/extension/module/processing_department/javascript/revert_orders.js';
        }

        $data['module'] = 'distribution_center';
        $data['base_url'] = HTTPS_SERVER . 'view/template';
        $data['user_token'] = $this->session->data['user_token'];

        $data['orders'] = $this->model_extension_module_dc_order->getRevertOrders($this->request->get);
        $data['total'] = $this->model_extension_module_dc_order->getTotalRevert();
        
        // JSON
        if (isset($this->request->get['return_type']) && $this->request->get['return_type'] == 'json') {
            $this->response->addHeader('Content-Type: application/json');
            $this->response->setOutput(json_encode($data));
            return ;
        }

        return $this->response->setOutput($this->load->view('extension/module/revert_orders', $data));
    }

    public function orders () {
        $this->load->model('location/delivery_zone');
        $this->load->model('extension/module/dc_order');

        switch ($this->request->get['status']) {
            case 'advance':
                $order_status_id = [
                    $this->config->get('config_order_status_processed'),
                    $this->config->get('config_order_status_processing'),
                ];break;
            case 'processed':
                $order_status_id = $this->config->get('config_order_status_processed');break;
            case 'pickup':
                $order_status_id = [
                    $this->config->get('config_order_status_ac_doc'),
                    $this->config->get('config_order_status_ready'),
                    $this->config->get('config_order_status_shipped'),
                ];break;
            default:
                $order_status_id = $this->config->get('config_order_status_processed');break;
        }

        
        // Delivery zones
        $data['delivery_zones'] = $this->model_extension_module_dc_order->getZoneWithOrders();

        // Orders
        if ($order_status_id == $this->config->get('config_order_status_processed')) {
            if (isset($this->request->get['delivery_zone_id']) && $this->request->get['delivery_zone_id'] != '' && $this->request->get['delivery_zone_id'] != 0) {
                $filter_data = $this->request->get;
                // add filter delivery_date today if not set
                //$filter_data['delivery_date'] = $delivery_date->format('d/m/Y');
            
                $data['orders'] = $this->model_extension_module_dc_order->getDeliveryZoneOrders($this->request->get['delivery_zone_id'], $order_status_id, $filter_data);
            } else {
                // $data['orders'] = $this->model_extension_module_dc_order->getOrdersWithoutZone(false);
            }
        } else {
            $data['orders'] = $this->model_extension_module_dc_order->getOrders($order_status_id, $this->request->get);
        }
        
        // Total
        $data['total']['processed'] = $this->model_extension_module_dc_order->getTotal($this->config->get('config_order_status_processed'));
        $data['total']['processing'] = $this->model_extension_module_dc_order->getTotal($this->config->get('config_order_status_processing'));
        $data['total']['revert'] = $this->model_extension_module_dc_order->getTotalRevert();
        $data['total']['pickup'] = $this->model_extension_module_dc_order->getTotal([$this->config->get('config_order_status_ac_doc'), $this->config->get('config_order_status_shipped'), $this->config->get('config_order_status_ready')]);
        $data['total']['overdue'] = $this->model_extension_module_dc_order->getTotalOverdue();
        $data['total']['advance'] = $this->model_extension_module_dc_order->getTotalAdvance();

        $data['filters'] = $this->request->get;
            
        return $this->response->setOutput(json_encode($data));
    }

    public function updateProduct() {
        if (isset($this->request->post['order_product_id'])) {
            $product['order_product_id'] = $this->request->post['order_product_id'];
            $product['dc_qty'] = isset($this->request->post['dc_qty']) ? $this->request->post['dc_qty'] : 0;
            $product['weight'] = isset($this->request->post['weight']) ? $this->request->post['weight'] : 0;
            $product['partial_weights'] = isset($this->request->post['partial_weights']) ? $this->request->post['partial_weights'] : [];
            $product['checked'] = isset($this->request->post['checked']) ? $this->request->post['checked'] : 0;
            
            $this->load->model('extension/module/dc_order');
            $this->model_extension_module_dc_order->updateProducts([$product]);

            return $this->response->setOutput(json_encode(['success' => 'Product updated !']));
        
        } else {
            return $this->response->setOutput(json_encode(['error' => 'Order product ID is required !']));
        }
    }

    public function updateOrder() {
        $requred = ['products'];
        foreach ($requred as $key) {
            if (!isset($this->request->post[$key])) {
                return $this->response->setOutput(json_encode(['error' => $key . ' is required !']));
            }
        }
        // Update products
        $this->load->model('extension/module/dc_order');
        $this->model_extension_module_dc_order->updateProducts($this->request->post['products']);

        return $this->response->setOutput(json_encode(['success' => 'Order updated !']));
    }
    
    public function completeOrders () {
        $required = ['orders'];
        foreach ($required as $key) {
            if (!isset($this->request->post[$key])) {
                return $this->response->setOutput(json_encode(['error' => $key . ' is required !']));
            }
        }
        // Complete order by customer
        $this->load->model('extension/module/dc_order');
        $this->model_extension_module_dc_order->completeOrders($this->request->post['orders']);
        
        return $this->response->setOutput(json_encode(['success' => "Orders updated to 'ready to ship' !"]));
    }

    public function changeDriver() {
        if (isset($this->request->post['order_id'])) {
            $order_id = $this->request->post['order_id'];
        } else {
            return $this->response->setOutput(json_encode(['error' => 'Order id is required !']));
        }
        if (isset($this->request->post['delivery_zone_id'])) {
            $delivery_zone_id = $this->request->post['delivery_zone_id'];
        } else {
            return $this->response->setOutput(json_encode(['error' => 'Delivery zone id is required !']));
        }

        // Change driver
        $this->load->model('extension/module/dc_order');
        $this->model_extension_module_dc_order->changeDriver($order_id, $delivery_zone_id);

        return $this->response->setOutput(json_encode(['success' => 'Driver info updated !']));
    }

    public function revert() {
        if (isset($this->request->post['order_id'])) {
            $order_id = $this->request->post['order_id'];
        } else {
            return $this->response->setOutput(json_encode(['error' => 'Order ID is required !']));
        }

        // Revert status to 'processed'
        $this->load->model('extension/module/dc_order');
        $processed_status = $this->config->get('config_order_status_processed');
        $this->model_extension_module_dc_order->revert($order_id, $processed_status);

        return $this->response->setOutput(json_encode(['success' => 'Order successfully reverted !']));
    }

    public function markPickup() {
        if (isset($this->request->post['selected'])) {
            $order_ids = $this->request->post['selected'];
        } elseif (isset($this->request->get['order_id'])) {
            $order_ids[] = $this->request->get['order_id'];
        }

        if (!$order_ids) {
            return $this->response->setOutput(json_encode(['error' => 'Order is required !']));
        }
        
        // Update main order
        $this->load->model('extension/module/dc_order');
        $this->model_extension_module_dc_order->markPickup($order_ids);

        return $this->response->setOutput(json_encode(['success' => 'Delivery order generated success !']));
    }
}
