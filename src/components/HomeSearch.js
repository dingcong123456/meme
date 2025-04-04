import { Button, Input, ConfigProvider } from 'antd';
import { useEffect, useState } from 'react';

const HomeSearch = ({value, onChange}) => {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    setDisplayValue(value);
  }, [value]);
  
  const confirmValue = (val) => {
    if (onChange) {
      onChange(val);
    }
  };

  return (
    <div className='flex justify-center gap-2 mb-2'>
      <ConfigProvider
        theme={{
          components: {
            Input: {
              activeBorderColor: 'white'
            }
          }
        }}
      >
        <Input
          style={{
            width: 300
          }}
          value={displayValue}
          onChange={(e) => {
            setDisplayValue(e.target.value);
          }}
          placeholder='search for token'
          allowClear
          className='bg-primary text-base text-black'
          classNames={{
            input: 'placeholder:text-slate-400'
          }}
          onPressEnter={(e) => {
            confirmValue(e.target.value);
          }}
        />
        <Button
          type='primary'
          size='large'
          onClick={() => {
            confirmValue(displayValue);
          }}
        >
          Search
        </Button>
      </ConfigProvider>
    </div>
  )
}

export default HomeSearch;
