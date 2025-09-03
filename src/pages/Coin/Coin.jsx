import React, { useState, useEffect, useContext } from "react";
import "./Coin.css";
import { useParams } from "react-router-dom";
import { CoinContext } from "../../context/CoinContext";
import LineChart from "../../components/LineChart/LineChart";

const Coin = () => {
  const { coinId } = useParams();
  const [coinData, setCoinData] = useState(null);
  const [historicalData, setHistoricalData] = useState(null);
  const { currency } = useContext(CoinContext);

  const fetchCoinData = async () => {
    try {
      const options = { method: "GET", headers: { accept: "application/json" } };
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}`,
        options
      );
      const data = await res.json();
      setCoinData(data);
    } catch (err) {
      console.error("Error fetching coin:", err);
    }
  };

  const fetchHistoricalData = async () => {
    try {
      const options = { method: "GET", headers: { accept: "application/json" } };
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency.name}&days=10`,
        options
      );
      const data = await res.json();
      setHistoricalData(data);
    } catch (err) {
      console.error("Error fetching history:", err);
    }
  };

  useEffect(() => {
    fetchCoinData();
    fetchHistoricalData();
  }, [coinId, currency]);

  if (!coinData || !historicalData) {
    return (
      <div className="spinner">
        <div className="spin"></div>
      </div>
    );
  }

  return (
    <div className="coin">
      <div className="coin-name">
        <img src={coinData.image?.large} alt={coinData.name} />
        <p>
          <b>
            {coinData.name} ({coinData.symbol?.toUpperCase()})
          </b>
        </p>
      </div>

      <div className="coin-chart">
        <LineChart historicalData={historicalData} />
      </div>

      <div className="coin-info">
        <p>
          <b>Crypto Market Rank: </b>
          {coinData.market_cap_rank}
        </p>
        <p>
          <b>Current Price: </b>
          {currency.symbol}
          {coinData.market_data?.current_price[currency.name].toLocaleString()}
        </p>
        <p>
          <b>Market Cap: </b>
          {currency.symbol}
          {coinData.market_data?.market_cap[currency.name].toLocaleString()}
        </p>
        <p>
          <b>24h Change: </b>
          {coinData.market_data?.price_change_percentage_24h.toFixed(2)}%
        </p>
      </div>
    </div>
  );
};

export default Coin;
