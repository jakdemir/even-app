/**
 * Price Converter for WLD Token
 * Fetches real-time WLD price from CoinGecko API and converts USD to WLD
 */

const COINGECKO_API = 'https://api.coingecko.com/api/v3/simple/price?ids=worldcoin-wld&vs_currencies=usd';
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes
const FALLBACK_PRICE_USD = 2.00; // Fallback price if API fails

interface PriceCache {
    price: number;
    timestamp: number;
}

let priceCache: PriceCache | null = null;

/**
 * Fetches the current WLD price in USD from CoinGecko API
 * Implements 5-minute caching to avoid rate limits
 * Falls back to $2.00 USD if API fails
 */
export async function fetchWLDPrice(): Promise<number> {
    // Check cache first
    if (priceCache && Date.now() - priceCache.timestamp < CACHE_DURATION_MS) {
        console.log('💰 [PRICE] Using cached WLD price:', priceCache.price);
        return priceCache.price;
    }

    try {
        console.log('💰 [PRICE] Fetching WLD price from CoinGecko...');
        const response = await fetch(COINGECKO_API);

        if (!response.ok) {
            throw new Error(`CoinGecko API error: ${response.status}`);
        }

        const data = await response.json();
        const price = data['worldcoin-wld']?.usd;

        if (typeof price !== 'number' || price <= 0) {
            throw new Error('Invalid price data from API');
        }

        // Update cache
        priceCache = {
            price,
            timestamp: Date.now()
        };

        console.log('💰 [PRICE] Fetched WLD price:', price);
        return price;
    } catch (error) {
        console.error('💰 [PRICE] Error fetching WLD price, using fallback:', error);
        return FALLBACK_PRICE_USD;
    }
}

/**
 * Converts USD amount to WLD tokens
 * @param usdAmount - Amount in USD
 * @returns Amount in WLD tokens, rounded up to the nearest whole integer
 */
export async function convertUSDtoWLD(usdAmount: number): Promise<{ wldAmount: number; exchangeRate: number }> {
    const exchangeRate = await fetchWLDPrice();
    const wldAmount = usdAmount / exchangeRate;

    // Ceil to whole integer to prevent fractional WLD amounts
    // This ensures we always send enough WLD to cover the USD amount
    const ceiledWLD = Math.ceil(wldAmount);

    console.log(`💱 [CONVERSION] $${usdAmount} USD = ${ceiledWLD} WLD (rate: $${exchangeRate}/WLD, raw: ${wldAmount.toFixed(4)})`);

    return {
        wldAmount: ceiledWLD,
        exchangeRate
    };
}

/**
 * Clears the price cache (useful for testing)
 */
export function clearPriceCache(): void {
    priceCache = null;
}
