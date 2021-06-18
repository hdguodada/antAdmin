import React from 'react';

export const Nav30DataSource = {
  wrapper: { className: 'header3 home-page-wrapper jzih1dpqqrg-editor_css' },
  page: { className: 'home-page' },
  logo: {
    className: 'header3-logo jzjgnya1gmn-editor_css',
    children:
      'https://gw.alipayobjects.com/mdn/rms_ae7ad9/afts/img/A*-J8NSLj9rbsAAAAAAAAAAABkARQnAQ',
  },
  Menu: {
    className: 'header3-menu',
    children: [
      {
        name: 'item1',
        className: 'header3-item',
        children: {
          href: '#',
          children: [{ children: <p>订订群</p>, name: 'text' }],
        },
        subItem: [
          {
            className: 'item-sub',
            children: {
              className: 'item-sub-item jzj8295azrs-editor_css',
              children: [
                {
                  name: 'image0',
                  className: 'item-image jzj81c9wabh-editor_css',
                  children:
                    'https://gw.alipayobjects.com/mdn/rms_ae7ad9/afts/img/A*4_S6ToPfj-QAAAAAAAAAAABkARQnAQ',
                },
              ],
            },
            name: 'sub~jzj8hceysgj',
          },
        ],
      },
      {
        name: 'item2',
        className: 'header3-item',
        children: {
          href: '#',
          children: [{ children: <p>帮助中心</p>, name: 'text' }],
        },
      },
    ],
  },
  mobileMenu: { className: 'header3-mobile-menu' },
};
export const Banner50DataSource = {
  wrapper: { className: 'home-page-wrapper banner5' },
  page: { className: 'home-page banner5-page' },
  childWrapper: {
    className: 'banner5-title-wrapper',
    children: [
      { name: 'title', children: '全释爱云在线ERP', className: 'banner5-title' },
      {
        name: 'explain',
        className: 'banner5-explain',
        children: '企业智慧云， 5万+企业, 60万Sales青睐之选',
      },
      {
        name: 'content',
        className: 'banner5-content',
        children: <div>
          <p>①销售和客户管理的CRM</p>
          <p> ②通讯的整合采集，集成固话、手机、邮件等客户沟通</p>
          <p>③进销存</p>
          <p>④基于定位的外勤管理</p>
          <p>⑤专攻企业收支流水的电子账本</p>
          <p>⑥业绩联动的薪资工具</p>
        </div>,
      },
      {
        name: 'button',
        className: 'banner5-button-wrapper',
        children: {
          href: '#/desktop',
          className: 'banner5-button',
          type: 'primary',
          children: '开始使用',
        },
      },
    ],
  },
  image: {
    className: 'banner5-image',
    children:
      'https://gw.alipayobjects.com/mdn/rms_ae7ad9/afts/img/A*-wAhRYnWQscAAAAAAAAAAABkARQnAQ',
  },
};
export const Feature60DataSource = {
  wrapper: { className: 'home-page-wrapper feature6-wrapper' },
  OverPack: { className: 'home-page feature6', playScale: 0.3 },
  Carousel: {
    className: 'feature6-content',
    dots: false,
    wrapper: { className: 'feature6-content-wrapper' },
    titleWrapper: {
      className: 'feature6-title-wrapper',
      barWrapper: {
        className: 'feature6-title-bar-wrapper',
        children: { className: 'feature6-title-bar' },
      },
      title: { className: 'feature6-title' },
    },
    children: [
      {
        title: { className: 'feature6-title-text', children: '服务指标' },
        className: 'feature6-item',
        name: 'block0',
        children: [
          {
            md: 8,
            xs: 24,
            className: 'feature6-number-wrapper',
            name: 'child0',
            number: {
              className: 'feature6-number',
              unit: { className: 'feature6-unit', children: '' },
              toText: true,
              children: '53',
            },
            children: { className: 'feature6-text', children: '行业' },
          },
          {
            md: 8,
            xs: 24,
            className: 'feature6-number-wrapper',
            name: 'child1',
            number: {
              className: 'feature6-number',
              unit: { className: 'feature6-unit', children: '' },
              toText: true,
              children: '52000+',
            },
            children: { className: 'feature6-text', children: '企业' },
          },
          {
            md: 8,
            xs: 24,
            className: 'feature6-number-wrapper',
            name: 'child2',
            number: {
              className: 'feature6-number',
              unit: { className: 'feature6-unit', children: '亿' },
              toText: true,
              children: '3.2',
            },
            children: { className: 'feature6-text', children: '数据总量' },
          },
        ],
      },
      // {
      //   title: { className: 'feature6-title-text', children: '服务指标' },
      //   className: 'feature6-item',
      //   name: 'block1',
      //   children: [
      //     {
      //       md: 8,
      //       xs: 24,
      //       name: 'child0',
      //       className: 'feature6-number-wrapper',
      //       number: {
      //         className: 'feature6-number',
      //         unit: { className: 'feature6-unit', children: '万' },
      //         toText: true,
      //         children: '116',
      //       },
      //       children: { className: 'feature6-text', children: '模型数据' },
      //     },
      //     {
      //       md: 8,
      //       xs: 24,
      //       name: 'child1',
      //       className: 'feature6-number-wrapper',
      //       number: {
      //         className: 'feature6-number',
      //         unit: { className: 'feature6-unit', children: '亿' },
      //         toText: true,
      //         children: '1.17',
      //       },
      //       children: { className: 'feature6-text', children: '模型迭代数量' },
      //     },
      //     {
      //       md: 8,
      //       xs: 24,
      //       name: 'child2',
      //       className: 'feature6-number-wrapper',
      //       number: {
      //         className: 'feature6-number',
      //         unit: { className: 'feature6-unit', children: '亿' },
      //         toText: true,
      //         children: '2.10',
      //       },
      //       children: { className: 'feature6-text', children: '训练样本数量' },
      //     },
      //   ],
      // },
    ],
  },
};
export const Feature70DataSource = {
  wrapper: { className: 'home-page-wrapper feature7-wrapper' },
  page: { className: 'home-page feature7' },
  OverPack: { playScale: 0.3 },
  titleWrapper: {
    className: 'feature7-title-wrapper',
    children: [
      {
        name: 'title',
        className: 'feature7-title-h1',
        children: '给销售团队一颗云大脑',
      },
      {
        name: 'content',
        className: 'feature7-title-content',
        children: '如何从跟单过程中提升签约率？如何建立公允竞争的团队规则？更多CRM功能亲自试用体验',
      },
    ],
  },
  blockWrapper: {
    className: 'feature7-block-wrapper',
    gutter: 24,
    children: [
      {
        md: 6,
        xs: 24,
        name: 'block0',
        className: 'feature7-block',
        children: {
          className: 'feature7-block-group',
          children: [
            {
              name: 'image',
              className: 'feature7-block-image',
              children:
                'https://gw.alipayobjects.com/zos/basement_prod/e339fc34-b022-4cde-9607-675ca9e05231.svg',
            },
            {
              name: 'title',
              className: 'feature7-block-title',
              children: '跟单神器: 客户视图',
            },
            {
              name: 'content',
              className: 'feature7-block-content',
              children: '只用一个界面，解决9成跟单问题',
            },
          ],
        },
      },
      {
        md: 6,
        xs: 24,
        name: 'block1',
        className: 'feature7-block',
        children: {
          className: 'feature7-block-group',
          children: [
            {
              name: 'image',
              className: 'feature7-block-image',
              children:
                'https://gw.alipayobjects.com/zos/basement_prod/e339fc34-b022-4cde-9607-675ca9e05231.svg',
            },
            {
              name: 'title',
              className: 'feature7-block-title',
              children: '大单专用: 销售机会',
            },
            {
              name: 'content',
              className: 'feature7-block-content',
              children: '面向阶段管控长单，有效！',
            },
          ],
        },
      },
      {
        md: 6,
        xs: 24,
        name: 'block2',
        className: 'feature7-block',
        children: {
          className: 'feature7-block-group',
          children: [
            {
              name: 'image',
              className: 'feature7-block-image',
              children:
                'https://gw.alipayobjects.com/zos/basement_prod/e339fc34-b022-4cde-9607-675ca9e05231.svg',
            },
            {
              name: 'title',
              className: 'feature7-block-title',
              children: '合同.订单.店面单.维修单',
            },
            {
              name: 'content',
              className: 'feature7-block-content',
              children: '合约掌控，保障应收和交付',
            },
          ],
        },
      },
      {
        md: 6,
        xs: 24,
        name: 'block3',
        className: 'feature7-block',
        children: {
          className: 'feature7-block-group',
          children: [
            {
              name: 'image',
              className: 'feature7-block-image',
              children:
                'https://gw.alipayobjects.com/zos/basement_prod/e339fc34-b022-4cde-9607-675ca9e05231.svg',
            },
            {
              name: 'title',
              className: 'feature7-block-title',
              children: '财务引擎',
            },
            {
              name: 'content',
              className: 'feature7-block-content',
              children: '应收.已收.应付.已付 合约,回款,应收,客户动态财务数据',
            },
          ],
        },
      },
      {
        md: 6,
        xs: 24,
        name: 'block4',
        className: 'feature7-block',
        children: {
          className: 'feature7-block-group',
          children: [
            {
              name: 'image',
              className: 'feature7-block-image',
              children:
                'https://gw.alipayobjects.com/zos/basement_prod/e339fc34-b022-4cde-9607-675ca9e05231.svg',
            },
            {
              name: 'title',
              className: 'feature7-block-title',
              children: '丰富工具',
            },
            {
              name: 'content',
              className: 'feature7-block-content',
              children: '听说日报,客户公海,销售目标 光荣榜,知识库,SFA,线索挖掘',
            },
          ],
        },
      },
    ],
  },
};
export const Feature00DataSource = {
  wrapper: { className: 'home-page-wrapper content0-wrapper' },
  page: { className: 'home-page content0' },
  OverPack: { playScale: 0.3, className: '' },
  titleWrapper: {
    className: 'title-wrapper',
    children: [{ name: 'title', children: '为老板设计的电子账本' }],
  },
  childWrapper: {
    className: 'content0-block-wrapper',
    children: [
      {
        name: 'block0',
        className: 'jzjn8afnsxb-editor_css content0-block',
        md: 6,
        xs: 24,
        children: {
          className: 'content0-block-item jzjgrrupf2c-editor_css',
          children: [
            {
              name: 'image',
              className: 'content0-block-icon jzjgrlz134-editor_css',
              children:
                'http://www.xtools.cn/home3/images/acc_img1.png',
            },
            {
              name: 'title',
              className: 'content0-block-title jzj8xt5kgv7-editor_css',
              children: '仿真电子账本',
            },
            {
              name: 'content',
              children: '保持纸账阅读习惯，学习成本低',
              className: 'jzj8z9sya9-editor_css',
            },
          ],
        },
      },
      {
        name: 'block1',
        className: 'content0-block',
        md: 6,
        xs: 24,
        children: {
          className: 'content0-block-item',
          children: [
            {
              name: 'image',
              className: 'content0-block-icon jzjncn210ql-editor_css',
              children:
                'http://www.xtools.cn/home3/images/acc_img2.png',
            },
            {
              name: 'title',
              className: 'content0-block-title jzjne54fwqm-editor_css',
              children: '专攻流水和盈亏',
            },
            {
              name: 'content',
              children: '老板看得懂，盈亏了于胸这是最真实的企业收支你懂的',
            },
          ],
        },
      },
      {
        name: 'block2',
        className: 'content0-block',
        md: 6,
        xs: 24,
        children: {
          className: 'content0-block-item',
          children: [
            {
              name: 'image',
              className: 'content0-block-icon jzjndq0dueg-editor_css',
              children:
                'http://www.xtools.cn/home3/images/acc_img3.png',
            },
            {
              name: 'title',
              className: 'content0-block-title jzjne24af8c-editor_css',
              children: '精于分析',
            },
            {
              name: 'content',
              children: '分布分析、同比环比的趋势分析全是自动的！财务MM不再抱怨',
            },
          ],
        },
      },
      {
        name: 'block~jzjn87bmyc7',
        className: 'content0-block',
        md: 6,
        xs: 24,
        children: {
          className: 'content0-block-item',
          children: [
            {
              name: 'image',
              className: 'content0-block-icon jzjndsyw8sf-editor_css',
              children:
                'http://www.xtools.cn/home3/images/acc_img4.png',
            },
            {
              name: 'title',
              className: 'content0-block-title jzjndw5oerk-editor_css',
              children: '卓尔不群',
            },
            {
              name: 'content',
              children: '国内鲜有这样懂老板的软件',
            },
          ],
        },
      },
    ],
  },
};
export const Feature80DataSource = {
  wrapper: { className: 'home-page-wrapper feature8-wrapper' },
  page: { className: 'home-page feature8' },
  OverPack: { playScale: 0.3 },
  titleWrapper: {
    className: 'feature8-title-wrapper',
    children: [
      { name: 'title', className: 'feature8-title-h1', children: '增加20%-50%盈利能力！' },
    ],
  },
  childWrapper: {
    className: 'feature8-button-wrapper',
    children: [
      {
        name: 'button',
        className: 'feature8-button',
        children: { href: '#', children: '立即体验' },
      },
    ],
  },
  Carousel: {
    dots: false,
    className: 'feature8-carousel',
    wrapper: { className: 'feature8-block-wrapper' },
    children: {
      className: 'feature8-block',
      titleWrapper: {
        className: 'feature8-carousel-title-wrapper',
        title: { className: 'feature8-carousel-title' },
      },
      children: [
        {
          name: 'block0',
          className: 'feature8-block-row',
          gutter: 120,
          title: {
            className: 'feature8-carousel-title-block',
            children: '平台自主训练流程',
          },
          children: [
            {
              className: 'feature8-block-col',
              md: 6,
              xs: 24,
              name: 'child0',
              arrow: {
                className: 'feature8-block-arrow',
                children:
                  'https://gw.alipayobjects.com/zos/basement_prod/167bee48-fbc0-436a-ba9e-c116b4044293.svg',
              },
              children: {
                className: 'feature8-block-child',
                children: [
                  {
                    name: 'image',
                    className: 'feature8-block-image',
                    children:
                      'https://gw.alipayobjects.com/zos/basement_prod/d8933673-1463-438a-ac43-1a8f193ebf34.svg',
                  },
                  {
                    name: 'title',
                    className: 'feature8-block-title',
                    children: '过程管控提升签约率',
                  },
                  {
                    name: 'content',
                    className: 'feature8-block-content',
                    children: '研究表明：过程管理比结果管理至少提升签约率20到50个百分点',
                  },
                ],
              },
            },
            {
              className: 'feature8-block-col',
              md: 6,
              xs: 24,
              name: 'child1',
              arrow: {
                className: 'feature8-block-arrow',
                children:
                  'https://gw.alipayobjects.com/zos/basement_prod/167bee48-fbc0-436a-ba9e-c116b4044293.svg',
              },
              children: {
                className: 'feature8-block-child',
                children: [
                  {
                    name: 'image',
                    className: 'feature8-block-image',
                    children:
                      'https://gw.alipayobjects.com/zos/basement_prod/d8933673-1463-438a-ac43-1a8f193ebf34.svg',
                  },
                  {
                    name: 'title',
                    className: 'feature8-block-title',
                    children: '财务引擎保障应收款',
                  },
                  {
                    name: 'content',
                    className: 'feature8-block-content',
                    children:
                      '收回该收的钱，是成本最低的增长，智能应收可有效降低呆账比例3成以上',
                  },
                ],
              },
            },
            {
              className: 'feature8-block-col',
              md: 6,
              xs: 24,
              name: 'child2',
              arrow: {
                className: 'feature8-block-arrow',
                children:
                  'https://gw.alipayobjects.com/zos/basement_prod/167bee48-fbc0-436a-ba9e-c116b4044293.svg',
              },
              children: {
                className: 'feature8-block-child',
                children: [
                  {
                    name: 'image',
                    className: 'feature8-block-image',
                    children:
                      'https://gw.alipayobjects.com/zos/basement_prod/d8933673-1463-438a-ac43-1a8f193ebf34.svg',
                  },
                  {
                    name: 'title',
                    className: 'feature8-block-title',
                    children: '有效透明的奖金杠杆',
                  },
                  {
                    name: 'content',
                    className: 'feature8-block-content',
                    children:
                      '来自CRM数据的自动奖金计算，让销售团队透明竞争、目标明确、干劲十足！',
                  },
                ],
              },
            },
            {
              className: 'feature8-block-col',
              md: 6,
              xs: 24,
              name: 'child3',
              arrow: {
                className: 'feature8-block-arrow',
                children:
                  'https://gw.alipayobjects.com/zos/basement_prod/167bee48-fbc0-436a-ba9e-c116b4044293.svg',
              },
              children: {
                className: 'feature8-block-child',
                children: [
                  {
                    name: 'image',
                    className: 'feature8-block-image',
                    children:
                      'https://gw.alipayobjects.com/zos/basement_prod/d8933673-1463-438a-ac43-1a8f193ebf34.svg',
                  },
                  {
                    name: 'title',
                    className: 'feature8-block-title',
                    children: '基于数据分析的企业智能',
                  },
                  {
                    name: 'content',
                    className: 'feature8-block-content',
                    children:
                      '销售预测，各种同比环比的趋势分析让管理层在竞争中总能领先一步',
                  },
                ],
              },
            },
          ],
        },
        // {
        //   name: 'block1',
        //   className: 'feature8-block-row',
        //   gutter: 120,
        //   title: {
        //     children: '平台自主训练流程',
        //     className: 'feature8-carousel-title-block',
        //   },
        //   children: [
        //     {
        //       className: 'feature8-block-col',
        //       md: 6,
        //       xs: 24,
        //       name: 'child0',
        //       arrow: {
        //         className: 'feature8-block-arrow',
        //         children:
        //           'https://gw.alipayobjects.com/zos/basement_prod/167bee48-fbc0-436a-ba9e-c116b4044293.svg',
        //       },
        //       children: {
        //         className: 'feature8-block-child',
        //         children: [
        //           {
        //             name: 'image',
        //             className: 'feature8-block-image',
        //             children:
        //               'https://gw.alipayobjects.com/zos/basement_prod/d8933673-1463-438a-ac43-1a8f193ebf34.svg',
        //           },
        //           {
        //             name: 'title',
        //             className: 'feature8-block-title',
        //             children: '需求沟通',
        //           },
        //           {
        //             name: 'content',
        //             className: 'feature8-block-content',
        //             children: '沟通业务需求，对接人：诚凡、芸彩',
        //           },
        //         ],
        //       },
        //     },
        //     {
        //       className: 'feature8-block-col',
        //       md: 6,
        //       xs: 24,
        //       name: 'child1',
        //       arrow: {
        //         className: 'feature8-block-arrow',
        //         children:
        //           'https://gw.alipayobjects.com/zos/basement_prod/167bee48-fbc0-436a-ba9e-c116b4044293.svg',
        //       },
        //       children: {
        //         className: 'feature8-block-child',
        //         children: [
        //           {
        //             name: 'image',
        //             className: 'feature8-block-image',
        //             children:
        //               'https://gw.alipayobjects.com/zos/basement_prod/d8933673-1463-438a-ac43-1a8f193ebf34.svg',
        //           },
        //           {
        //             name: 'title',
        //             className: 'feature8-block-title',
        //             children: '需求沟通',
        //           },
        //           {
        //             name: 'content',
        //             className: 'feature8-block-content',
        //             children:
        //               '沟通业务需求，对接人：诚凡、芸彩沟通业务需求，对接人：诚凡、芸彩',
        //           },
        //         ],
        //       },
        //     },
        //     {
        //       className: 'feature8-block-col',
        //       md: 6,
        //       xs: 24,
        //       name: 'child2',
        //       arrow: {
        //         className: 'feature8-block-arrow',
        //         children:
        //           'https://gw.alipayobjects.com/zos/basement_prod/167bee48-fbc0-436a-ba9e-c116b4044293.svg',
        //       },
        //       children: {
        //         className: 'feature8-block-child',
        //         children: [
        //           {
        //             name: 'image',
        //             className: 'feature8-block-image',
        //             children:
        //               'https://gw.alipayobjects.com/zos/basement_prod/d8933673-1463-438a-ac43-1a8f193ebf34.svg',
        //           },
        //           {
        //             name: 'title',
        //             className: 'feature8-block-title',
        //             children: '需求沟通',
        //           },
        //           {
        //             name: 'content',
        //             className: 'feature8-block-content',
        //             children:
        //               '沟通业务需求，对接人：诚凡、芸彩沟通业务需求，对接人：诚凡、芸彩',
        //           },
        //         ],
        //       },
        //     },
        //     {
        //       className: 'feature8-block-col',
        //       md: 6,
        //       xs: 24,
        //       name: 'child3',
        //       arrow: {
        //         className: 'feature8-block-arrow',
        //         children:
        //           'https://gw.alipayobjects.com/zos/basement_prod/167bee48-fbc0-436a-ba9e-c116b4044293.svg',
        //       },
        //       children: {
        //         className: 'feature8-block-child',
        //         children: [
        //           {
        //             name: 'image',
        //             className: 'feature8-block-image',
        //             children:
        //               'https://gw.alipayobjects.com/zos/basement_prod/d8933673-1463-438a-ac43-1a8f193ebf34.svg',
        //           },
        //           {
        //             name: 'title',
        //             className: 'feature8-block-title',
        //             children: '需求沟通',
        //           },
        //           {
        //             name: 'content',
        //             className: 'feature8-block-content',
        //             children:
        //               '沟通业务需求，对接人：诚凡、芸彩沟通业务需求，对接人：诚凡、芸彩',
        //           },
        //         ],
        //       },
        //     },
        //   ],
        // },
      ],
    },
  },
};
export const Footer10DataSource = {
  wrapper: { className: 'home-page-wrapper footer1-wrapper' },
  OverPack: { className: 'footer1', playScale: 0.2 },
  block: {
    className: 'home-page',
    gutter: 0,
    children: [
      {
        name: 'block0',
        xs: 24,
        md: 8,
        className: 'block',
        title: {
          className: 'logo jzl0qcpyjra-editor_css',
          children:
            '',
        },
        childWrapper: {
          className: 'slogan',
          children: [
            { name: 'content0', children: <p>全释爱科技</p> },
          ],
        },
      },
      {
        name: 'block2',
        xs: 24,
        md: 8,
        className: 'block',
        title: { children: <p>联系我们</p> },
        childWrapper: {
          children: [
            {
              name: 'image~jzl0tcm4f1d',
              className: '',
              children:
                'https://gw.alipayobjects.com/mdn/rms_ae7ad9/afts/img/A*NoENTI5uyn4AAAAAAAAAAABkARQnAQ',
            },
            {
              href: '#',
              name: 'link0',
              children: <p>图鹰对接答疑钉钉群</p>,
              className: 'jzl0u1bko6-editor_css',
            },
            { href: '#', name: 'link1', children: '联系我们' },
          ],
        },
      },
      {
        name: 'block3',
        xs: 24,
        md: 8,
        className: 'block',
        title: { children: '资源' },
        childWrapper: {
          children: [
            { href: '#', name: 'link0', children: 'Ant Design' },
            { href: '#', name: 'link1', children: 'Ant Motion' },
          ],
        },
      },
    ],
  },
  copyrightWrapper: { className: 'copyright-wrapper' },
  copyrightPage: { className: 'home-page' },
  copyright: {
    className: 'copyright',
    children: (
      <span>
        <a href="http://abc.alipay.com">隐私权政策</a>&nbsp; &nbsp; &nbsp;
        |&nbsp; &nbsp; &nbsp; <a href="http://abc.alipay.com">权益保障承诺书</a>&nbsp;
        &nbsp; &nbsp;&nbsp;ICP证:浙B2-20100257&nbsp; &nbsp;
        &nbsp;&nbsp;Copyright © 2019 蚂蚁金融服务集团<br />
      </span>
    ),
  },
};
