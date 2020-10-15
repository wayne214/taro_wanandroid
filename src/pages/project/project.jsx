import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import {View, Image, Swiper, SwiperItem, Text} from '@tarojs/components'
import ListView, { LazyBlock } from "taro-listview";
import './project.css'

let pageIndex = 0;
export default class Project extends Component {
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
    this.refList.fetchInit();
  }

  getData = async (pIndex = pageIndex) => {
    if (pIndex === 0) this.setState({ isLoaded: false });
    const {
      data: { data }
    } = await Taro.request({
      url: `https://www.wanandroid.com/article/listproject/${pIndex}/json`,
      data: {
        size: 10,
        curPage: pIndex
      }
    });
    console.log({ data });
    return { list: data.datas, hasMore: true, isLoaded: pIndex === 0 };
  };

  componentWillUnmount () { }
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
      </ListView>
      </View>
    )
  }

  render () {
    return (
      <View className='index'>
        {this._renderArticleList()}
      </View>
    )
  }
}
