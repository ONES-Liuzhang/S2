import React, { type FC } from 'react';
import { Radio, type RadioChangeEvent } from 'antd';
import cx from 'classnames';
import type { SortMethodType, TooltipOperatorMenu } from '@antv/s2';
import './index.less';
import { i18n } from '@antv/s2';

export interface OrderOption {
  sortMethod: 'asc' | 'desc' | 'none';
  sortType: SortMethodType;
  name: string;
}

export interface MobileSortProps {
  orderOption: TooltipOperatorMenu[];
  showSortAction: boolean;
  sortType?: TooltipOperatorMenu['key'];
  onSortChange?: (sort: TooltipOperatorMenu) => void;
}

export const MobileSort: FC<MobileSortProps> = React.memo(
  ({ sortType = 'none', onSortChange, orderOption, showSortAction }) => {
    const onChange = (e: RadioChangeEvent) => {
      const target = orderOption.find(
        (options) => options.key === e.target.value,
      );
      onSortChange(target);
    };

    return (
      <div>
        {showSortAction && (
          <div className={'fieldSort'}>
            <div className={'sortTitle'}> {i18n('排序')}</div>
            <Radio.Group
              className={'sortAction'}
              defaultValue={sortType}
              onChange={onChange}
            >
              {orderOption.map((options) => (
                <Radio.Button
                  key={options.key}
                  value={options.key}
                  className={cx('sortBtn', {
                    selected: sortType === options.key,
                  })}
                >
                  {options.text}
                </Radio.Button>
              ))}
            </Radio.Group>
          </div>
        )}
      </div>
    );
  },
);
