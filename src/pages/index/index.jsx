import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import {View, Image, Swiper, SwiperItem, Text, ScrollView} from '@tarojs/components'
import './index.css'

let pageIndex = 0;
export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state={
      bannerData: [],
      list: [],
      isLoaded: false,
      error: false,
      hasMore: true,
      isEmpty: false,
    }
  }
  componentDidMount () {
    Taro.request({
      url: 'https://www.wanandroid.com/banner/json'
    }).then(res=>{
        console.log('---Banner数据--',res)
        Taro.hideLoading()
      if(res.statusCode === 200) {
        const data = res.data.data
        this.setState({
          bannerData: data
        })
      }
      }
    )

    this.getData(0)
  }

  getData = async (pIndex = pageIndex) => {
    Taro.showLoading()
    Taro.request({
      url: `https://www.wanandroid.com/article/list/${0}/json`,
      data: {
        size: 10,
        curPage: 0
      }
    }).then(res => {
      Taro.hideLoading()
      if(res.statusCode === 200) {
        console.log('---列表数据--',res)
        const data = res.data.data
        this.setState({
          list: data.datas
        })
      }
    })
  };

  componentWillUnmount () { }

  _renderBanner = () => {
    const {bannerData} = this.state
    if(bannerData.length === 0) return null
    return <Swiper
      className='test-h'
      indicatorColor='#999'
      indicatorActiveColor='#333'
      vertical={false}
      circular
      indicatorDots
      autoplay
    >
      {
        bannerData.map((item)=>{
          return <SwiperItem>
            <Image src={item.imagePath} mode='scaleToFill' />
          </SwiperItem>
        })
      }
    </Swiper>
  }

  // or 使用箭头函数
  onScrollToUpper = () => {}

  onScroll(e){
    console.log(e.detail)
  }

  handleNavigate = () => {
    Taro.navigateTo({
      url: '/pages/detail/detail'
    })
  }

  _renderArticleList = () => {
    const { isLoaded, error, hasMore, isEmpty, list } = this.state;

    console.log('---list--',list.length)

    const scrollStyle = {
      height: '1000px'
    }
    const scrollTop = 0
    const Threshold = 20

    if(list.length === 0) return  null

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
            <View key={index} onClick={this.handleNavigate}>
              <View  style={{paddingTop: 10, paddingLeft:10, paddingRight: 10}}>
                <Text style={{fontSize: 12, color:'#f0f'}}>{item.title}</Text>
                <View style={{flexDirection: "row", marginTop: 20}}>
                  {item.fresh && <Text style={{color: 'red', fontSize: 12}}>新</Text>}
                  <Text style={{fontSize: 12, color:'#2e2e2e',marginLeft: 5}}>分享人:{item.shareUser}</Text>
                  <Text style={{fontSize: 12, color:'#2e2e2e',marginLeft: 10}}>分类:{item.chapterName}</Text>
                  <Text style={{fontSize: 12, color:'#2e2e2e',marginLeft: 10}}>时间:{item.niceShareDate}</Text>
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

  render () {
    return (
      <View className='index'>
        {this._renderBanner()}
        {this._renderArticleList()}
      </View>
    )
  }
}
