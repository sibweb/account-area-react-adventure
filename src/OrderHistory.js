import React, { useEffect, useState } from 'react';
import PageHeader from './PageHeader';
import OrderHistoryItem from './OrderHistoryItem';
import FormatOrders from './utils/FormatOrders';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error] = useState(null);

  useEffect(() => {
    fetch('https://reactasty.apps.huel.io/api/customer/orders')
      .then(res => res.json())
      .then(
        results => {
          setIsLoaded(true);
          const formattedOrders = FormatOrders.format(results);
          setOrders(formattedOrders);
        },
        error => {
          setIsLoaded(true);
          // Log error to console for development debugging show nicer message to user.
          console.error(error);
        }
      );
  }, []);

  if (error) {
    return (
      <div className="columns is-multiline">
        <PageHeader title="Order History" />
        <div className="column is-12">
          <div className="box orders-history-block has-shadow-hover">
            Oops.. an error has occurred loading your orders please try again
            later...
          </div>
        </div>
      </div>
    );
  } else if (!isLoaded) {
    return (
      <div className="columns is-multiline">
        <PageHeader title="Order History" />
        <div className="column is-12">
          <div className="box orders-history-block has-shadow-hover">
            Fetching your orders...
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="columns is-multiline">
        <PageHeader title="Order History" />
        {orders.map(order => (
          <OrderHistoryItem key={order.id} order={order} />
        ))}
      </div>
    );
  }
};

export default OrderHistory;
