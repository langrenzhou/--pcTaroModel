import Taro from "@tarojs/taro-h5";
import Nerv from "nervjs";
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { View } from '@tarojs/components';
import AtComponent from '../../../../common/component';
export default class AtActionSheetItem extends AtComponent {
  constructor() {
    super(...arguments);
  }
  render() {
    const rootClass = classNames('at-action-sheet__item', this.props.className);
    return <View className={rootClass} onClick={this.handleClick}>
        {this.props.children}
      </View>;
  }
  handleClick = args => {
    if (typeof this.props.onClick === 'function') {
      this.props.onClick(args);
    }
  };
}
AtActionSheetItem.defaultProps = {
  onClick: () => {}
};
AtActionSheetItem.propTypes = {
  onClick: PropTypes.func
};