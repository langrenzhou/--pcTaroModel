import Taro, { Component } from "@tarojs/taro"
import { View } from '@tarojs/components'
import IndexJpg from '../../assets/index.gif'
import Type from './type'
import Logins from './login'
import Content from './content'
class NavBar extends Component {
    constructor() {
        super()
    }
    render() {
        return (
            <View className='at-row'>
                <View className='at-col at-col-.5'></View>
                <View className='at-col at-col-1'>
                    <View className='LogoLeft'>
                        <View>
                            <img src={IndexJpg} alt="聆听者" className='logo' />
                        </View>
                        <View>聆听者</View>
                    </View>
                </View>
                <View className='at-col at-col-9'>
                    <Type></Type>
                    {
                        this.$router.path=="/pages/index/index"?
                        <Content types={this.$router.params.types ? this.$router.params.types : '6'}></Content>:<View>详情页的内容</View>
                    }
                </View>
                <View className='at-col at-col-1 login'>
                    <View className='loginsss'>
                        <Logins></Logins>
                    </View>
                </View>
                <View className='at-col at-col-.5'></View>
            </View>
        )
    }
}
export default NavBar