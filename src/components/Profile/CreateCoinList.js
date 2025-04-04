import { SingleCoinCard } from '@/app/(user)/home/page';
import { getTokenList } from '@/request/token';
import { Empty, Pagination } from 'antd';
import { Spin } from 'antd';
import { useEffect, useState } from 'react';

const CreateCoinList = ({ address, logoPrefix }) => {
  const [dataSource, setDataSource] = useState([]);

  const [total, setTotal] = useState(0);

  const [pageNo, setPageNo] = useState(1);

  const [loading, setLoading] = useState(false);

  const fetchList = async ({ page, address }) => {
    try {
      setLoading(true);
      const res = await getTokenList({ pageNo: page, address });
      setDataSource(res?.data || []);
      setTotal(res?.total || 0);
    } catch {
      // do something
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!address) {
      return;
    }
    fetchList({ page: pageNo, address });
  }, [pageNo, address]);

  const generateMainContent = () => {
    if (!dataSource?.length) {
      return (
        <Empty
          description='No Data'
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      );
    }

    return (
      <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
        {
          dataSource.map((item) => {
            return (
              <SingleCoinCard
                key={item.tokenId}
                record={item}
                logoPrefix={logoPrefix}
              />
            );
          })
        }
      </div>
    );
  };

  if (!address) {
    return (
      <div>
        No data
      </div>
    );
  }

  return (
    <div
      className='w-full'
    >
      <Spin spinning={loading}>
        <div>
          {generateMainContent()}
          {
            total > 0 ? (
              <Pagination
                current={pageNo}
                total={total}
                onChange={(page) => setPageNo(page)}
                size='small'
                showSizeChanger={false}
              />
            ) : null
          }
        </div>
      </Spin>
    </div>
  )
}

export default CreateCoinList;
