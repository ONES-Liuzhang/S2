/* eslint-disable no-console */
import {
  Radio,
  Space,
  Switch,
  RadioChangeEvent,
  Tooltip,
  Select,
  Input,
  Popover,
  Slider,
  Button,
  Collapse,
  Tag,
  Tabs,
} from 'antd';
import React from 'react';
import ReactDOM from 'react-dom';
import {
  HeaderActionIconProps,
  S2Options,
  Node,
  S2DataConfig,
  TargetCellInfo,
  SpreadSheet,
  S2Event,
  TooltipAutoAdjustBoundary,
  customMerge,
  ThemeCfg,
  ViewMeta,
} from '@antv/s2';
import corePkg from '@antv/s2/package.json';
import { forEach, random } from 'lodash';
import { DataType } from '@antv/s2';
import {
  mockGridAnalysisOptions,
  mockGridAnalysisDataCfg,
} from '../__tests__/data/grid-analysis-data';
import {
  singleMeasure,
  multiMeasure,
} from '../__tests__/data/strategy-data.json';
import reactPkg from '../package.json';
import {
  pivotSheetDataCfg,
  s2Options as playgroundS2Options,
  sliderOptions,
  tableSheetDataCfg,
} from './config';
import { ResizeConfig } from './resize';
import { getSheetComponentOptions } from '@/utils';
import {
  SheetComponent,
  SheetType,
  PartDrillDown,
  PartDrillDownInfo,
} from '@/components';

import './index.less';
import 'antd/dist/antd.min.css';
import '@antv/s2/esm/style.css';

const { TabPane } = Tabs;
const fieldMap = {
  channel: ['物美', '华联'],
  sex: ['男', '女'],
};

const partDrillDown = {
  drillConfig: {
    dataSet: [
      {
        name: '销售渠道',
        value: 'channel',
        type: 'text',
      },
      {
        name: '客户性别',
        value: 'sex',
        type: 'text',
      },
    ],
  },
  // drillItemsNum: 1,
  fetchData: (meta, drillFields) =>
    new Promise<PartDrillDownInfo>((resolve) => {
      // 弹窗 -> 选择 -> 请求数据
      const preDrillDownfield =
        meta.spreadsheet.store.get('drillDownNode')?.field;
      const dataSet = meta.spreadsheet.dataSet;
      const field = drillFields[0];
      const rowDatas = dataSet
        .getMultiData(meta.query, true, true, [preDrillDownfield])
        .filter(
          (item) => item.sub_type && item.type && item[preDrillDownfield],
        );
      console.log(rowDatas);
      const drillDownData: DataType[] = [];
      forEach(rowDatas, (data: DataType) => {
        const { number, sub_type: subType, type } = data;
        const number0 = random(50, number);
        const number1 = number - number0;
        const dataItem0 = {
          ...meta.query,
          number: number0,
          sub_type: subType,
          type,
          [field]: fieldMap[field][0],
        };
        drillDownData.push(dataItem0);
        const dataItem1 = {
          ...meta.query,
          number: number1,
          sub_type: subType,
          type,
          [field]: fieldMap[field][1],
        };

        drillDownData.push(dataItem1);
      });
      console.log(drillDownData);
      resolve({
        drillField: field,
        drillData: drillDownData,
      });
    }),
} as PartDrillDown;

const CustomTooltip = () => (
  <div>
    自定义 Tooltip <div>1</div>
    <div>2</div>
  </div>
);

const CustomColTooltip = () => <div>custom colTooltip</div>;

const ActionIconTooltip = ({ name }) => <div>{name} Tooltip</div>;

const defaultOptions: S2Options = customMerge(
  getSheetComponentOptions({
    tooltip: {
      operation: {
        sort: true,
        tableSort: true,
        trend: true,
        hiddenColumns: true,
      },
    },
  }),
  playgroundS2Options,
);

function MainLayout() {
  const [render, setRender] = React.useState(true);
  const [sheetType, setSheetType] = React.useState<SheetType>('table');
  const [showPagination, setShowPagination] = React.useState(false);
  const [showTotals, setShowTotals] = React.useState(false);
  const [themeCfg, setThemeCfg] = React.useState<ThemeCfg>({ name: 'default' });
  const [showCustomTooltip, setShowCustomTooltip] = React.useState(false);
  const [adaptive, setAdaptive] = React.useState(false);
  const [options, setOptions] =
    React.useState<Partial<S2Options<React.ReactNode>>>(defaultOptions);
  const [dataCfg, setDataCfg] =
    React.useState<Partial<S2DataConfig>>(pivotSheetDataCfg);
  const [strategyDataCfg, setStrategyDataCfg] =
    React.useState<S2DataConfig>(singleMeasure);
  const s2Ref = React.useRef<SpreadSheet>();

  //  ================== Callback ========================
  const updateOptions = (newOptions: Partial<S2Options<React.ReactNode>>) => {
    setOptions(customMerge({}, options, newOptions));
  };

  const updateDataCfg = (newDataCfg: Partial<S2DataConfig>) => {
    const currentDataCfg =
      sheetType === 'pivot' ? pivotSheetDataCfg : tableSheetDataCfg;

    setDataCfg(customMerge({}, currentDataCfg, newDataCfg));
  };

  const onAutoAdjustBoundary = (value: TooltipAutoAdjustBoundary) => {
    updateOptions({
      tooltip: {
        autoAdjustBoundary: value || null,
      },
    });
  };

  const onLayoutWidthTypeChange = (e: RadioChangeEvent) => {
    updateOptions({
      style: {
        layoutWidthType: e.target.value,
      },
    });
  };

  const onSizeChange = (type: 'width' | 'height') => (e) => {
    updateOptions({
      [type]: e.target.value,
    });
  };

  const onScrollSpeedRatioChange =
    (type: 'horizontal' | 'vertical') => (value: number) => {
      updateOptions({
        interaction: {
          scrollSpeedRatio: {
            [type]: value,
          },
        },
      });
    };

  const onToggleRender = () => {
    setRender(!render);
  };

  const onThemeChange = (e: RadioChangeEvent) => {
    setThemeCfg(
      customMerge({}, themeCfg, {
        name: e.target.value,
      }),
    );
  };

  const onSheetTypeChange = (type: SheetType) => {
    setSheetType(type);
  };

  const logHandler =
    (name: string) => (cellInfo?: TargetCellInfo | ViewMeta) => {
      if (options.debug) {
        console.debug(name, cellInfo);
      }
    };

  const onColCellClick = (cellInfo: TargetCellInfo) => {
    logHandler('onColCellClick')(cellInfo);
    if (!options.showDefaultHeaderActionIcon) {
      const { event } = cellInfo;
      s2Ref.current.showTooltip({
        position: { x: event.clientX, y: event.clientY },
        content: <CustomColTooltip />,
      });
    }
  };

  //  ================== Hooks ========================

  React.useEffect(() => {
    s2Ref.current?.on(S2Event.DATA_CELL_TREND_ICON_CLICK, (meta) => {
      console.log('趋势图icon点击', meta);
    });
  }, [sheetType]);

  React.useEffect(() => {
    switch (sheetType) {
      case 'table':
        setDataCfg(tableSheetDataCfg);
        updateOptions(defaultOptions);
        break;
      default:
        setDataCfg(pivotSheetDataCfg);
        updateOptions(defaultOptions);
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sheetType]);

  //  ================== Config ========================

  const mergedOptions: Partial<S2Options<React.ReactNode>> = customMerge(
    {},
    {
      width: 600,
      height: 400,
      pagination: showPagination && {
        pageSize: 10,
        current: 1,
      },
      tooltip: {
        content: showCustomTooltip ? <CustomTooltip /> : null,
      },
      totals: showTotals && {
        row: {
          showGrandTotals: true,
          showSubTotals: true,
          subTotalsDimensions: ['province'],
        },
        col: {
          showGrandTotals: true,
          showSubTotals: true,
          subTotalsDimensions: ['type'],
        },
      },
      customSVGIcons: !options.showDefaultHeaderActionIcon && [
        {
          name: 'Filter',
          svg: 'https://gw.alipayobjects.com/zos/antfincdn/gu1Fsz3fw0/filter%26sort_filter.svg',
        },
        {
          name: 'FilterAsc',
          svg: 'https://gw.alipayobjects.com/zos/antfincdn/UxDm6TCYP3/filter%26sort_asc%2Bfilter.svg',
        },
      ],
      headerActionIcons: !options.showDefaultHeaderActionIcon && [
        {
          iconNames: ['Filter'],
          belongsCell: 'colCell',
          displayCondition: (node: Node) =>
            node.id !== 'root[&]家具[&]桌子[&]number',
          action: (props: HeaderActionIconProps) => {
            const { meta, event } = props;
            meta.spreadsheet.tooltip.show({
              position: { x: event.clientX, y: event.clientY },
              content: <ActionIconTooltip name="Filter colCell" />,
            });
          },
        },
        {
          iconNames: ['SortDown'],
          belongsCell: 'colCell',
          displayCondition: (node: Node) =>
            node.id === 'root[&]家具[&]桌子[&]number',
          action: (props: HeaderActionIconProps) => {
            const { meta, event } = props;
            meta.spreadsheet.tooltip.show({
              position: { x: event.clientX, y: event.clientY },
              content: <ActionIconTooltip name="SortDown colCell" />,
            });
          },
        },
        {
          iconNames: ['FilterAsc'],
          belongsCell: 'cornerCell',
          action: (props: HeaderActionIconProps) => {
            const { meta, event } = props;
            meta.spreadsheet.tooltip.show({
              position: { x: event.clientX, y: event.clientY },
              content: <ActionIconTooltip name="FilterAsc cornerCell" />,
            });
          },
        },
        {
          iconNames: ['SortDown', 'Filter'],
          belongsCell: 'rowCell',
          action: (props: HeaderActionIconProps) => {
            const { meta, event } = props;
            meta.spreadsheet.tooltip.show({
              position: { x: event.clientX, y: event.clientY },
              content: <ActionIconTooltip name="SortDown & Filter rowCell" />,
            });
          },
        },
      ],
    },
    options,
  );

  return (
    <div className="playground">
      <Tabs defaultActiveKey="basic">
        <TabPane tab="基础表" key="basic">
          <Collapse defaultActiveKey="filter">
            <Collapse.Panel header="筛选器" key="filter">
              <Space style={{ marginBottom: 20 }}>
                <Switch
                  checkedChildren="渲染组件"
                  unCheckedChildren="卸载组件"
                  defaultChecked={render}
                  onChange={onToggleRender}
                />
                <Switch
                  checkedChildren="调试模式开"
                  unCheckedChildren="调试模式关"
                  defaultChecked={mergedOptions.debug}
                  onChange={(checked) => {
                    updateOptions({ debug: checked });
                  }}
                />
                <Switch
                  checkedChildren="树形"
                  unCheckedChildren="平铺"
                  checked={mergedOptions.hierarchyType === 'tree'}
                  onChange={(checked) => {
                    updateOptions({
                      hierarchyType: checked ? 'tree' : 'grid',
                    });
                  }}
                />
                <Switch
                  checkedChildren="数值挂列头"
                  unCheckedChildren="数值挂行头"
                  defaultChecked={dataCfg.fields?.valueInCols}
                  onChange={(checked) => {
                    updateDataCfg({
                      fields: {
                        valueInCols: checked,
                      },
                    });
                  }}
                />
                <Switch
                  checkedChildren="冻结行头开"
                  unCheckedChildren="冻结行头关"
                  defaultChecked={mergedOptions.frozenRowHeader}
                  onChange={(checked) => {
                    updateOptions({
                      frozenRowHeader: checked,
                    });
                  }}
                />
                <Switch
                  checkedChildren="容器宽高自适应开"
                  unCheckedChildren="容器宽高自适应关"
                  defaultChecked={adaptive}
                  onChange={setAdaptive}
                />

                <Tooltip title="布局类型">
                  <Radio.Group
                    onChange={onLayoutWidthTypeChange}
                    defaultValue="adaptive"
                  >
                    <Radio.Button value="adaptive">行列等宽</Radio.Button>
                    <Radio.Button value="colAdaptive">列等宽</Radio.Button>
                    <Radio.Button value="compact">紧凑</Radio.Button>
                  </Radio.Group>
                </Tooltip>
                <Tooltip title="主题">
                  <Radio.Group onChange={onThemeChange} defaultValue="default">
                    <Radio.Button value="default">默认</Radio.Button>
                    <Radio.Button value="gray">简约灰</Radio.Button>
                    <Radio.Button value="colorful">多彩蓝</Radio.Button>
                  </Radio.Group>
                </Tooltip>
              </Space>
              <div>
                <Space>
                  <Tooltip title="开启后,点击空白处,按下ESC键, 取消高亮, 清空选中单元格, 等交互样式">
                    <Switch
                      checkedChildren="自动重置交互样式开"
                      unCheckedChildren="自动重置交互样式关"
                      defaultChecked={
                        mergedOptions?.interaction?.autoResetSheetStyle
                      }
                      onChange={(checked) => {
                        updateOptions({
                          interaction: {
                            autoResetSheetStyle: checked,
                          },
                        });
                      }}
                    />
                  </Tooltip>
                  <Tooltip title="tooltip 自动调整: 显示的tooltip超过指定区域时自动调整, 使其不遮挡">
                    <Select
                      defaultValue={mergedOptions.tooltip.autoAdjustBoundary}
                      onChange={onAutoAdjustBoundary}
                      style={{ width: 230 }}
                      size="small"
                    >
                      <Select.Option value="container">
                        container (表格区域)
                      </Select.Option>
                      <Select.Option value="body">
                        body (浏览器可视区域)
                      </Select.Option>
                      <Select.Option value="">关闭</Select.Option>
                    </Select>
                  </Tooltip>
                </Space>
                <Space style={{ marginLeft: 10 }}>
                  <Input
                    style={{ width: 150 }}
                    onChange={onSizeChange('width')}
                    defaultValue={mergedOptions.width}
                    suffix="px"
                    prefix="宽度"
                    size="small"
                  />
                  <Input
                    style={{ width: 150 }}
                    onChange={onSizeChange('height')}
                    defaultValue={mergedOptions.height}
                    suffix="px"
                    prefix="高度"
                    size="small"
                  />
                </Space>
                <Popover
                  placement="bottomRight"
                  content={
                    <>
                      <div style={{ width: '600px' }}>
                        水平滚动速率 ：
                        <Slider
                          {...sliderOptions}
                          defaultValue={
                            mergedOptions.interaction.scrollSpeedRatio
                              .horizontal
                          }
                          onChange={onScrollSpeedRatioChange('horizontal')}
                        />
                        垂直滚动速率 ：
                        <Slider
                          {...sliderOptions}
                          defaultValue={
                            mergedOptions.interaction.scrollSpeedRatio.vertical
                          }
                          onChange={onScrollSpeedRatioChange('vertical')}
                        />
                      </div>
                    </>
                  }
                >
                  <Button size="small" style={{ marginLeft: 20 }}>
                    滚动速率调整
                  </Button>
                </Popover>
              </div>
              <div style={{ marginTop: 20 }}>
                <Space size="middle">
                  <Switch
                    checkedChildren="显示序号"
                    unCheckedChildren="不显示序号"
                    checked={mergedOptions.showSeriesNumber}
                    onChange={(checked) => {
                      updateOptions({
                        showSeriesNumber: checked,
                      });
                    }}
                  />
                  <Switch
                    checkedChildren="分页"
                    unCheckedChildren="不分页"
                    checked={showPagination}
                    onChange={setShowPagination}
                  />
                  <Switch
                    checkedChildren="汇总"
                    unCheckedChildren="无汇总"
                    checked={showTotals}
                    onChange={setShowTotals}
                  />
                  <Switch
                    checkedChildren="选中聚光灯开"
                    unCheckedChildren="选中聚光灯关"
                    checked={mergedOptions.interaction.selectedCellsSpotlight}
                    onChange={(checked) => {
                      updateOptions({
                        interaction: {
                          selectedCellsSpotlight: checked,
                        },
                      });
                    }}
                  />
                  <Switch
                    checkedChildren="hover十字器开"
                    unCheckedChildren="hover十字器关"
                    checked={mergedOptions.interaction.hoverHighlight}
                    onChange={(checked) => {
                      updateOptions({
                        interaction: {
                          hoverHighlight: checked,
                        },
                      });
                    }}
                  />
                  <Switch
                    checkedChildren="默认actionIcons"
                    unCheckedChildren="自定义actionIcons"
                    checked={mergedOptions.showDefaultHeaderActionIcon}
                    onChange={(checked) => {
                      updateOptions({
                        showDefaultHeaderActionIcon: checked,
                      });
                    }}
                  />
                  <Switch
                    checkedChildren="开启Tooltip"
                    unCheckedChildren="关闭Tooltip"
                    checked={mergedOptions.tooltip.showTooltip}
                    onChange={(checked) => {
                      updateOptions({
                        tooltip: {
                          showTooltip: checked,
                        },
                      });
                    }}
                  />
                  <Switch
                    checkedChildren="自定义Tooltip"
                    unCheckedChildren="默认Tooltip"
                    checked={showCustomTooltip}
                    onChange={setShowCustomTooltip}
                  />
                  <Tooltip title="表格类型">
                    <Select
                      defaultValue={sheetType}
                      onChange={onSheetTypeChange}
                      style={{ width: 120 }}
                      size="small"
                    >
                      <Select.Option value="pivot">透视表</Select.Option>
                      <Select.Option value="table">明细表</Select.Option>
                    </Select>
                  </Tooltip>
                </Space>
              </div>
            </Collapse.Panel>
            <Collapse.Panel header="宽高调整热区配置" key="resize">
              <ResizeConfig setOptions={setOptions} setThemeCfg={setThemeCfg} />
            </Collapse.Panel>
          </Collapse>
          {render && (
            <SheetComponent
              key="basic"
              dataCfg={dataCfg as S2DataConfig}
              options={mergedOptions as S2Options}
              sheetType={sheetType}
              adaptive={adaptive}
              ref={s2Ref}
              themeCfg={themeCfg}
              partDrillDown={partDrillDown}
              header={{
                title: (
                  <a href="https://github.com/antvis/S2">
                    {reactPkg.name} playground
                  </a>
                ),
                description: (
                  <Space>
                    <span>
                      {reactPkg.name}: <Tag>{reactPkg.version}</Tag>
                    </span>
                    <span>
                      {corePkg.name}: <Tag>{corePkg.version}</Tag>
                    </span>
                  </Space>
                ),
                switcherCfg: { open: true },
                exportCfg: { open: true },
                advancedSortCfg: { open: true },
              }}
              onDataCellTrendIconClick={logHandler('onDataCellTrendIconClick')}
              onLoad={logHandler('onLoad')}
              onDestroy={logHandler('onDestroy')}
              onColCellClick={onColCellClick}
              onRowCellClick={logHandler('onRowCellClick')}
              onCornerCellClick={logHandler('onCornerCellClick')}
              onDataCellClick={logHandler('onDataCellClick')}
            />
          )}
        </TabPane>
        <TabPane tab="趋势分析表" key="strategy">
          <div style={{ margin: 20 }}>
            <Space size="middle">
              <Switch
                checkedChildren="多指标"
                unCheckedChildren="单指标"
                onChange={(checked) => {
                  const newDataCfg = checked ? multiMeasure : singleMeasure;
                  setStrategyDataCfg(newDataCfg);
                }}
              />
            </Space>
          </div>
          <SheetComponent
            dataCfg={strategyDataCfg}
            options={{ width: 1200, height: 400, cornerText: '指标' }}
            sheetType="strategy"
          />
        </TabPane>
        <TabPane tab="网格分析表" key="gridAnalysis">
          <SheetComponent
            dataCfg={mockGridAnalysisDataCfg}
            options={mockGridAnalysisOptions}
            sheetType="gridAnalysis"
          />
        </TabPane>
      </Tabs>
    </div>
  );
}

ReactDOM.render(<MainLayout />, document.getElementById('root'));