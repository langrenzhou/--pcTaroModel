import Nerv from "nervjs";
import Taro from "@tarojs/taro-h5";
import { View } from '@tarojs/components';
import axios from 'axios';
import Contents from './content';
import { AtTabs, AtTabsPane } from 'taro-ui';
class Type extends Taro.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      tabList: [],
      id: 6
    };
  }
  componentDidMount() {
    axios.get('http://localhost:8080/type').then(res => {
      const tabList = res.data.map(item => {
        return { title: item.type, id: item.id };
      });
      this.setState({ tabList: tabList });
    });
  }
  handleClick(e) {
    this.setState({ current: e });
    const id = this.state.tabList[e].id;
    this.setState({ id: id });
  }
  render() {
    return <View style={{ width: '100%', fontSize: '16px' }}>
                <AtTabs current={this.state.current} scroll tabList={this.state.tabList} onClick={this.handleClick.bind(this)}>
                    {this.state.tabList.map((item, index) => <AtTabsPane key={item.id} current={this.state.current} index={index}>
                            <Contents types={item.id}></Contents>
                        </AtTabsPane>)}


                </AtTabs>
            </View>;
  }
}
export default Type;