import React, { useState, useEffect } from 'react';
import { FaTruck, FaCheckCircle, FaHistory, FaBoxOpen, FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../OrdersTrackingPage/OrdersTrackingPage.css';
import NavBar from '../../components/NavBar/NavBar';
import Footer from '../../components/Footer/Footer';

const OrdersTracking = () => {
  const [activeTab, setActiveTab] = useState('current');
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Sample data - replace with real API calls
  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setOrders({
          current: [
            {
              id: 'ORD-789456',
              date: '2023-06-18',
              status: 'shipped',
              items: [
                { name: 'Modern Coffee Table', quantity: 1, price: 199.99 }
              ],
              total: 199.99,
              trackingNumber: 'UPS-789456123'
            }
          ],
          history: [
            {
              id: 'ORD-123456',
              date: '2023-05-15',
              status: 'delivered',
              items: [
                { name: 'Ergonomic Office Chair', quantity: 2, price: 249.99 }
              ],
              total: 499.98
            },
            {
              id: 'ORD-456789',
              date: '2023-04-10',
              status: 'delivered',
              items: [
                { name: 'Wooden Bookshelf', quantity: 1, price: 179.99 }
              ],
              total: 179.99
            }
          ]
        });
        setIsLoading(false);
      }, 1000);
    };

    fetchOrders();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'shipped':
      case 'processing':
        return <FaTruck className="icon shipped" />;
      case 'delivered':
        return <FaCheckCircle className="icon delivered" />;
      default:
        return <FaBoxOpen className="icon" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <>
      <NavBar />
      <div className="orders-tracking-container">
        <div className="orders-header">
          <h1>My Orders</h1>
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'current' ? 'active' : ''}`}
              onClick={() => setActiveTab('current')}
            >
              <FaTruck /> Current Orders
            </button>
            <button
              className={`tab ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              <FaHistory /> Purchase History
            </button>
          </div>
        </div>

        <div className="orders-content">
          {isLoading ? (
            <div className="loading">Loading your orders...</div>
          ) : (
            <>
              {activeTab === 'current' && (
                <div className="current-orders">
                  {orders.current?.length > 0 ? (
                    orders.current.map(order => (
                      <div key={order.id} className="order-card">
                        <div className="order-header">
                          <div className="order-meta">
                            <h3>Order #{order.id}</h3>
                            <p className="order-date">Placed on {formatDate(order.date)}</p>
                          </div>
                          <div className="order-status">
                            {getStatusIcon(order.status)}
                            <span className={`status ${order.status}`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </div>
                        </div>

                        <div className="order-items">
                          {order.items.map((item, index) => (
                            <div key={index} className="item">
                              <span className="item-quantity">{item.quantity}x</span>
                              <span className="item-name">{item.name}</span>
                              <span className="item-price">${item.price.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>

                        <div className="order-footer">
                          <div className="order-total">
                            Total: <strong>${order.total.toFixed(2)}</strong>
                          </div>
                          <Link 
                            to={`/track-order/${order.id}`} 
                            className="track-button"
                          >
                            Track Order <FaChevronRight />
                          </Link>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-orders">
                      <FaBoxOpen className="empty-icon" />
                      <p>No current orders found</p>
                      <Link to="/products" className="shop-button">
                        Continue Shopping
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'history' && (
                <div className="order-history">
                  {orders.history?.length > 0 ? (
                    <div className="history-list">
                      {orders.history.map(order => (
                        <div key={order.id} className="history-card">
                          <div className="history-header">
                            <h3>Order #{order.id}</h3>
                            <p className="order-date">{formatDate(order.date)}</p>
                          </div>
                          <div className="history-status">
                            {getStatusIcon(order.status)}
                            <span className={`status ${order.status}`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </div>
                          <div className="history-items">
                            {order.items.slice(0, 2).map((item, index) => (
                              <div key={index} className="item">
                                <span>{item.quantity}x {item.name}</span>
                              </div>
                            ))}
                            {order.items.length > 2 && (
                              <div className="more-items">
                                +{order.items.length - 2} more items
                              </div>
                            )}
                          </div>
                          <div className="history-footer">
                            <div className="order-total">
                              Total: <strong>${order.total.toFixed(2)}</strong>
                            </div>
                            <Link 
                              to={`/orders/${order.id}`} 
                              className="view-details"
                            >
                              View Details <FaChevronRight />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-history">
                      <FaHistory className="empty-icon" />
                      <p>No purchase history found</p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrdersTracking;