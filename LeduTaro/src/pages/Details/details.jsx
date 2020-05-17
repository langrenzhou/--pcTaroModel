import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import axios from 'axios'
import NavBar from '../index/NavBar'
class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataContent: {},
    }
  }
  componentDidMount() {
    axios.get(`http://127.0.0.1:8080/details?id=${this.$router.params.id}`).then(res => {
      this.setState({ dataContent: res.data[0] })
    })
  }
  config = {
    navigationBarTitleText: `FM详情页`
  }
  render() {
    return (
      <View className='index'>
           <NavBar></NavBar>
      </View>
    )
  }
}
export default Index