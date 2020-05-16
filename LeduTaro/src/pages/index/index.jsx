import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import NavBar from './NavBar'
import './index.css'
class Index extends Component {
  componentDidMount() { }
  config = {
    navigationBarTitleText: '首页'
  }
  render() {
    return (
      <View className='index'>
        <NavBar />
      </View>
    )
  }
}
export default Index