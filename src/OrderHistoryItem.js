import React from 'react';
import OrderHistoryLineItem from './OrderHistoryLineItem';

const OrderHistoryItem = ({ order }) => {
  return (
    <div className="column is-12">
      <div className="box orders-history-block has-shadow-hover">
        <div className="is-flex orders-block-header">
          <div className="item">
            <div>Order Number</div>
            <div>{order.number}</div>
          </div>
          <div className="item">
            <div>Order Type</div>
            <div>
              <p
                className={
                  order.type === 'One-time' ? 'is-onetime' : 'is-subscription'
                }
              >
                {order.type}
              </p>
            </div>
          </div>
          <div className="item">
            <div>Price</div>
            <div>{order.price}</div>
          </div>
          <div className="item">
            <div>Dispatch Date</div>
            <div>{order.dispatchDate}</div>
          </div>
        </div>
        <hr />
        <div className="order-information">
          {order.dispatchDate && (
            <p className="title is-6 is-marginless">
              It&apos;s been dispatched!
            </p>
          )}
          <div>
            <div className="order-information-expanded">
              <div className="product-list-boxes columns is-multiline">
                {order.items.map(item => (
                  <OrderHistoryLineItem key={item.id} item={item} />
                ))}
              </div>
              <hr />
              <div className="is-flex order-footer-information">
                <div className="left-info">
                  <div>Delivery Address</div>
                  <div>{order.shippingAddress}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryItem;
