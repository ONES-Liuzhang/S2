import type { SimpleDataItem } from '@antv/s2';
import type { Node, S2CellType, TooltipShowOptions, ViewMeta } from '@antv/s2';

export interface CustomTooltipProps {
  cell: S2CellType<Node | ViewMeta>;
  defaultTooltipShowOptions?: TooltipShowOptions<React.ReactNode>;
  label?:
    | React.ReactNode
    | ((
        cell: S2CellType<Node | ViewMeta>,
        defaultLabel: React.ReactNode,
      ) => React.ReactNode);
  showOriginalValue?: boolean;
  renderDerivedValue?: (
    currentValue: SimpleDataItem,
    originalValue: SimpleDataItem,
    cell: S2CellType<Node | ViewMeta>,
  ) => React.ReactNode;
}
