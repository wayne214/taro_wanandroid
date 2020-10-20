import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import {View, Image, Text, ScrollView,} from '@tarojs/components'
import './project.css'

let pageIndex = 0;
export default class Project extends Component {
  constructor(props) {
    super(props);
    this.state={
      list: [],
      isLoaded: false,
      error: false,
      hasMore: true,
      isEmpty: false,
      categories : [],
    }
  }
  componentDidMount () {
    this.getCategory();
    this.getData(0)
  }

  getCategory = async () => {
    const {
      data: { data }
    } = await Taro.request({
      url: 'https://www.wanandroid.com/project/tree/json'
    })

    console.log('--daa--', data)
    this.setState({
      categories : data
    })
  }
  getData = async (pIndex = pageIndex) => {
    Taro.request({
      url: `https://www.wanandroid.com/article/listproject/${pIndex}/json`,
      data: {
        size: 10,
        curPage: pIndex
      }
    }).then(res=>{
      if(res.statusCode === 200) {
        console.log('---列表数据--',res)
        const data = res.data.data
        this.setState({
          list: data.datas
        })
      }
    })
  };

  // or 使用箭头函数
  onScrollToUpper = () => {}

  onScroll(e){
    console.log(e.detail)
  }

  _renderArticleList = () => {
    const { isLoaded, error, hasMore, isEmpty, list } = this.state;

    const scrollStyle = {
      height: '1000px'
    }
    const scrollTop = 0
    const Threshold = 20

    return(
      <View className="list">
        <ScrollView
          className='scrollview'
          scrollY
          scrollWithAnimation
          scrollTop={scrollTop}
          style={scrollStyle}
          lowerThreshold={Threshold}
          upperThreshold={Threshold}
          onScrollToUpper={this.onScrollToUpper.bind(this)} // 使用箭头函数的时候 可以这样写 `onScrollToUpper={this.onScrollToUpper}`
          onScroll={this.onScroll}
        >
        {list.length > 0 ? list.map((item, index) => {
          return (
            <View key={index}>
              <View  style={{paddingTop: 10, paddingLeft:10, paddingRight: 10, width: '100%'}}>
                <Text style={{fontSize: 15, color:'#000000'}} className='list_item_title_text'>{item.title}</Text>
                <View className='descContainer'>
                  <Text className='text_desc' style={{fontSize: 12}}>{item.desc}</Text>
                  <Image src={item.envelopePic} className='hover_img' />
                </View>
                <View style={{flexDirection: "row", marginTop: 10}}>
                  <Text style={{fontSize: 12, color:'#2e2e2e'}}>{item.niceShareDate}</Text>
                  <Text style={{fontSize: 12, color:'#2e2e2e', marginLeft: 10}}>{item.author}</Text>
                </View>
              </View>
              <View style={{backgroundColor: '#00f',height: 10, marginTop: 10}} />
            </View>
          );
        }) : null
        }
      </ScrollView>
      </View>
    )
  }

  _renderHeader = () => {
    if(this.state.categories.length === 0) {
      return null
    }
    return(
      <ScrollView scrollX style={{height: '60px', width: '100%'}}>
        {this.state.categories.map(item=>{
          return <Text style={{fontSize: 12, color: '#000'}}>{item.name}</Text>
        })}
      </ScrollView>
    )
  }

  render () {
    return (
      <View className='index'>
        {this._renderHeader()}
        {this._renderArticleList()}
      </View>
    )
  }
}
