import Taro from "@tarojs/taro-h5";
import Nerv from "nervjs";
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { View } from '@tarojs/components';
import AtComponent from '../../common/component';
export default class AtFab extends AtComponent {
  onClick(e) {
    if (typeof this.props.onClick === 'function') {
      this.props.onClick(e);
    }
  }
  render() {
    const { size, className, children } = this.props;
    const rootClass = classNames('at-fab', className, {
      [`at-fab--${size}`]: size
    });
    return <View className={rootClass} onClick={this.onClick.bind(this)}>
        {children}
      </View>;
  }
}
AtFab.propTypes = {
  size: PropTypes.oneOf(['normal', 'small']),
  onClick: PropTypes.func
};
AtFab.defaultProps = {
  size: 'normal',
  onClick: () => {}
};