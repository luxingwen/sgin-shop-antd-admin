// paymentApi dynamic import inside effect/submit
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { Button, Card, Form, Input, message, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch } from '@umijs/max';

const PayPalTest = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [paid, setPaid] = useState(false);
  const [clientId, setClientId] = useState(null); // State to store the client ID

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: 'payment/fetchClientId', payload: 'sandbox', callback: (res: any) => {
      if (res?.code === 200) setClientId(res.data);
      else message.error('Failed to load PayPal client ID');
    }});
  }, [dispatch]);

  const handleFormSubmit = async (values) => {
    setLoading(true);
    try {
      values.amount = parseFloat(values.amount);
      dispatch({ type: 'payment/requestPayPal', payload: values, callback: (res: any) => {
        if (res?.code === 200 && res.data && res.data.id) {
          setOrderId(res.data.id);
          setIsModalVisible(true);
        } else {
          message.error('Failed to initiate PayPal payment');
        }
      }});
    } catch (error) {
      message.error('An error occurred while initiating PayPal payment');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (orderId) => {
    console.log(`Payment successful! Order ID: ${orderId}`);
    message.success(`Payment successful! Order ID: ${orderId}`);
    setPaid(true);
    setIsModalVisible(false); // Close the modal after successful payment
  };

  return (
    <div>
      {clientId && (
        <PayPalScriptProvider
          options={{
            'client-id': clientId,
            currency: 'USD',
            intent: 'capture',
          } as any}
        >
          <Card
            title="PayPal Payment Test"
            style={{ maxWidth: 600, margin: '0 auto' }}
          >
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                amount: '1.00',
                productName: 'Test Product',
              }}
              onFinish={handleFormSubmit}
            >
              <Form.Item
                name="amount"
                label="Payment Amount"
                rules={[
                  {
                    required: true,
                    message: 'Please enter the payment amount',
                  },
                ]}
              >
                <Input
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="Enter payment amount"
                />
              </Form.Item>

              <Form.Item
                name="productName"
                label="Product Name"
                rules={[
                  { required: true, message: 'Please enter the product name' },
                ]}
              >
                <Input placeholder="Enter product name" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Pay with PayPal
                </Button>
              </Form.Item>
            </Form>

            <Modal
              title="Complete Your Payment"
              visible={isModalVisible}
              footer={null}
              onCancel={() => setIsModalVisible(false)}
            >
              {orderId && (
                <PayPalButtons
                  style={{ layout: 'vertical' }}
                  createOrder={() => {
                    return orderId; // Return the PayPal order ID directly
                  }}
                  onApprove={async (data, actions) => {
                    const order = await actions.order.capture();
                    handlePaymentSuccess(order.id);
                  }}
                  onError={(err) => {
                    message.error(
                      'An error occurred during payment processing',
                    );
                    console.error(err);
                  }}
                />
              )}
            </Modal>

            {paid && (
              <div style={{ marginTop: 20 }}>Thank you for your purchase!</div>
            )}
          </Card>
        </PayPalScriptProvider>
      )}
    </div>
  );
};

export default PayPalTest;
