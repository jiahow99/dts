<?php
class ControllerExtensionModuleDriver extends Controller
{
    public function index() {
        $data = array();
        $this->load->model('user/user');
        
        $data['driver'] = $this->model_user_user->getUser($this->user->getId());
        $data['base_url'] = HTTPS_SERVER . 'view/template';
        $data['user_token'] = $this->session->data['user_token'];

        $this->response->setOutput($this->load->view('extension/module/driver', $data));
    }

    public function orders() {
        $this->load->model('extension/module/driver_order');
        $this->load->model('location/delivery_zone');

        switch ($this->request->get['status']) {
            case 'pickup':
                $order_status_id = $this->config->get('config_order_status_ac_doc');
                break;
            case 'shipped':
                $order_status_id = $this->config->get('config_order_status_shipped');
                break;
            default:
                $order_status_id = $this->config->get('config_order_status_ac_doc');
                break;
        }

        $json['orders'] = $this->model_extension_module_driver_order->getOrders($order_status_id, $this->request->get);
        $json['total']['new'] = $this->model_extension_module_driver_order->getTotalOrders($this->config->get('config_order_status_ac_doc'));
        $json['total']['completed'] = $this->model_extension_module_driver_order->getTotalOrders($this->config->get('config_order_status_shipped'));
        $json['delivery_zones'] = $this->model_location_delivery_zone->getDeliveryZones();

        $this->response->setOutput(json_encode($json));
    }

    public function createPod() {
        $order_id = $this->request->post['order_id'];
        $path = $this->request->post['path'];

        if (!isset($order_id)) {
            $error = 'Order is required !';
        } elseif (!isset($path)) {
            $error = 'Path is required !';
        }
        if (isset($error)) {
            $this->response->setOutput(json_encode(['error' => $error]));
        }

        $this->load->model('extension/module/driver_order');
        $order_pod_id = $this->model_extension_module_driver_order->createPod($order_id, $path);

        $data['success'] = 'Order pod created successfully.';
        $data['order_pod_id'] = $order_pod_id;
        $this->response->setOutput(json_encode($data));
    }

    public function deletePod() {
        if (!isset($this->request->post['order_pod_id'])) {
            $error = 'Order Pod ID is required !';
        } 
        if (isset($error)) {
            $this->response->setOutput(json_encode(['error' => $error]));
        }
        
        $order_pod_id = $this->request->post['order_pod_id'];

        $this->load->model('extension/module/driver_order');
        $this->model_extension_module_driver_order->deletePod($order_pod_id);

        $this->response->setOutput(json_encode(['success' => 'Pod deleted successfully.']));
    }

    public function markShipped() {
        if (!isset($this->request->post['order_id'])) {
            $error = 'Order is required !';
        } elseif (!isset($this->request->post['images'])) {
            $error = 'Photo of Delivery (POD) is required !';
        }
        if (isset($error)) {
            $this->response->setOutput(json_encode(['error' => $error]));
        }
        
        // Save images
        $this->load->model('sale/order');
        foreach ($this->request->post['images'] as $image) {
            $data['order_id'] = $this->request->post['order_id'];
            $data['image'] = $image;
            $this->model_sale_order->createPod($data);
        }

        // Update order status to 'Shipped'
        $this->load->model('extension/module/driver_order');
        $this->model_extension_module_driver_order->markShipped($this->request->post['order_id']);

        $this->response->setOutput(json_encode(['success' => 'Order status updated to shipped.']));
    }
}
