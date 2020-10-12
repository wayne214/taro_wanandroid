import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import {View, Image, Swiper, SwiperItem, Text} from '@tarojs/components'
import ListView, { LazyBlock } from "taro-listview";
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

    this.refList.fetchInit();
  }

  getData = async (pIndex = pageIndex) => {
    if (pIndex === 0) this.setState({ isLoaded: false });
    const {
      data: { data }
    } = await Taro.request({
      url: `https://www.wanandroid.com/article/list/${pIndex}/json`,
      data: {
        size: 10,
        curPage: pIndex
      }
    });
    console.log({ data });
    return { list: data.datas, hasMore: true, isLoaded: pIndex === 0 };
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

  refList = {};

  insRef = node => {
    this.refList = node;
  };

  pullDownRefresh = async () => {
    pageIndex = 0;
    const res = await this.getData(0);
    this.setState(res);
  };

  onScrollToLower = async fn => {
    const { list } = this.state;
    const { list: newList, hasMore } = await this.getData(++pageIndex);
    this.setState({
      list: list.concat(newList),
      hasMore
    });
    fn();
  };

  _renderArticleList = () => {
    const { isLoaded, error, hasMore, isEmpty, list } = this.state;

    return(
      <View className="list">
      <ListView
        lazy
        ref={node => this.insRef(node)}
        isLoaded={isLoaded}
        isError={error}
        hasMore={hasMore}
        style={{ height: "100vh" }}
        isEmpty={isEmpty}
        onPullDownRefresh={this.pullDownRefresh}
        onScrollToLower={this.onScrollToLower}
        lazyStorage='lazyView'
      >
        {list.length > 0 ? list.map((item, index) => {
          return (
            <View key={index}>
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
      </ListView>
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
