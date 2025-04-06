'use client'
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { createChart, ColorType, CandlestickSeries } from 'lightweight-charts';
import { getTokenCahrtData } from '@/request/token';
// import {generateData} from '@/util/sampleChart';
import dayjs from 'dayjs';
import {GlobalContext} from '@/context/global';
import {DownOutlined, FullscreenOutlined, StopOutlined, FullscreenExitOutlined} from '@ant-design/icons';
import { Dropdown, Spin, Button } from 'antd';
import clsx from 'clsx';

const INTERVAL_OPTIONS = [
  { label: '1m', key: '1' },
  { label: '5m', key: '5' },
  { label: '15m', key: '15' },
  { label: '30m', key: '30' },
  // { label: '45m', key: '45' },
  { label: '1h', key: '60' },
];

let socket
let isUserInit = false
const TradingChart = ({ tokenAddress }) => {
  const {onSocket, offSocket, sendMessage, user} = useContext(GlobalContext);
  const containerRef = useRef();
  const chartRef = useRef();
  const seriesRef = useRef();

  const [initData, setInitData] = useState([]);
  const [day, setDay] = useState(5);
  const [mode, setMode] = useState(0);
  const [realTime, setRealTime] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [interval, setInterval] = useState(1);
  const [hoveredData, setHoveredData] = useState(null);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const fetchChartData = async (dateRange) => {
    const date = dayjs();
    const data = dateRange || {startTime: date.subtract(5, 'd').startOf('d').valueOf(), endTime: date.endOf('d').valueOf()};
    socket.send(JSON.stringify({
      type: 'chart',
      data: {
        tokenAddress,
        ...data
      }
    }));
  };

  const initWS = () => {
    socket = new WebSocket(`ws://localhost:8100?userId=${user.userId}`);
    socket.onopen = () => {
      console.log('WebSocket Connected');
      fetchChartData();
      // setInterval(() => {
      //   socket.send(JSON.stringify({
      //     type: 'heart'
      //   }));
      // }, 5000)
    };
    socket.onmessage = (event) => {
      let res = JSON.parse(event.data);
      res = res.map((item) => {
        return {
          time: dayjs(item.time).unix(),
          open: Number(item.open),
          high: Number(item.high),
          low: Number(item.low),
          close: Number(item.close),
        };
      });
      setInitData(res);
    };
  }

  const staticData = (data, intv) => {
    if (intv === 1) return data;
    const res = [];
    let i = 0;
    let currentArr = [];
    for (const d of data) {
      currentArr.push(d);
      if ((dayjs(d.time * 1000).minute() % intv === 0 || currentArr.length >= intv) && currentArr.length > 0) {
        const open = currentArr[0].open;
        const close = currentArr[currentArr.length - 1].close;
        const high = Math.max(...currentArr.map(c => c.high));
        const low = Math.min(...currentArr.map(c => c.low));
        // const open = Math.random() * 100;
        // const close = Math.random() * 100;
        // const high = Math.max(open, close) + Math.random() * 10;
        // const low = Math.min(open, close) - Math.random() * 10;
        res.push({time: currentArr[currentArr.length - 1].time, open, close, high, low});
        currentArr = [];
      }
      i++;
    }
    return res;
  }

  const setVisibleRange = (chart, data) => {
    if (data.length < 30) {
      chart.timeScale().fitContent();
      return;
    };
    const startIndex = data.length - 30 < 0 ? 0 : data.length - 30;
    chart.timeScale().setVisibleRange({
      from: data[startIndex].time,
      to: data[data.length - 1].time,
    });
  }

  useEffect(() => {
    if (!chartRef.current) return;
    chartRef.current.applyOptions({
      width: containerRef.current.clientWidth,
      height: isFullscreen ? containerRef.current.clientHeight : 600,
    });
  }, [isFullscreen]);

  useEffect(() => {
    if (user && !socket && !isUserInit) {
      isUserInit = true
      initWS()
    }
  }, [user, tokenAddress]);

  useEffect(() => {
    if (initData.length === 0 || !chartRef.current || !seriesRef.current) return;

    const data = staticData(initData, interval);
    seriesRef.current.setData(data);
    setVisibleRange(chartRef.current, data);

    // chartRef.current.priceScale('right').applyOptions({
    //   minTick: 1e-8,
    //   minValue: 0,
    //   maxValue: 1e-6, 
    // });
    // chartRef.current.timeScale().fitContent();
    // chartRef.current.timeScale().scrollToPosition(5);
  }, [initData, interval]);

  useEffect(() => {
    const handleResize = () => {
      chart.applyOptions({ width: containerRef.current.clientWidth });
    };
  
    const chart = createChart(containerRef.current, {
      layout: {
        background: {
          type: ColorType.Solid,
          color: '#1B1D27'
        },
        width: '100%',
        textColor: '#eeeeee',
      },
      localization: {
        timeFormatter: businessDayOrTimestamp => {
          const str = dayjs(businessDayOrTimestamp * 1000).format('YYYY-MM-DD HH:mm');
          return str;
        }
      },
      grid: {
        vertLines: {
            color: '#333333',
        },
        horzLines: {
            color: '#333333',
        },
      },
      // priceScale: {
      //   labelFormatter: function (value) {
      //     console.log('priceScale', value);
      //     if (Math.abs(value) < 1e-6) {
      //         return value.toExponential(2);
      //     }
      //     return value.toFixed(8);
      //   },
      // },
      rightPriceScale: {
        textColor: '#eeeeee',
        // mode: 1,
        alignLabels: true,
        entireTextOnly: true,
        // labelFormatter: function (value) {
        //   console.log('right: ', value);
        //   if (Math.abs(value) < 1e-6) {
        //       return value.toExponential(2);
        //   }
        //   return value.toFixed(8);
        // },
      },
      timeScale: {
        labelColor: '#eeeeee',
        tickMarkFormatter: function (time, tickMarkType, locale) {
          const date = dayjs(time * 1000); 
          return date.format('HH:mm');
        },
      },
    });
    const newSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
      priceFormat: {
        type: 'price',
        precision: 3,
        minMove: 1e-3,
      },
      // autoscaleInfoProvider: original => {
      //   const res = original();
      //   if (res !== null) {
      //       res.priceRange.minValue -= 1e-8;
      //       res.priceRange.maxValue += 1e-8;
      //   }
      //   return res;
      // },
    });

    // const data = generateData(2500, 20, 1000);

    // console.log(data);

    const data = staticData(initData, interval);
    newSeries.setData(data);
    setVisibleRange(chart, data);
    // chart.priceScale('right').applyOptions({
    //   minTick: 1e-8,
    //   minValue: 0,
    //   maxValue: 1e-6, 
    // });

    chartRef.current = chart;
    seriesRef.current = newSeries;
    window.addEventListener('resize', handleResize);

    const realTime = localStorage.getItem('realTime');
    setRealTime(realTime === undefined ? true : JSON.parse(realTime));

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
      if (process.env.NODE_ENV === 'production') {
        socket?.close();
      }
    };
  }, []);

  useEffect(() => {
    if (!chartRef.current || !seriesRef.current) return;

    const handleCrosshairMove = (param) => {
      if (!param || !param.seriesData || param.seriesData.size === 0) {
        setHoveredData(null);
        return;
      }

      const data = param.seriesData.get(seriesRef.current);
      if (data) {
        const rate = (((data.close - data.open) / data.open) * 100).toFixed(2);
        setHoveredData({
          open: data.open,
          close: data.close,
          high: data.high,
          low: data.low,
          rate,
          div: data.close - data.open,
          color: data.close >= data.open ? '#26a69a' : '#ef5350', // 根据涨跌设置颜色
        });
      } else {
        setHoveredData(null);
      }
    };

    chartRef.current.subscribeCrosshairMove(handleCrosshairMove);

    return () => {
      // socket?.close()
      chartRef.current.unsubscribeCrosshairMove(handleCrosshairMove);
    };
  }, []);

  const listenRealTime = useCallback((item) => {
    if (item.tokenAddress === tokenAddress) {
      const d = {
        time: dayjs(item.timestamp || item.time).unix(),
        open: Number(item.startPrice),
        high: Number(item.maxPrice),
        low: Number(item.minPrice),
        close: Number(item.endPrice),
      };
      seriesRef.current?.update(d);
      chartRef.current?.timeScale().scrollToRealTime();
    }
  }, [tokenAddress]);

  const subRealTime = useCallback(() => {
    if (!tokenAddress) return;
    sendMessage('subToken', {address: tokenAddress});
    onSocket('price', listenRealTime);
  }, [listenRealTime, onSocket, sendMessage, tokenAddress]);

  const unsubRealTime = useCallback(() => {
    if (!tokenAddress) return;
    sendMessage('unsubToken', {address: tokenAddress});
    offSocket('price', listenRealTime);
  }, [listenRealTime, offSocket, sendMessage, tokenAddress]);

  useEffect(() => {
    if (realTime) {
      subRealTime();
    } else {
      unsubRealTime();
    }
    return () => {
      unsubRealTime();
    }
  }, [realTime, subRealTime, unsubRealTime]);

  const currentInterval = useMemo(() => {
    return INTERVAL_OPTIONS.find(i => i.key === interval);
  }, [interval]);

  return (
    <div className={clsx('flex flex-col w-full h-full relative', { 'fixed top-0 left-0 z-50 bg-black': isFullscreen })}>
      {loading && <Spin spinning={loading} className='absolute top-0 left-0 h-full w-full flex justify-center items-center z-20' />}
      <div className='flex w-full gap-2 px-2 border-b border-gray-500'>
        <div className='flex gap-2 flex-1'>
          <Dropdown
            menu={{
              items: INTERVAL_OPTIONS,
              onClick: ({key}) => {
                setInterval(key);
                if (key !== '1') {
                  setRealTime(false);
                }
              }
            }}
            trigger={['click']}
          >
            <Button type='text' className='w-fit border-0 m-0'>{currentInterval?.label ?? '1m'}</Button>
          </Dropdown>
        </div>
        <div className='w-full px-2 py-1 text-sm flex items-center' style={{ color: hoveredData?.color || '#888888', textAlign: 'left' }}>
          {hoveredData
            ? `O ${hoveredData.open} C ${hoveredData.close} H ${hoveredData.high} L ${hoveredData.low} ${hoveredData.div} (${hoveredData.rate})%`
            : (
              <span className='whitespace-nowrap'>
                O ∅ C ∅ H ∅ L ∅ (∅%)
              </span>
            )}
        </div>
        <div className='flex flex-1 gap-2 justify-end'>
          <Button
            className='m-0 p-2'
            type='text'
            icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
            onClick={toggleFullscreen}
          />
        </div>
      </div>
      <div className={clsx('w-full min-h-[600px]', {'flex-1': isFullscreen})} ref={containerRef} />
      <div className='flex w-full justify-between items-center px-2 py-1'>
        <div className='flex gap-2 flex-1'>
          <Button
            type={day === 1 ? 'default' : 'text'}
            onClick={() => {
              setDay(1);
              fetchChartData({startTime: dayjs().subtract(1, 'd').startOf('d').valueOf(), endTime: dayjs().endOf('d').valueOf()});
            }}
            className='text-white rounded-md m-0 p-2'
          >
            1D
          </Button>
          <Button
            type={day === 5 ? 'default' : 'text'}
            onClick={() => {
              setDay(5);
              fetchChartData({startTime: dayjs().subtract(5, 'd').startOf('d').valueOf(), endTime: dayjs().endOf('d').valueOf()})
            }}
            className='text-white rounded-md m-0 p-2'
          >
            5D
          </Button>
          <Button
            type={realTime ? 'primary' : 'text'}
            onClick={() => {
              setRealTime(!realTime);
              localStorage.setItem('realTime', !realTime);
            }}
            className='text-white p-2 rounded-md m-0'
          >
            Real Time
          </Button>
        </div>
        <div className='flex gap-2 flex-1 justify-end'>
          <Button
            className='m-0 p-2'
            type={mode === 0 ? 'default' : 'text'}
            onClick={() => {
              setMode(0);
              chartRef.current.applyOptions({rightPriceScale: {mode: 0}});
            }}
          >
            Normal
          </Button>
          <Button
            className='m-0 p-2'
            type={mode === 1 ? 'default' : 'text'}
            onClick={() => {
              setMode(1);
              chartRef.current.applyOptions({rightPriceScale: {mode: 1}});
            }}
          >
            L
          </Button>
          <Button
            className='m-0 p-2'
            type={mode === 2 ? 'default' : 'text'}
            onClick={() => {
              setMode(2);
              chartRef.current.applyOptions({rightPriceScale: {mode: 2}});
            }}
          >
            Percent
          </Button>
          <Button
            className='m-0 p-2'
            type={mode === 3 ? 'default' : 'text'}
            onClick={() => {
              setMode(3);
              chartRef.current.applyOptions({rightPriceScale: {mode: 3}});
            }}
          >
            Percent100
          </Button>
        </div>
      </div>
    </div>
  );
}

export default TradingChart;
