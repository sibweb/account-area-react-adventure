import moment from 'moment';

// Check if what currency we are in and add this to the total price. Could be other countries. No examples in the sample API but could be.
function addCurrency(total_price, currency) {
  let formattedPrice;

  if (currency === 'USD') {
    formattedPrice = '$' + total_price;
  } else if (currency === 'GBP') {
    // Example of another currency being used.
    formattedPrice = '£' + total_price;
  }

  return formattedPrice;
}

function sortProductText(title, variantTitle) {
  if (!variantTitle || !parseInt(variantTitle)) {
    return { title, variantTitle };
  }

  const titleMatch = title.match(
    /(?<title>\w+\s\w+)\s(?<flavour>\w+)|(?<product>\w+\s(?<type>[\w-]+))\s(?<flavour2>\w+)/
  );

  if (titleMatch.groups.type) {
    variantTitle = `${titleMatch.groups.type} ${titleMatch.groups.flavour2}`;
  } else {
    variantTitle = titleMatch.groups.flavour;
  }

  if (titleMatch.groups.product) {
    title = titleMatch.groups.product;
  } else {
    title = titleMatch.groups.title;
  }

  return {
    title,
    variantTitle
  };
}

// Format shipping address. Can be updated later to include more information.
function formatShippingAddress(shippingAddress) {
  const { address1, city, zip } = shippingAddress;

  return `${address1}, ${city}, ${zip}`;
}

function formatItems(lineItems, currency) {
  /**
   * First pass check if the item has a properties value which includes an unique key which reference it to the other items in the bundle.
   * If so we want to group these together.
   * The rest if no property found can be fall back to item.id as their unique value.
   */

  return Object.values(
    lineItems.reduce((results, lineItem) => {
      const uniqueID = lineItem.properties[0]?.value || lineItem.id;
      results[uniqueID] = results[uniqueID] || [];
      results[uniqueID].push(lineItem);

      return results;
    }, {})
  ).map(results => {
    /**
     * Now we have our items in a object we can map through them and find all the information we need to display.
     */

    const { id, image } = results[0];

    // Sort titles and variantTitles
    const itemInfo = results.map(result => {
      const { title, variant_title, quantity } = result;

      const productText = sortProductText(title, variant_title);
      const variantTitle = `${quantity}x ${
        productText.variantTitle ? productText.variantTitle : productText.title
      }`;

      return {
        title: productText.title,
        variantTitle
      };
    });

    const title = itemInfo[0].title;
    const info = itemInfo.map(item => item.variantTitle).join(', ');

    // If more than one product in the bundle keep add prices together
    const totalPrice = results
      .reduce((total, result) => {
        total += parseFloat(result.price) * parseInt(result.quantity);

        return total;
      }, 0)
      .toFixed(2);

    const data = {
      id: id,
      title,
      info,
      image: image,
      price: addCurrency(totalPrice, currency)
    };

    return data;
  }, []);
}

export function format(result) {
  const results = result[0].orders;
  console.log(results);
  const orders = results.map(order => {
    const {
      id,
      name,
      created_at,
      line_items,
      total_price,
      currency,
      shipping_address,
      appSubscriptionCreate
    } = order;
    const price = addCurrency(total_price, currency);
    const shippingAddress = formatShippingAddress(shipping_address);

    /**
     * Using momment for date and time.
     * Used Created at for dispatch date is this from? - https://shopify.dev/docs/admin-api/rest/reference/shipping-and-fulfillment/fulfillmentevent
     */

    const dispatchDate = moment(created_at).format('MMMM Do YYYY');

    // Format Items as some are bundles together.
    const items = formatItems(line_items, currency);

    /**
     * Check if the array returns appSubscriptionCreate - https://shopify.dev/tutorials/manage-subscriptions-with-billing-api
     * If not then a One-time purchase
     */

    const type =
      appSubscriptionCreate?.length > 0 ? 'Subscription' : 'One-time';

    return {
      id,
      number: name,
      price,
      shippingAddress,
      dispatchDate,
      items,
      type
    };
  });

  return orders;
}

export default {
  format
};
