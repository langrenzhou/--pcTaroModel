import Nerv from "nervjs";
import Taro from "@tarojs/taro-h5";
import { View } from '@tarojs/components';
import NavBar from './NavBar';
import './index.css';
class Index extends Taro.Component {
  componentDidMount() {}
  config = {
    navigationBarTitleText: '首页'
  };
  render() {
    return <View className="index">
        <NavBar />
      </View>;
  }

  componentDidShow() {
    super.componentDidShow && super.componentDidShow();
  }

  componentDidHide() {
    super.componentDidHide && super.componentDidHide();
  }

}
export default Index;