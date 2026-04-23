<?php
class ControllerExtensionModuleProcessingDepartment extends Controller
{
    public function index() {
        $data = array();
        
        $this->load->model('user/user');
        $this->load->model('location/warehouse');

        $admin = $this->model_user_user->getUser($this->user->getId());
        
        $this->document->addStyle('https://cdn.tailwindcss.com');
        $this->document->addScript('https://unpkg.com/vue@3/dist/vue.global.js');

        $data['base_url'] = HTTPS_SERVER . 'view/template';
        $data['user_token'] = $this->session->data['user_token'];
        $data['warehouse'] = $this->model_location_warehouse->getWarehouse($admin['warehouse_id']);
        $this->response->setOutput($this->load->view('extension/module/processing_department/processing_department', $data));
    }

    public function orders() {
        $this->load->model('user/user');
        $this->load->model('extension/module/warehouse_order');

        $admin = $this->model_user_user->getUser($this->user->getId());

        $data = array();

        // Status
        $status_new = $this->model_extension_module_warehouse_order->statusNew();
        $status_processing = $this->model_extension_module_warehouse_order->statusProcessing();
        $status_completed = $this->model_extension_module_warehouse_order->statusCompleted();
        
        // Main
        if ($this->request->get['status'] == 'main') {
            $data['orders'] = $this->model_extension_module_warehouse_order->getWarehouseOrders($admin['warehouse_id'], 'main', $this->request->get);

        // Advance
        } elseif ($this->request->get['status'] == 'advance') {
            $data['orders'] = $this->model_extension_module_warehouse_order->getWarehouseOrders($admin['warehouse_id'], 'advance', $this->request->get);

        // Processing
        } elseif ($this->request->get['status'] == 'processing') {
            $data['orders'] = $this->model_extension_module_warehouse_order->getBatches($this->request->get);

        // Completed
        } elseif ($this->request->get['status'] == 'completed') {
            $data['orders'] = $this->model_extension_module_warehouse_order->getWarehouseOrders($admin['warehouse_id'], $status_completed, $this->request->get);
        }

        // Revert orders
        $data['total']['revert'] = $this->model_extension_module_warehouse_order->getRevertOrders($admin['warehouse_id'])['total'];

        // Total
        $data['total']['today'] = $this->model_extension_module_warehouse_order->getTotalWarehouseOrder($status_new)['today'];
        $data['total']['advance'] = $this->model_extension_module_warehouse_order->getTotalWarehouseOrder($status_new)['advance'];
        $data['total']['processing'] = $this->model_extension_module_warehouse_order->getTotalWarehouseOrder($status_processing);
        $data['total']['completed'] = $this->model_extension_module_warehouse_order->getTotalWarehouseOrder($status_completed);
        $data['total']['overdue'] = $this->model_extension_module_warehouse_order->getTotalOverdueOrders();

        $this->response->setOutPut(json_encode($data));
    }

    public function batch() {
        $this->load->model('user/user');
        $this->load->model('extension/module/warehouse_order');

        $batch_id = $this->request->get['batch_id'];

        // Get batch from same picklist
        $batch = $this->model_extension_module_warehouse_order->getBatch($batch_id);
        if ($batch['picklist_id']) {
            $other_batches = $this->db->query("SELECT * FROM " . DB_PREFIX . "warehouse_order_batch WHERE picklist_id = '" . (int)$batch['picklist_id'] . "' AND warehouse_order_batch_id != '" . (int)$batch_id . "'")->rows;
        } else {
            $other_batches = [];
        }
        $data['batches'] = array_merge([$batch], $other_batches);

        // Warehouse orders
        foreach ($data['batches'] as &$batch) {
            $added_by = $this->model_user_user->getUser($batch['added_by']);
            $batch['added_by'] = $added_by['firstname'] . ' ' . $added_by['lastname'];
            $batch['warehouse_orders'] = $this->model_extension_module_warehouse_order->getWarehouseOrdersByBatch($batch_id);
            // Products
            foreach ($batch['warehouse_orders'] as &$order) {
                $order['products'] = $this->model_extension_module_warehouse_order->getOrderProducts($order['order_id'], $added_by['warehouse_id']);
                // Check if is revert order                
                foreach ($order['products'] as $product) {
                    $order['revert_order'] = $product['revert_order'] == 1;
                }
            }
        }
        // Remove batch with no orders
        $data['batches'] = array_filter($data['batches'], function($item) {
            return !empty($item['warehouse_orders']);
        });

        // All orders completed, redirect
        if (!count($data['batches'])) {
            $this->response->redirect($this->url->link('extension/module/processing_department', '&user_token=' . $this->session->data['user_token'] . '&redirect=completed', true));
        }

        // Picklist
        $data['picklist'] = $this->model_extension_module_warehouse_order->getPicklistByBatchId($batch_id);

        // Total
        $data['total_overdue'] = $this->model_extension_module_warehouse_order->getTotalOverdueOrders();

        $data['user_token'] = $this->session->data['user_token'];
        $data['base_url'] = HTTPS_SERVER . 'view/template';

        foreach ($data as $key => &$value) {
            if (is_array($value)) {
                $value = json_encode($value);
            }
        }

        $this->response->setOutput($this->load->view('extension/module/processing_department/batch', $data));
    }

    public function revertOrders () {
        $this->load->model('user/user');
        $this->load->model('extension/module/warehouse_order');
        $this->load->model('location/warehouse');

        $admin = $this->model_user_user->getUser($this->user->getId());
        $orders = $this->model_extension_module_warehouse_order->getRevertOrders($admin['warehouse_id'], $this->request->get);
        
        $data['module'] = 'processing_department';
        $data['base_url'] = HTTPS_SERVER . 'view/template';
        $data['user_token'] = $this->session->data['user_token'];
        $data['warehouse'] = $this->model_location_warehouse->getWarehouse($admin['warehouse_id']);

        $data['orders'] = $orders['orders'];
        $data['total']['revert'] = $orders['total'];
        $data['total']['overdue'] = $this->model_extension_module_warehouse_order->getTotalOverdueOrders();
        
        // JSON
        if (isset($this->request->get['return_type']) && $this->request->get['return_type'] == 'json') {
            $this->response->addHeader('Content-Type: application/json');
            $this->response->setOutput(json_encode($data));
            return ;
        }

        return $this->response->setOutput($this->load->view('extension/module/revert_orders', $data));
    }

    public function overdue () {
        $this->load->model('user/user');
        $this->load->model('extension/module/warehouse_order');
        $this->load->model('location/warehouse');

        $admin = $this->model_user_user->getUser($this->user->getId());

        $data['module'] = 'processing_department';
        $data['base_url'] = HTTPS_SERVER . 'view/template';
        $data['user_token'] = $this->session->data['user_token'];
        $data['warehouse'] = $this->model_location_warehouse->getWarehouse($admin['warehouse_id']);

        // Orders
        $data['orders'] = $this->model_extension_module_warehouse_order->getOverdueOrders($this->request->get);
        $data['total']['overdue'] = $this->model_extension_module_warehouse_order->getTotalOverdueOrders();
        $data['total']['revert'] = $this->model_extension_module_warehouse_order->getRevertOrders($admin['warehouse_id'])['total'];
        
        // JSON
        if (isset($this->request->get['return_type']) && $this->request->get['return_type'] == 'json') {
            $this->response->addHeader('Content-Type: application/json');
            $this->response->setOutput(json_encode($data));
            return ;
        }

        return $this->response->setOutput($this->load->view('extension/module/processing_department/overdue_orders', $data));
    }

    public function markProcessing() {
        $this->load->model('user/user');
        $this->load->model('extension/module/warehouse_order');

        if (!isset($this->request->post['order_ids'])) {
            $error = 'Order ids is required !';
        } else if (!isset($this->request->post['warehouse_order_ids'])) {
            $error = 'Warehouse order ids is required !';
        }
        if (isset($error)) {
            $this->response->addHeader('HTTP/1.1 404 Not Found');
            $this->response->setOutput(json_encode(['error' => $error]));
        }

        // Change status to processing
        $batch_id = $this->model_extension_module_warehouse_order->createWarehouseOrderBatch($this->request->post);
        $data['success'] = 'Order status updated to processing';
        $data['batch_id'] = $batch_id;
        
        $this->response->setOutput(json_encode($data));
    }

    public function updateWeight() {
        if (!isset($this->request->post['order_product_id'])) {
            $error = 'Order product id is required !';
        } else if (!isset($this->request->post['partial_weights'])) {
            $error = 'Partial weights is required !';
        }
        if (isset($error)) {
            $this->response->addHeader('HTTP/1.1 404 Not Found');
            $this->response->setOutput(json_encode(['error' => $error]));
        }

        $this->load->model('extension/module/warehouse_order');
        $product = $this->model_extension_module_warehouse_order->updateWeights($this->request->post);

        $data['success'] = "Weights updated successfully";
        $data['partial_weights'] = unserialize($product['partial_weights']);
        
        $this->response->setOutput(json_encode($data));
    }

    public function completeOrder() {
        $this->load->model('user/user');
        $this->load->model('extension/module/warehouse_order');
        $admin = $this->model_user_user->getUser($this->user->getId());

        if (isset($this->request->post['order'])) {
            $order = $this->request->post['order'];
        } else {
            $this->response->addHeader('HTTP/1.1 404 Not Found');
            $this->response->setOutput(json_encode(['error' => 'Order is required']));
        }
        $this->model_extension_module_warehouse_order->completeOrder($order);
        
        $this->response->setOutput(json_encode(['message' => 'Order status updated to completed']));
    }

    public function savePicklist() {
        if (isset($this->request->post['picklist'])) {
            $json = json_encode($this->request->post['picklist']);
        } else {
            $this->response->setOutput(json_encode(''));
        }    

        if (isset($this->request->post['warehouse_order_batch_ids'])) {
            $warehouse_order_batch_ids = $this->request->post['warehouse_order_batch_ids'];
            // Create picklist
            $this->db->query("INSERT INTO `" . DB_PREFIX . "picklist` (json) VALUES ('$json');");
            $picklist_id = $this->db->getLastId();
            // Update picklist_id on warehouse_order
            $this->db->query("UPDATE " . DB_PREFIX . "warehouse_order_batch SET picklist_id = '" . (int)$picklist_id . "' WHERE warehouse_order_batch_id IN (" . implode(',', $warehouse_order_batch_ids) . ")");
        
        } else {
            // Update picklist
            $picklist_id = $this->request->post['picklist_id'];
            $this->db->query("UPDATE " . DB_PREFIX . "picklist SET json = '" . $json . "' WHERE picklist_id = '" . $picklist_id . "'");
        }

        $this->response->setOutput(json_encode(['message' => 'Picklist saved', 'picklist_id' => $picklist_id]));
    }

    public function revertOrder() {
        $this->load->model('extension/module/warehouse_order');
        $this->load->model('user/user');
        
        $warehouse_order_id = $this->request->post['warehouse_order_id'];
        $order_id = $this->request->post['order_id'];
        $warehouse_order = $this->model_extension_module_warehouse_order->getWarehouseOrder($warehouse_order_id);

        if ($warehouse_order) {
            $now = new DateTime();
            $completed = new DateTime($warehouse_order['date_completed']);
            $interval = $now->diff($completed);

            if ($interval->h == 0 && $interval->i < $this->config->get('config_order_revert_window')) {
                $this->model_extension_module_warehouse_order->revert($warehouse_order['warehouse_order_id'], $order_id);
                $data['message'] = 'Batch revert successfully';
            } else {
                $data['error'] = 'Batch has passed ' . $this->config->get('config_order_revert_window') . ' minutes';
            }
        } else {
            $data['error'] = 'Batch not found';
        }

        return $this->response->setOutput(json_encode($data));
    }
}
