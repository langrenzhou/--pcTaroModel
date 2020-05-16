import Taro from "@tarojs/taro-h5";
import Nerv from "nervjs";
import classNames from 'classnames';
import { View } from '@tarojs/components';
import AtComponent from '../../../common/component';
export default class AtModalHeader extends AtComponent {
  render() {
    const rootClass = classNames('at-modal__header', this.props.className);
    return <View className={rootClass}>{this.props.children}</View>;
  }
}