import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { AtModal, AtModalContent, AtModalAction, AtTabs, AtTabsPane, AtInput, AtMessage, AtAvatar } from "taro-ui"
import axios from 'axios'
class Logins extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isOpened: false,
            current: 0,
            tabList: [{ title: "登录" }, { title: "注册" }],
            userName: '',
            passWord: '',
            nikName: '',
            userEmail: '',
            userLogins: true
        }

    }
    loginRegister() {
        if (this.state.current) {
            //register
            console.log('注册')
            if (this.state.userName == '') {
                Taro.atMessage({
                    'message': '用户名不能为空',
                    'type': 'error',
                })
            } else if (this.state.nikName == '') {
                Taro.atMessage({
                    'message': '昵称不能为空',
                    'type': 'error',
                })
            } else if (this.state.userEmail == '') {
                Taro.atMessage({
                    'message': '邮箱不能为空',
                    'type': 'error',
                })
            } else if (this.state.passWord == '') {
                Taro.atMessage({
                    'message': '密码不能为空',
                    'type': 'error',
                })
            } else {
                axios.post('http://127.0.0.1:8080/register', JSON.stringify({
                    userName: this.state.userName,
                    nikName: this.state.nikName,
                    userEmail: this.state.userEmail,
                    passWord: this.state.passWord,
                })).then(res => {
                    if (res.data == '该用户名已被注册') {
                        Taro.atMessage({
                            'message': '该用户名已被注册',
                            'type': 'error',
                        })
                    } else if (res.data == '该邮箱已被注册') {
                        Taro.atMessage({
                            'message': '该邮箱已被注册',
                            'type': 'error',
                        })
                    } else {
                        Taro.atMessage({
                            'message': '注册成功请进行登录',
                            'type': 'success',
                        })
                        this.setState({
                            current: 0
                        })
                    }


                })
            }
        } else {
            //login
            if (this.state.userName == '') {
                Taro.atMessage({
                    'message': '用户名不能为空',
                    'type': 'error',
                })

            } else if (this.state.passWord == '') {
                Taro.atMessage({
                    'message': '密码不能为空',
                    'type': 'error',
                })

            } else {
                axios.post("http://127.0.0.1:8080/login", JSON.stringify({
                    userName: this.state.userName,
                    passWord: this.state.passWord
                }
                )).then(res => {
                    //此时拿到登录的数据然后存储起来


                    if (res.data.length) {
                        Taro.atMessage({
                            'message': '登录成功',
                            'type': 'success',
                        })
                        const localStorageData = res.data[0]
                        localStorage.id = localStorageData.id
                        localStorage.userName = localStorageData.username
                        localStorage.avatar = localStorageData.avatar
                        this.setState({
                            isOpened: !this.state.isOpened,
                            userLogins: !this.state.userLogins,
                            userName: '',
                            passWord: '',
                            nikName: '',
                            userEmail: ''
                        })
                    } else {
                        Taro.atMessage({
                            'message': '登录失败，用户名或密码错误',
                            'type': 'error',
                        })
                    }

                })
            }
        }


    }
    render() {
        return(
            <View>
            <View>
                {
                    this.state.userLogins ?
                        <View><Text onClick={() => { this.setState({ isOpened: !this.state.isOpened }) }}> 登陆/注册 </Text>  </View> :
                        <View onClick={() => { Taro.navigateTo({url:'/pages/Anchor/anchor'}) }}>   <AtAvatar circle size='small'
                            image={localStorage.avatar}/></View>
                }
            </View>
            <AtModal isOpened={this.state.isOpened}>
                <AtModalContent>
                    <View>
                        <AtTabs current={this.state.current} scroll tabList={this.state.tabList} onClick={(e) => { this.setState({ current: e, userName: '', passWord: '', nikName: '', userEmail: '' }) }}>

                            <AtTabsPane current={this.state.current} index={0}>
                                <AtInput
                                    name='value'
                                    title='用户名:'
                                    type='text'
                                    placeholder='请输入您的用户名或者昵称'
                                    value={this.state.userName}
                                    onChange={(value) => { this.setState({ userName: value }); return value }}
                                />
                                <AtInput
                                    name='value'
                                    title='密码:'
                                    type='password'
                                    placeholder='请输入您的密码'
                                    value={this.state.passWord}
                                    onChange={(value) => { this.setState({ passWord: value }); return value }}
                                />
                            </AtTabsPane>
                            <AtTabsPane current={this.state.current} index={1}>
                                <AtInput
                                    name='value'
                                    title='用户名:'
                                    type='text'
                                    placeholder='请输入您的用户名'
                                    value={this.state.userName}
                                    onChange={(value) => { this.setState({ userName: value }); return value }}
                                />
                                <AtInput
                                    name='value'
                                    title='昵称:'
                                    type='text'
                                    placeholder='请输入您的昵称'
                                    value={this.state.nikName}
                                    onChange={(value) => { this.setState({ nikName: value }); return value }}
                                />
                                <AtInput
                                    name='value'
                                    title='邮箱:'
                                    type='text'
                                    placeholder='请输入您的邮箱'
                                    value={this.state.userEmail}
                                    onChange={(value) => { this.setState({ userEmail: value }); return value }}
                                />
                                <AtInput
                                    name='value'
                                    title='密码:'
                                    type='password'
                                    placeholder='请输入您的密码'
                                    value={this.state.passWord}
                                    onChange={(value) => { this.setState({ passWord: value }); return value }}
                                />
                            </AtTabsPane>
                        </AtTabs>
                    </View>
                </AtModalContent>
                <AtModalAction>
                    <Button onClick={() => { this.setState({ isOpened: !this.state.isOpened }) }}>取消</Button>
                    <AtMessage />
                    <Button onClick={this.loginRegister.bind(this)}>{this.state.current ? '注册' : "登录"}</Button>
                </AtModalAction>
            </AtModal>
        </View>
        )
    }
}
export default Logins