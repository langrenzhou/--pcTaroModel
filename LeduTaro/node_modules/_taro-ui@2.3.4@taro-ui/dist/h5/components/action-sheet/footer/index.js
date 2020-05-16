import Taro from "@tarojs/taro-h5";
import Nerv from "nervjs";
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { View } from '@tarojs/components';
import AtComponent from '../../../common/component';
export default class AtActionSheetFooter extends AtComponent {
  constructor() {
    super(...arguments);
  }
  render() {
    const rootClass = classNames('at-action-sheet__footer', this.props.className);
    return <View onClick={this.handleClick} className={rootClass}>
        {this.props.children}
      </View>;
  }
  handleClick = (...args) => {
    if (typeof this.props.onClick === 'function') {
      this.props.onClick(...args);
    }
  };
}
AtActionSheetFooter.defaultProps = {
  onClick: () => {}
};
AtActionSheetFooter.propTypes = {
  onClick: PropTypes.func
};