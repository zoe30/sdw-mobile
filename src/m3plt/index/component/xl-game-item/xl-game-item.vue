<!--

移动版游戏主页-单个游戏模块

@param gameItem {Object}
*********************************************************
id:           游戏的id
cover:        游戏的封面
title:        游戏的名称
star:         游戏的星级
quantity:     游戏的活跃
desc:         游戏的描述
time:         游戏的时间（showMore为false，显示我玩过的时间）
*********************************************************

@param showMore 是否显示更多信息，用于区别主页和我玩过的

@event tap-game(type,id)
*********************************************************
"play" ---  点击到【开玩】按钮
*********************************************************

-->

<template>

    <div class="xl-game-cont">

        <div class="l-g-cover">

            <!--开始游戏-->
            <!-- <a :href="gameUrl"
               target="_blank"
               @click.stop="checkOpenGame(gameItem)"
               class="start-game-cover"></a> -->
            <div @click.stop="authToGame(gameItem)"
               class="start-game-cover"></div>
            <img :src="gameItem.bIcon" alt="">


            <div :class="['q-code-border', {'m3plt-code-border': onM3plt || onM3pltGame}, {'m3plt-code-border': fromM3plt}]" v-show="showQCode">

                <div class="q-code-flash"></div>

                <div class="q-code-cont" ref="myCode"></div>

            </div>

        </div>

        <div class="xl-g-info">

            <a class="l-g-i-title"
               @click.stop="gotoDetail(gameItem)">
                {{gameItem.name}}
            </a>


            <div class="l-g-i-info">{{gameItem.sub}}</div>

            <div class="l-g-star">

                <i :class="item" v-for="item in starLists"></i>

                <span class="s-n">{{sN}}</span>
                <span class="l-n">{{lN}}</span>

            </div>

            <!--二维码 鼠标的事件监听-->
            <div class="q-code"
                 @mouseover.self='qCodeOver()'
                 @mouseout.self='qCodeOut()'
            ></div>

        </div>

    </div>

</template>

<script>

    var CheckOpenGame = require('../../../components/js/CheckOpenGame');
    import Fn from '../../js/Fn';
    export default {
        name: 'l-game-item',
        data: function () {
            return {
                msg: 'i am l-game-item!',
                showQCode: false,
                hasQCode: null,
            }
        },
        props: ['gameItem', 'gamesModal', 'on-m3plt', 'from-m3plt', 'on-m3pltGame'],
        methods: {
            // 跳转详情页采用相对路径处理
            gotoDetail: function (item) {
                this.$emit('go-detail', item.id)
            },
            qCodeOver: function () {

                var self = this;
                this.showQCode = true;

                if (!self.hasQCode) {

                    var dom = self.$refs.myCode;
                    var qcode = new QRCode(dom, {
                        width: 94,
                        height: 92
                    });

                    var src = CheckOpenGame.createQCode(self.gameItem.id);
                    qcode.makeCode(src);

                    self.hasQCode = true;
                }

            },
            qCodeOut: function () {
                this.showQCode = false;
            },
            /*  checkOpenGame: function (item) {
                CheckOpenGame.checkOpenUrl(item);
            }, */
            checkOpenGame: Fn.checkOpenGame,
            authToGame: Fn.authToGame,
            getQuery: Fn.getQuery,
            findGame: Fn.findGame
        },
        computed: {
            /**
             * 根据数据计算星级的类型
             * @return {Array}
             */
            starLists: function () {

                // 星级数量为 0~10 的整型
                var star = Math.max(0, this.gameItem.star >> 0);
                star = Math.min(10, star);

                var stars = [], pStar = star / 2 >> 0, lStar = star % 2, i;

                // 添加满星个数
                for (i = 0; i < pStar; i++) stars.push('star2');

                // 修正单颗星
                if (lStar == 1) {
                    stars.push('star1');
                    pStar++;
                }

                // 填补剩余的星
                for (i = pStar; i < 5; i++) stars.push('star0');

                return stars;
            },
            sN: function () {
                this.gameItem.star = this.gameItem.star || 0;
                return this.gameItem.star / 2 >> 0;
            },
            lN: function () {
                this.gameItem.star = this.gameItem.star || 0;
                var ln = this.gameItem.star % 2;
                return ln === 0 ? '.0' : '.5';
            },
            gameUrl: function () {
                var myUrl = CheckOpenGame.createMyUrl(this.gameItem);
                return myUrl;
            }
        }
    }

</script>

<style lang="sass">
    @import "./game-item.scss";
</style>