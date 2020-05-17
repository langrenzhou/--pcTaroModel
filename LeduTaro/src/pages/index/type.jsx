import Taro, { Component } from "@tarojs/taro"
import { View, Text } from '@tarojs/components'
import axios from 'axios'
import { AtTabBar} from 'taro-ui'
import '../index/index.css'
class Type extends Component {
    constructor(props) {
        super(props)
        this.state = {
            current: this.$router.params.current?parseInt(this.$router.params.current):0,
            tabList: [],
            id: 6
        }
    }
    componentDidMount() {
        
        axios.get('http://localhost:8080/type').then(res => {
            const tabList = res.data.map(item => {
                return ({ title: item.type, id: item.id })
            })
            this.setState({ tabList: tabList })
        })
    }
    handleClick(e) {
        const types=this.state.tabList[e].id
        Taro.navigateTo({
            url:`/pages/index/index?types=${types}&current=${e}`
        })
    }
    render() {
        return (
            <View style={{ width: '100%', fontSize: '16px' }}>
                <AtTabBar
                    tabList={this.state.tabList}
                    onClick={this.handleClick.bind(this)}
                    current={this.state.current}
                />
            </View>
        )
    }
}
export default Type