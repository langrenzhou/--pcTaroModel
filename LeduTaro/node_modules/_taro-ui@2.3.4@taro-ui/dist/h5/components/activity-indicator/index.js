import Taro from "@tarojs/taro-h5";
import Nerv from "nervjs";
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Text, View } from '@tarojs/components';
import AtComponent from '../../common/component';
import AtLoading from '../loading/index';
export default class AtActivityIndicator extends AtComponent {
  render() {
    const { color, size, mode, content, isOpened } = this.props;
    const rootClass = classNames('at-activity-indicator', {
      'at-activity-indicator--center': mode === 'center',
      'at-activity-indicator--isopened': isOpened
    }, this.props.className);
    return <View className={rootClass}>
        <View className="at-activity-indicator__body">
          <AtLoading size={size} color={color} />
        </View>
        {content && <Text className="at-activity-indicator__content">{content}</Text>}
      </View>;
  }
}
AtActivityIndicator.defaultProps = {
  size: 0,
  mode: 'normal',
  color: '',
  content: '',
  className: '',
  isOpened: true
};
AtActivityIndicator.propTypes = {
  size: PropTypes.number,
  mode: PropTypes.string,
  color: PropTypes.string,
  content: PropTypes.string,
  className: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  isOpened: PropTypes.bool
};