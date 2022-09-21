import React, { useState } from 'react';
import { IconType, S2Event, SortMethodType } from '@antv/s2';
import type { SpreadSheet } from '@antv/s2';
import { SheetComponent } from '../index';
import type { SheetComponentsProps } from '../interface';
import { S2Drawer } from '../../mobile-drawer';
import { MobileSort, type OrderOption } from '../../mobile-sort';

// todo-zc: ref + forwardRef 学习
export const MobileSheet = React.forwardRef(
  (props: SheetComponentsProps, ref: React.MutableRefObject<SpreadSheet>) => {
    const [visible, setVisible] = useState(false);
    const [showSort, setShowSort] = useState(false);
    const [s2, setS2] = React.useState<SpreadSheet>();

    const bindEvents = (instance: SpreadSheet) => {
      // console.log(instance, 'instance');
      // console.log(ref?.current, 'ref.current');
      instance.on(S2Event.GLOBAL_ACTION_ICON_CLICK, (event, type) => {
        instance?.hideTooltip();
        // console.log('type', type);
        if (type === IconType.SortIcon) {
          setShowSort(true);
          setVisible(true);
        }
      });
    };
    const getMobileSpreadSheet = (instance: SpreadSheet) => {
      // console.log(instance, 'instance 111');

      setS2(instance);
      props.getSpreadSheet?.(instance);
      bindEvents(instance);
    };
    const orderOption: OrderOption[] = [
      {
        sortMethod: 'ASC',
        sortType: SortMethodType.ASC,
        name: '升序',
      },
      {
        sortMethod: 'DESC',
        sortType: SortMethodType.DESC,
        name: '降序',
      },
    ];

    const handleDrawer = () => {
      setVisible(!visible);
      // console.log('visible', visible);
    };
    return (
      <>
        <SheetComponent
          {...props}
          getSpreadSheet={getMobileSpreadSheet}
          ref={ref}
        />
        <S2Drawer visible={visible} title={'ddd'} onClose={handleDrawer}>
          <MobileSort
            showSortAction={showSort}
            sortType={SortMethodType.ASC}
            onSortChange={() => {}}
            orderOption={orderOption}
          />
        </S2Drawer>
      </>
    );
  },
);

export const MobileSheetComponent = React.memo(MobileSheet);
MobileSheetComponent.displayName = 'MobileSheetComponent';
