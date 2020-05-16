import Nerv from "nervjs";
import { __decorate } from "tslib";
import bind from 'bind-decorator';
import classnames from 'classnames';
import { Text, View } from '@tarojs/components';
import Taro from "@tarojs/taro-h5";
import * as constant from '../../common/constant';
const MAP = {
  [constant.TYPE_PRE_MONTH]: 'pre',
  [constant.TYPE_NOW_MONTH]: 'now',
  [constant.TYPE_NEXT_MONTH]: 'next'
};
export default class AtCalendarList extends Taro.Component {
  handleClick(item) {
    if (typeof this.props.onClick === 'function') {
      this.props.onClick(item);
    }
  }
  handleLongClick(item) {
    if (typeof this.props.onLongClick === 'function') {
      this.props.onLongClick(item);
    }
  }
  render() {
    const { list } = this.props;
    if (!list || list.length === 0) return null;
    return <View className="at-calendar__list flex">
        {list.map((item, index) => <View key={`list-item-${item.value}-${index}`} onClick={this.handleClick.bind(this, item)} onLongPress={this.handleLongClick.bind(this, item)} className={classnames('flex__item', `flex__item--${MAP[item.type]}`, {
        'flex__item--today': item.isToday,
        'flex__item--active': item.isActive,
        'flex__item--selected': item.isSelected,
        'flex__item--selected-head': item.isSelectedHead,
        'flex__item--selected-tail': item.isSelectedTail,
        'flex__item--blur': item.isDisabled || item.type === constant.TYPE_PRE_MONTH || item.type === constant.TYPE_NEXT_MONTH
      })}>
            <View className="flex__item-container">
              <View className="container-text">{item.text}</View>
            </View>
            <View className="flex__item-extra extra">
              {item.marks && item.marks.length > 0 ? <View className="extra-marks">
                  {item.marks.map((mark, key) => <Text key={key} className="mark">
                      {mark}
                    </Text>)}
                </View> : null}
            </View>
          </View>)}
      </View>;
  }
}
AtCalendarList.options = { addGlobalClass: true };
__decorate([bind], AtCalendarList.prototype, "handleClick", null);
__decorate([bind], AtCalendarList.prototype, "handleLongClick", null);