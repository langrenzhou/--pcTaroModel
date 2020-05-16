import Taro from "@tarojs/taro-h5";
import Nerv from "nervjs";
import PropTypes from 'prop-types';
import { Text, View } from '@tarojs/components';
import AtComponent from '../../../common/component';
export default class AtCountdownItem extends AtComponent {
  formatNum(num) {
    return num <= 9 ? `0${num}` : `${num}`;
  }
  render() {
    const { num, separator } = this.props;
    return <View className="at-countdown__item">
        <View className="at-countdown__time-box">
          <Text className="at-countdown__time">{this.formatNum(num)}</Text>
        </View>
        <Text className="at-countdown__separator">{separator}</Text>
      </View>;
  }
}
AtCountdownItem.defaultProps = {
  num: 0,
  separator: ':'
};
AtCountdownItem.propTypes = {
  num: PropTypes.number.isRequired,
  separator: PropTypes.string
};