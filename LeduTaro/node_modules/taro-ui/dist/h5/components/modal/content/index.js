import Taro from "@tarojs/taro-h5";
import Nerv from "nervjs";
import classNames from 'classnames';
import { ScrollView } from '@tarojs/components';
import AtComponent from '../../../common/component';
export default class AtModalContent extends AtComponent {
  render() {
    const rootClass = classNames('at-modal__content', this.props.className);
    return <ScrollView scrollY className={rootClass}>
        {this.props.children}
      </ScrollView>;
  }
}