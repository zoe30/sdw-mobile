<!--


绑定手机提示框

bind-callback：绑定成功后的回调函数

-->

<template>

    <section class="bind-phone-info-container">

        <div class="desc">
            <input type="tel" v-model="bindMyPhone" placeholder="请输入手机号码">
            <input type="tel" v-model="bindMyCode" placeholder="请输入验证码" data-module="80%">

            <div class="get-code"
                 :class="bindTimer ? '' : 'normal-code'"
                 id="bindCode"
                 @click.stop.self='getBindCode()'>
                {{bindMsg}}
            </div>
        </div>

        <section class="login-btn-v3"
                 @click.stop.self='bindPhoneCheck()'>绑<span style="width: 20px;"> </span>定
        </section>

    </section>

</template>

<script>


    window.scrollForbFn = function (e) {
        e.preventDefault();
    };

    export default {
        name: 'bind-phone',
        data: function () {
            return {
                bindMyPhone: '',
                bindMyCode: '',
                bindTimer: null,
                bindMsg: '获取验证码',
                bindStartTimer: 0
            }
        },

        props: [],
        methods: {

            // 绑定手机的确认检查
            bindPhoneCheck: function () {

                if (!/\d{11}/.test(this.bindMyPhone)) {
                    window.dialog.show('error', '请输入正确的手机号', 1);
                    return;
                }

                if (!/\d+/.test(this.bindMyCode)) {
                    window.dialog.show('error', '请输入正确的验证码', 1);
                    return;
                }

                dialog.show('loading', '手机绑定中...');

                var self = this;

                var postUri = SDW_WEB.URLS.addParam({
                    channel: SDW_WEB.channel,
                    uid: SDW_WEB.USER_INFO.uid,
                    token: SDW_WEB.MD5('' + SDW_WEB.channel + SDW_WEB.USER_INFO.uid + SDW_WEB.USER_INFO.secheme + self.bindTime + self.bindMyCode),
                    sec: SDW_WEB.USER_INFO.secheme,
                    time: self.bindTime
                }, false, HTTP_USER_STATIC + 'checkcode');


                SDW_WEB.getAjaxData(postUri, function (data) {
                    if (data.result == 1) {
                        var pStr = self.bindMyPhone.substring(0, 3) + '****' + self.bindMyPhone.substring(7);
                        data.myPhoneStr = pStr;


                        dialog.show('ok', '手机绑定成功', 1);
                        // 绑定成功后的回调
                        self.$emit('bind-callback', data);

                    } else {
                        dialog.show('error', data.msg, 1);
                    }
                });

            },

            // 获取绑定的验证码
            getBindCode: function () {

                var self = this;

                if (this.bindStartTimer > 0) return;

                if (!/\d{11}/.test(this.bindMyPhone)) {
                    window.dialog.show('error', '请输入正确的手机号', 1);
                    return;
                }

                var sec = +new Date();
                var time = +new Date();

                var postUri = SDW_WEB.URLS.addParam({
                    channel: SDW_WEB.channel,
                    uid: SDW_WEB.USER_INFO.uid,
                    token: SDW_WEB.MD5('' + SDW_WEB.channel + SDW_WEB.USER_INFO.uid + sec + this.bindMyPhone + time + SDW_WEB.USER_INFO.otoken),
                    phone: this.bindMyPhone,
                    sec: sec,
                    time: time
                }, false, HTTP_USER_STATIC + 'getcode');

                dialog.show('loading', '验证码获取中...');

                SDW_WEB.getAjaxData(postUri, function (data) {
                    if (data.result === 1) {
                        // success
                        dialog.show('ok', '验证码已发送', 1);

                        self.bindTime = data.time;

                        self.bindStartTimer = 60;
                        self.bindTimer = setInterval(function () {

                            if (self.bindStartTimer <= 1) {
                                // 终止倒计时
                                clearInterval(self.bindTimer);
                                self.bindStartTimer = 0;
                                self.bindMsg = '获取验证码';
                                self.bindTimer = null;
                            } else {
                                self.bindMsg = (self.bindStartTimer--) + '秒后获取';
                            }

                        }, 1000);

                    } else {
                        dialog.show('error', data.msg, 1);
                    }
                })

            }

        }
    }

</script>

<style lang="sass">

    @import "bind-phone.scss";

</style>