import Nerv from "nervjs";
import Taro from "@tarojs/taro-h5";
import { View, Text } from '@tarojs/components';
import IndexJpg from '../../assets/index.gif';
import Type from './type';
import { AtModal } from "taro-ui";


class NavBar extends Taro.Component {
  constructor() {
    super();
    this.state = {
      isOpened: false
    };
  }
  componentDidMount() {}
  login() {
    this.setState({ isOpened: true });
  }
  render() {
    return <View className="at-row">
                <View className="at-col at-col-.5"></View>
                <View className="at-col at-col-1">
                    <View className="LogoLeft">
                        <View>
                            <img src={IndexJpg} alt="聆听者" className="logo" />
                        </View>
                        <View>聆听者</View>
                    </View>

                </View>

                <View className="at-col at-col-9">
                    <Type typess={this.state.List}></Type>
                </View>

                <View className="at-col at-col-1 login">
                    <View onClick={this.login.bind(this)}>
                        <Text>登录/注册</Text>
                    </View>
                    <AtModal isOpened={this.state.isOpened} cancelText="取消" confirmText="确认"
        // onClose={this.handleClose}
        // onCancel={this.handleCancel}
        // onConfirm={this.handleConfirm}
        content="欢迎加入京东凹凸实验室\\n\\r欢迎加入京东凹凸实验室" />
                </View>
                <View className="at-col at-col-.5"></View>
            </View>;
  }
}
export default NavBar;