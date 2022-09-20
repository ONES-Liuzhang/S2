import './index.less';
import React, { type FC } from 'react';
import { Drawer } from 'antd';

export interface FieldDescriptionProps {
  visible: boolean;
  fieldInfos: {
    label: string;
    description?: string;
  }[];
  footer?: React.ReactNode;
  onClose?: () => void;
}

export const FieldDescription: FC<FieldDescriptionProps> = ({
  visible,
  fieldInfos,
  footer,
  onClose,
}) => {
  return (
    <Drawer
      visible={visible}
      width={315}
      title={null}
      closable={false}
      maskClosable={true}
      onClose={onClose}
    >
      <div className={'titles'}>
        {fieldInfos.map((info) => (
          <div key={info.label} className={'title'}>
            {info.label}
            {info.description && (
              <div className={'description'}>
                描述
                {info.description}
              </div>
            )}
          </div>
        ))}
      </div>

      {footer && <div className={'footer'}>{footer}</div>}
    </Drawer>
  );
};
