import Nerv from "nervjs";
import Taro from "@tarojs/taro-h5";
import { View } from '@tarojs/components';
import axios from 'axios';
import { AtPagination, AtList, AtListItem } from 'taro-ui';
import RightTop from '../../assets/unnamed.jpg';
import RightBottom from '../../assets/halei.jpg';
class Content extends Taro.Component {
  constructor(props) {
    super(props);
    this.state = {
      List: [],
      current: 1,
      pages: 0,
      TopTenList: []
    };
  }
  content(page) {
    axios.get(`http://127.0.0.1:8080/content?id=${this.props.types}&page=${page}`).then(res => {
      this.setState({ List: res.data });
    });
  }
  componentDidMount() {
    axios.get(`http://127.0.0.1:8080/TopTen?id=${this.props.types}`).then(res => {
      this.setState({ TopTenList: res.data });
    });
    axios.get(`http://127.0.0.1:8080/pages?id=${this.props.types}`).then(res => {
      this.setState({ pages: res.data.length });
    });
    this.content(1);
  }
  jinru(e) {
    this.setState({ current: e.current });
    this.content(e.current);
  }
  render() {
    return <View className="content">
                <View className="contentLeft">
                    <View>
                        <ul>
                            {this.state.List.map(item => <li key={item.id}>
                                    <View className="artivles">
                                        <View className="artivlesLeft" onClick={() => {
                  Taro.navigateTo({ url: `/pages/Details/details?id=${item.id}&current=${this.$router.params.current ? this.$router.params.current : 0}` });
                }}>
                                            <img src={item.img_url}></img>
                                        </View>
                                        <View className="artivlesRight">
                                            <View className="title" onClick={() => {
                    Taro.navigateTo({ url: `/pages/Details/details?id=${item.id}&current=${this.$router.params.current ? this.$router.params.current : 0}` });
                  }}>{item.title}</View>
                                            <View className="ItemAuthor" onClick={() => {
                    Taro.navigateTo({ url: `/pages/Details/details?id=${item.id}&current=${this.$router.params.current ? this.$router.params.current : 0}` });
                  }}>
                                             {item.author}  {item.podcast}  {item.duration}  {item.play_time}次
                                            </View>
                                            <View className="ItemContent" onClick={() => {
                    Taro.navigateTo({ url: `/pages/Details/details?id=${item.id}&current=${this.$router.params.current ? this.$router.params.current : 0}` });
                  }} dangerouslySetInnerHTML={{ __html: item.content }}></View>
                                        </View>
                                    </View>
                                </li>)}
                        </ul>

                        <AtPagination icon total={this.state.pages} pageSize={10} current={this.state.current} onPageChange={this.jinru.bind(this)}>
                        </AtPagination>
                    </View>
                </View>
                <View className="contentRight">
                    <View>
                        <img src={RightTop}></img>

                    </View>
                    <View>
                        <View>
                            <h3>{this.props.titles}频道  Top 10</h3>
                        </View>
                        <AtList>
                            {this.state.TopTenList.map((item, index) => <AtListItem key={item.id} onClick={() => {
              Taro.navigateTo({ url: `/pages/Details/details?id=${item.id}&current=${this.$router.params.current ? this.$router.params.current : 0}` });
            }} title={`${index + 1}.${item.title}`} note={`文:${item.author}主播:${item.podcast}`} />)}
                        </AtList>

                    </View>
                    <View>
                        <img src={RightBottom}></img>
                    </View>
                </View>
            </View>;
  }
}
export default Content;