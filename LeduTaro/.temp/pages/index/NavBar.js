import Nerv from "nervjs";
import Taro from "@tarojs/taro-h5";
import { View, Text, Button } from '@tarojs/components';
import IndexJpg from '../../assets/index.gif';
import Type from './type';
import { AtModal, AtModalContent, AtModalAction, AtTabs, AtTabsPane, AtInput } from "taro-ui";
import axios from 'axios';

class NavBar extends Taro.Component {
  constructor() {
    super();
    this.state = {
      isOpened: false,
      current: 0,
      tabList: [{ title: "登录" }, { title: "注册" }],
      userName: '',
      passWord: '',
      nikName: '',
      userEmail: ''
    };
  }
  componentDidMount() {}
  handleClick(e) {}
  loginRegister() {

    if (this.state.current) {

      console.log('此时是注册');
    } else {
      console.log('此时是登录');
      axios.post("http://127.0.0.1:8080/login", JSON.stringify({
        userName: this.state.userName,
        passWord: this.state.passWord
      })).then(res => {
        console.log(res);
      });
    }
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
                    <View onClick={() => {
          this.setState({ isOpened: !this.state.isOpened });
        }}>
                        <Text>登录/注册</Text>
                    </View>
                    <AtModal isOpened={this.state.isOpened}>
                        <AtModalContent>
                            <View>
                                <AtTabs current={this.state.current} scroll tabList={this.state.tabList} onClick={e => {
                this.setState({ current: e, userName: '', passWord: '', nikName: '', userEmail: '' });
              }}>
                               
                                    <AtTabsPane current={this.state.current} index={0}>
                                        <AtInput name="value" title="用户名:" type="text" placeholder="请输入您的用户名或者昵称" value={this.state.userName} onChange={value => {
                    this.setState({ userName: value });return value;
                  }} />
                                        <AtInput name="value" title="密码:" type="text" placeholder="请输入您的密码" value={this.state.passWord} onChange={value => {
                    this.setState({ passWord: value });return value;
                  }} />
                                    </AtTabsPane>
                                    <AtTabsPane current={this.state.current} index={1}>
                                        <AtInput name="value" title="用户名:" type="text" placeholder="请输入您的用户名" value={this.state.userName} onChange={value => {
                    this.setState({ userName: value });return value;
                  }} />
                                        <AtInput name="value" title="昵称:" type="text" placeholder="请输入您的昵称" value={this.state.nikName} onChange={value => {
                    this.setState({ nikName: value });return value;
                  }} />
                                        <AtInput name="value" title="邮箱:" type="text" placeholder="请输入您的邮箱" value={this.state.userEmail} onChange={value => {
                    this.setState({ userEmail: value });return value;
                  }} />
                                        <AtInput name="value" title="密码:" type="text" placeholder="请输入您的密码" value={this.state.passWord} onChange={value => {
                    this.setState({ passWord: value });return value;
                  }} />
                                    </AtTabsPane>
                                </AtTabs>
                            </View>
                        </AtModalContent>
                        <AtModalAction>
                            <Button onClick={() => {
              this.setState({ isOpened: !this.state.isOpened });
            }}>取消</Button>
                            <Button onClick={this.loginRegister.bind(this)}>{this.state.current ? '注册' : "登录"}</Button>
                        </AtModalAction>
                    </AtModal>
                </View>
                <View className="at-col at-col-.5"></View>
            </View>;
  }
}
export default NavBar;