import Taro, { Component } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import axios from 'axios'
import { AtPagination } from 'taro-ui'
class Content extends Component {
    constructor(props) {
        super(props)
        this.state = {
            List: [],
            current: 1,
            pages:0,

        }
    }
    content(page) {
        axios.get(`http://127.0.0.1:8080/content?id=${this.props.types}&page=${page}`).then(res => {
            this.setState({ List: res.data })
        })
    }
    componentDidMount() {
        axios.get(`http://127.0.0.1:8080/pages?id=${this.props.types}`).then(res=>{
            this.setState({pages:res.data.length})
            
        })
        this.content(1)
    }
    jinru(e) {
        this.setState({current:e.current})
        this.content(e.current)
    }
    render() {
        return (
            <View className='content'>
                <View className='contentLeft'>
                    <View>
                        <ul>
                            {this.state.List.map((item) => (
                                <li key={item.id} >
                                    <View className='artivles'>
                                        <View className='artivlesLeft'>
                                            <img src={item.img_url}></img>
                                        </View>
                                        <View className='artivlesRight'>
                                            <View className='title'>{item.title}</View>
                                            <View className='ItemAuthor'>{item.author}&nbsp;&nbsp;{item.podcast}&nbsp;&nbsp;{item.duration}&nbsp;&nbsp;{item.play_time}次</View>
                                            <View className='ItemContent' dangerouslySetInnerHTML={{ __html: item.content }}></View>
                                        </View>
                                    </View>
                                </li>
                            ))}
                        </ul>

                        <AtPagination
                        icon
                            total={this.state.pages}
                            pageSize={10}
                            current={this.state.current}
                            onPageChange={this.jinru.bind(this)}	
                        >
                        </AtPagination>
                    </View>
                </View>
                <View className='contentRight'></View>
            </View>

        )
    }
}
export default Content