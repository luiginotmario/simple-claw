---
name: price-tracker
description: Search products, compare prices across retailers, track price changes over time, and provide purchase links using PricesAPI.
metadata: {"openclaw":{"requires":{"env":["PRICESAPI_KEY"]},"primaryEnv":"PRICESAPI_KEY"}}
---

## Price Tracker & Shopping Assistant

You can help users find the best deals, compare prices, and track price changes over time.

### Searching for Products

When a user asks to find, search for, or buy a product, use `web_fetch` to search PricesAPI:

    web_fetch({ url: "https://api.pricesapi.io/api/v1/products/search?q=USER_QUERY&limit=5&api_key=${PRICESAPI_KEY}" })

Replace USER_QUERY with the URL-encoded product name the user is looking for.

Parse the JSON response. The response has this structure:
- `success`: boolean
- `data.query`: the search term
- `data.results`: array of products, each with `id`, `title`, `image`, `offerCount`
- `data.total`: total number of results

### Getting Price Offers

Once you have a product ID from search results, fetch current offers from retailers:

    web_fetch({ url: "https://api.pricesapi.io/api/v1/products/PRODUCT_ID/offers?country=us&api_key=${PRICESAPI_KEY}" })

Replace PRODUCT_ID with the numeric product ID from search results. Note: this endpoint performs real-time scraping and may take 5-30 seconds.

Each offer in `data.offers` includes:
- `seller`: retailer name
- `price`: numeric price
- `currency`: currency code (e.g., "USD")
- `url`: direct purchase link to the retailer
- `rating`: seller rating (if available)
- `stock`: availability status
- `delivery`: shipping information

Present results as a ranked list, cheapest first, with:
1. Seller name
2. Price
3. Stock/availability
4. Direct purchase link

Example response format:
"Here are the best deals I found for AirPods Pro:
1. **Amazon** — $189.99 (In Stock, Free delivery) → [Buy here](url)
2. **Best Buy** — $199.99 (In Stock) → [Buy here](url)
3. **Walmart** — $194.00 (Limited stock) → [Buy here](url)"

### Price History Tracking

When a user asks you to track a product's price or wants to know if now is a good time to buy:

1. Fetch current offers using the steps above
2. Store a price snapshot in memory with this format:
   - Product name and ID
   - Current date and time
   - Lowest price found and which seller
   - Number of offers available
3. Optionally set up a cron job to re-check prices daily and store new snapshots

When the user asks about price trends or whether to buy now:
1. Search memory for previous price snapshots of that product
2. Compare current price vs historical prices
3. Advise the user:
   - "Price dropped X% since [date] — good time to buy!"
   - "Price is stable at $X — safe to buy now"
   - "Price increased X% recently — consider waiting"
   - "This is the lowest price I've seen — buy now before it goes up"

### Supported Countries

Users can request prices from specific countries. Use the `country` parameter with these codes:

Americas: US, CA, BR, MX
Europe: UK, DE, FR, IT, ES, NL, SE, PL
Asia-Pacific: AU, JP, IN, SG, AE, SA

Default to `us` if the user doesn't specify a country. If the user mentions a country name, map it to the correct code (e.g., "United Kingdom" → "uk", "Germany" → "de").

### Important Notes

- The offers endpoint does real-time scraping, so response times of 5-30 seconds are normal. Let the user know you're checking prices.
- Always provide direct purchase links so the user can buy immediately.
- When comparing prices, mention the price difference in both dollars and percentage.
- If no results are found, suggest the user try different search terms or check a different country.
