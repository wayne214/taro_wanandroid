import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import {View, WebView} from '@tarojs/components'
import './detail.css'

let pageIndex = 0;
export default class Detail extends Component {
  constructor(props) {
    super(props);

  }
  componentDidMount () {
  }

  componentWillUnmount () { }

  handleMessage = () => {

  }
  render () {
    return (
      <View className='index'>
        <WebView src='https://mp.weixin.qq.com/' onMessage={this.handleMessage} />
      </View>
    )
  }
}
