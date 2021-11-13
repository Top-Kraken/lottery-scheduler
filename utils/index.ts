import moment from "moment";
import BigNumber from "bignumber.js";
import { CoinGeckoClient } from "coingecko-api-v3";

/**
 * Get the ticket price, based on current network, as $LuChow
 * Used by 'start-lottery' Hardhat script, only.
 */
export const getTicketPrice = async(
  usd: number,
  precision: number
): Promise<string> => {
  const client = new CoinGeckoClient({
    timeout: 10000,
    autoRetry: true,
  });
  const simplePrice = await client.simplePrice({
    vs_currencies: "usd", 
    ids: "lunachow"
  });
  
  const price: BigNumber = new BigNumber(simplePrice.lunachow.usd.toString());

  // Compute the ticket price (denominated in $Cake), to the required USD eq. value.
  const ticketPrice: BigNumber = new BigNumber(usd).div(price);

  // Return the ticket price, up to `n` decimals.
  return ticketPrice.toFixed(precision);
};
/**
 * Get the next lottery 'endTime', based on current date, as UTC.
 * Used by 'start-lottery' Hardhat script, only.
 */
 export const getEndTime = (): number => {
    // Get current date, as UTC.
    const now = moment().utc();
  
    // Get meridiem (AM/PM), based on current UTC Date.
    const meridiem = now.format("A");
    if (meridiem === "AM") {
      // We are in the morning (ante-meridiem), next lottery is at 12:00 PM (noon).
      return moment(`${now.format("MM DD YYYY")} 00:00:00 +0000`, "MM DD YYYY HH:mm:ss Z", true)
        .add(12, "hours")
        .startOf("hour")
        .utc()
        .unix();
    } else if (meridiem === "PM") {
      // We are in the afternoon (post-meridiem), next lottery is at 12:00 AM (midnight).
      return moment(`${now.format("MM DD YYYY")} 12:00:00 +0000`, "MM DD YYYY HH:mm:ss Z", true)
        .add(12, "hours")
        .startOf("hour")
        .utc()
        .unix();
    }
  
    throw new Error("Could not determine next Lottery end time.");
  };
  