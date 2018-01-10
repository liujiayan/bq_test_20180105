<template>
	<div class="wrapper" ref="wrapper">
		<div class="begin-wrapper" v-show="isbwShow">
			<div class="begin-container">
				<img src="./index_1.jpg">
				<div class="activity-time">活动时间：2018.1.13 9:00 - 18:00</div>
			</div>
			<div class="begin-btn" @click="beginAnswer">
				开始答题
			</div>
		</div>
		<div class="userInfo" v-if="isUserShow" :class="{left:slideLeft,right:!slideLeft}">
			<ul>
				<li v-for="(item,index) in peopleList" :key="index" @click="goQuestPage(item.hasGrade,item.seq)" :class="{sel:item.hasGrade === 1}"><span>{{index+1}}. {{item.name}}</span><b></b></li>
			</ul>
		</div>
		<div class="answerOne"  v-if="isQuestShow" ref="answerOneWrapper">
			<div class="answerOne-wrapper">
				<div class="answerOne-item" v-for="(item,index) in questList" :key="index">
					<h1 v-if="index === 0">第一类.作风方面（单选）</h1>
					<h1 v-if="index === 5">第二类.能力方面（单选）</h1>
					<h2>{{item.question}}</h2>
					<div class="answer-wrapper">
						<p v-for="(answer,ind) in item.answers" :key="ind" class="answer-item">
							<label :for="`${index}-${ind}`">
								<span class="radio-box">
									<input 
									type="radio" 
									:name="`${index}-${item.question}`"
									:id="`${index}-${ind}`" 
									v-model="requiredItem[index]"
									:value="answer.numb">
									<b></b>
								</span>
								{{answer.text}}
							</label>
				    	</p>
					</div>
				</div>
			</div>	
		</div>	
		<div class="submit-btn" v-show="isSubmitShow" @click="submit" :class="{hui:!isSubmitClick}"><span>提交</span></div>
	</div>
</template>

<script>
import axios from 'axios';
import questions from '../../api/questions';
import {Toast,Indicator,MessageBox } from 'mint-ui';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.interceptors.request.use(
    config => {
        Indicator.open({
            spinnerType: 'fading-circle'
        });
        return config;
    });
axios.interceptors.response.use(
    config => {
        Indicator.close();
        return config;
    },
    () => {
        Indicator.close();
    });
	export default{
		data(){
			return{
				randomId:this.$route.query.random,//openID
				isbwShow:true, //开始也是否显示
				isUserShow:false, // 领导列表页是否显示
				isQuestShow:false, //答题页是否显示
				isSubmitShow:false, //提交按钮是否显示
				peopleList:[],//领导列表
				questList:[],//题列表
				requiredItem:[],//答案数组
				leaderId:"", //当前点击的领导Id
				isAllArr:[],  //是否全部评价
				slideLeft:false,
				isSubmitClick:true
			}
		},
		methods:{
			 beginAnswer(){ //开始答题
			 if(!this.randomId){
				 MessageBox( {
					title:"",
					message:'您无法参加',
					confirmButtonClass:'confirmButton'
					});
				 return;
				 }
				let params = JSON.stringify({
					api:1001,
					requestTime:6344650606420,
					traceId:"6344650606420",
					version:"1.0",
					data:{
						random:this.randomId
					}
				});
				let _this = this;
				 axios.post('https://www.zcwxsoft.cn/api/wenjuan/v2/leader/list',params)
						.then(function(res){
							let data = res.data;
							if(data.respCode === "00"){
								_this.peopleList = data.result;
								_this.isUserShow = true;
								//_this.slideLeft = false;
								_this.isbwShow = false;
								_this.peopleList.forEach( (item,index) => {
									_this.isAllArr.push(item.hasGrade);
									
								})
								
								if(_this.isAllArr.length > 0 && _this.isAllArr.indexOf(0) < 0){
									setTimeout(function(){
										MessageBox( {
											title:"",
											message:'谢谢您的配合',
											confirmButtonClass:'confirmButton'
										});
									},500)
								}
							}else{
								MessageBox({
										title:"",
										message:data.respMsg,
										confirmButtonClass:'confirmButton'
									});
							}
						})
				 
			 },
			goQuestPage(isest,seq){//去答题页
				if(isest === 1){
					Toast( {
						message:"已评价",
						duration:1000
					});
				}else{
					this.leaderId = seq;
					this.isUserShow = false;
				 	this.isbwShow = false;
					this.isQuestShow = true;
					this.isSubmitShow = true;
					this.isSubmitClick =true;
				}
			},
			submit(){//点击提交
				let result = this.validate();
				if (result) {
					this.submitRequest();
				} else {
					MessageBox( {
							title:"",
							message:"请回答全部问题",
							confirmButtonClass:'confirmButton'
						});
				}
				
			},
			submitRequest(){//提交请求
				if(!this.isSubmitClick){return}
				this.isSubmitClick = false;
				let params = JSON.stringify({
					api:1001,
					requestTime:6344650606420,
					traceId:"6344650606420",
					version:"1.0",
					data:{
						random:this.randomId,
						leaderSeq:this.leaderId, 
						scores:this.requiredItem
					}
				});
				let _this = this;
				 axios.post('https://www.zcwxsoft.cn/api/wenjuan/v2/grade/put',params)
						.then(function(res){
							//_this.isSubmitClick = true;
							let data = res.data;
							if(data.respCode === "00"){
								//_this.isUserShow = true;
								Toast({
									message: '提交成功',
									duration: 500
								})
								_this.slideLeft = true;
								
								setTimeout(function(){
									_this.isQuestShow = false;
									_this.isSubmitShow = false;
									_this.beginAnswer();
									_this.getRequiredItem();
								},1000)
							}else{
								MessageBox({
										title:"",
										message:data.respMsg,
										confirmButtonClass:'confirmButton'
									});
							}
					})
			},
			getRequiredItem() {//初始化答案对象
				this.questList.forEach( (item,index) => {
					this.requiredItem[index] = 0;
				} )
			},
			validate(){ //判断是否题是否答完
				for(let i=0; i < this.requiredItem.length; i++){
					if(this.requiredItem[i] === 0){return false}
				}
				return true
			}
		},
		mounted(){
			this.questList = questions.list;
			this.getRequiredItem();
		}
	}
</script>

<style lang = "scss">
  @import '../../common/sass/variable';
  body,html{
	  max-width: 750px;
	  margin: 0 auto;
  }
	.wrapper{
		width: 100%;
		height: 100%;
		position: relative;
		.begin-wrapper{
			width: 100%;
			height: 100%;
			.begin-container{
				width: 100%;
				margin-bottom: 16px;
				position: relative;
				img{
					width: 100%;
				}
				.activity-time{
					position: absolute;
					bottom: 2.32rem;
					width: 100%;
					text-align: center;
					font-size: 16px;
				}
			}
			.begin-btn{
				width:90%;
				height: 1.1733rem;
				line-height: 1.1733rem;
				background: #d1251b;
				text-align: center;
				color: #fff;
				font-size: 17px;
				border-radius: 8px;
				margin:0 auto;
			}
		}
	}
	.userInfo{
		position: absolute;
        width: 100%;
        height: 100%;
        overflow: auto;
        left: 0;
        top: 0;
		box-sizing: border-box;
		padding: 20px 15px 0 15px;
		background:#efeff4; 
		-webkit-overflow-scrolling : touch;
		overflow-scrolling : touch;
		&.left{
			animation: slideInLeft 0.5s;
		}
		&.right{
			animation: slideInRight 0.5s;
		}
		li{
			height:1.1467rem;
			line-height:1.1467rem;
			margin-bottom: 15px;
			color: #333333;
			font-size: 18px;
			width: 4.3733rem;
			border: 1px solid #d6d5d6;
			border-radius: 5px;
			display: flex;
			justify-content:space-between;
			align-items:center;
			padding: 0 15px;
			box-sizing: border-box;
			b{
				width: 13px;
				height: 13px;
				background-image: url("./hui.png");
				background-repeat: no-repeat;
				background-size: 13px 13px;
			}
			&:nth-child(odd){
				float: left;
			}
			&:nth-child(even){
				float: right;
			}
			&.sel{
				b{background-image: url("./lv.png");}
				
			}
		}
	}
	.answerOne{
		position: absolute;
        width: 100%;
        height: 100%;
        overflow: auto;
        left: 0;
        top: 0;
		overflow: auto;
		-webkit-overflow-scrolling : touch ;
		overflow-scrolling : touch;
		animation: slideInRight 0.5s;
		background: #efeff4;
		h1{
			line-height: 55px;
			font-size: 16px;
			padding: 0 16px;
			background: #d6d5d6;
		}
		.answerOne-wrapper{
			padding-bottom: 50px;
		}
		.answerOne-item{
			background: #fff;
			margin-bottom: 10px;
			font-size: 16px;
			&:nth-child(5){
				margin-bottom:0;
			}
			h2{
				border-bottom:1px solid #e7e7e7;
				line-height: 20px;
				padding: 12px 16px;
				
			}
			.answer-wrapper{
				padding: 0 16px;
			}
			.answer-item{
				height: 40px;
				line-height: 40px;
				border-bottom:1px solid #e7e7e7;
				
				&:last-child{
					border: none;
				}
				label{
					display: flex;
					align-items:center;
					width: 100%;
					height: 100%;
				}
				.radio-box{
					display: inline-block;
					width: 23px;
					height: 23px;
					position: relative;
					margin-right: 10px;
					b{
						width: 100%;
						height: 100%;
						position: absolute;
						left: 0;
						top: 0;
						background-size:23px;
						background-repeat: no-repeat;
						background-image: url('./no_icon.png');
					}
					input{
						width: 100%;
						height: 100%;
						position: absolute;
						left: 0;
						top: 0;
						z-index: 10;
						background-color:transparent; 
						opacity: 0;
						&:checked{
							&~b{
								background-image: url('./yes_icon.png');
							}
						}
					}
				}

			}
		}
	}
	.submit-btn{
			width: 100%;
			height:50px;
			position: fixed;
			bottom:0;
			left: 0;
			background: #fff;
			z-index: 101;
			animation: slideInRight 0.5s;
			span{
				display: block;
				text-align: center;
				background: #d1251b;
				width: 90%;
				height: 35px;
				line-height: 35px;
				font-size: 16px;
				color: #fff;
				margin: 7px auto;
				border-radius: 5px;
			}
			&.hui{
				span{
					background: #666;
				}
				
			}
		}
		
		.mint-msgbox-content{
			color: #333333 !important;
		}
		.confirmButton{
			color: #d1251b !important;
			font-size: 14px !important;
		}
		.mint-indicator-wrapper{
			z-index: 200 !important;
		}
	@keyframes slideInLeft {
		from {
			-webkit-transform: translate3d(-100%, 0, 0);
			transform: translate3d(-100%, 0, 0);
			visibility: visible;
		}

		to {
			-webkit-transform: translate3d(0, 0, 0);
			transform: translate3d(0, 0, 0);
		}
	}
	@keyframes slideInRight {
    from {
        -webkit-transform: translate3d(100%, 0, 0);
        transform: translate3d(100%, 0, 0);
        visibility: visible;
    }

    to {
        -webkit-transform: translate3d(0, 0, 0);
        transform: translate3d(0, 0, 0);
    }
}
</style>
