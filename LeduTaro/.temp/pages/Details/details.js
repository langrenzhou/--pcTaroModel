import Nerv from "nervjs";
import Taro from "@tarojs/taro-h5";
import { View, Text } from '@tarojs/components';
class Index extends Taro.Component {
  constructor(props) {
    super(props);
    console.log(this.$router);
  }
  componentDidMount() {}
  config = {
    navigationBarTitleText: '详情'
  };
  render() {
    return <View className="index">
        <Text>
          这里是详情页
        </Text>
      </View>;
  }
}
export default Index;