import Nerv from "nervjs";
import Taro from "@tarojs/taro-h5";
import { View } from '@tarojs/components';
import axios from 'axios';
import NavBar from '../index/NavBar';
class Index extends Taro.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataContent: {}
    };
  }
  componentDidMount() {
    axios.get(`http://127.0.0.1:8080/details?id=${this.$router.params.id}`).then(res => {
      this.setState({ dataContent: res.data[0] });
    });
  }
  config = {
    navigationBarTitleText: `FM详情页`
  };
  render() {
    return <View className="index">
           <NavBar></NavBar>
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