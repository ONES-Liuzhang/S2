import React, { type FC } from 'react';
import { Radio, type RadioChangeEvent } from 'antd';
import cx from 'classnames';
// import { intl } from 'i18n';
import type { SortMethodType } from '@antv/s2';
import {
  type FieldDescriptionProps,
  FieldDescription,
} from '../mobile-description';

export interface OrderOption {
  sortMethod: 'ASC' | 'DESC' | 'GLOBAL_ASC' | 'GLOBAL_DESC';
  sortType: SortMethodType;
  name: string;
}

export interface CustomMeasureFieldDescriptionProps
  extends Omit<FieldDescriptionProps, 'footer'> {
  sortType: OrderOption['sortType'];
  onSortChange: (sort: OrderOption) => void;
  showSortAction: boolean;
  orderOption: OrderOption[];
}

export const CustomMeasureFieldDescription: FC<CustomMeasureFieldDescriptionProps> =
  React.memo(
    ({ showSortAction, sortType, onSortChange, orderOption, ...props }) => {
      const onChange = (e: RadioChangeEvent) => {
        const target = orderOption.find(
          (options) => options.sortType === e.target.value,
        );
        onSortChange(target);
      };

      return (
        <FieldDescription
          {...props}
          footer={
            showSortAction && (
              <div className={'fieldSort'}>
                <div className={'sortTitle'}> {'排序'}</div>
                <Radio.Group
                  className={'sortAction'}
                  defaultValue={sortType}
                  onChange={onChange}
                >
                  {orderOption.map((options) => (
                    <Radio.Button
                      key={options.sortType}
                      value={options.sortType}
                      className={cx('sortBtn', {
                        selected: sortType === options.sortType,
                      })}
                    >
                      {options.name}
                    </Radio.Button>
                  ))}
                </Radio.Group>
              </div>
            )
          }
        />
      );
    },
  );
