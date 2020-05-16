import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
 class Index extends Component {
   constructor(props){
     super(props)
     console.log(this.$router)
   }
  componentDidMount () {}
  config = {
    navigationBarTitleText: '详情'
  }
  render () {
    return (
      <View className='index'>
        <Text>
          这里是详情页
        </Text>
      </View>
    )
  }
}
export default Index