import React from 'react';

const OrderHistoryLineItem = ({ item }) => {
  return (
    <div className="column is-6">
      <div className="media">
        <div className="media-left">
          <img alt={item.title} className="image" src={item.image} />
        </div>
        <div className="media-content">
          <div>
            <p className="product-title">{item.title}</p>
            <p className="product-variants">{item.info}</p>
          </div>
        </div>
        <div className="media-right">
          <p className="product-price">{item.price}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryLineItem;
