<template>
	<div class="wrapper">
		<div class="begin-wrapper" v-show="isbwShow">
			<div class="begin-container"></div>
			<div class="begin-btn" @click="beginAnswer">
				开始答题
			</div>
		</div>
		<div class="userInfo" v-show="isUserShow">
			<ul>
				<li v-for="(item,index) in peopleList" :key="index" @click="goQuestPage(item.isest)" :class="{sel:item.isest}">{{item.name}}</li>
			</ul>
			
		</div>
		<div class="answerOne"  v-show="isQuestShow" ref="answer-wrapper">
			<ul>
				<li v-for="(item,index) in questList" :key="index">
					<h2>{{index+1}}、{{item.question}}</h2>
					<div class="answer-wrapper">
						<p v-for="(answer,ind) in item.answers" :key="ind" class="answer-item">
							<span class="radio-box">
								<input 
								type="radio" 
								:name="`${index}-${item.question}`"
								:id="`${index}-${ind}`" 
								v-model="requiredItem[index]"
								:value="ind">
								<b></b>
							</span>
							
							<label :for="`${index}-${ind}`">{{answer.answer}}</label>
							
				    	</p>
					</div>
					 
				</li>
			</ul>	
		</div>	
		<div class="submit-btn" v-show="isSubmitShow" @click="submit"><span>提交</span></div>
	</div>
</template>

<script>
import axios from 'axios';
import questions from '../../api/questions';
import {Toast} from 'mint-ui';
axios.defaults.headers.post['Content-Type'] = 'application/json';
	export default{
		data(){
			return{
				isbwShow:true,
				isUserShow:false,
				isQuestShow:false,
				isSubmitShow:false,
				peopleList:[
					{
						name:"张三",
						isest:false,
						id:0
					},
					{
						name:"张三",
						isest:true,
						id:1
					},
					{
						name:"张三",
						isest:false,
						id:2
					},
					{
						name:"张三",
						isest:false,
						id:3
					},
					{
						name:"张三",
						isest:true,
						id:4
					},
					{
						name:"张三",
						isest:false,
						id:5
					},
					{
						name:"张三",
						isest:true,
						id:6
					}
				],
				selectedPeopel:"",
				questList:[],
				clickIndex:"",
				isClick:true,
				requiredItem:{}
			}
		},
		methods:{
			 weChatAuthor(){

			 },
			 beginAnswer(){
				 this.isUserShow = true;
				 this.isbwShow = false;
			 },
			 is_weixn(){  
				var ua = navigator.userAgent.toLowerCase();  
				if(ua.match(/MicroMessenger/i)=="micromessenger") {  
					return true;  
				} else {  
					return false;  
				}  
			},
			goQuestPage(isest){
				//alert(index);
				if(isest){
					Toast({
                    	message:"已评价",
                    	position: 'middle',
                    	duration: 2000
                  	})
				}else{
					this.isUserShow = false;
				 	this.isbwShow = false;
					 this.isQuestShow = true;
					 this.isSubmitShow = true;
				}
				
				
			},
			submit(){
				let result = this.validate();
				if (result) {
					this.isUserShow = true;
				 	this.isbwShow = false;
					this.isQuestShow = false;
					this.isSubmitShow = false;
					console.log(this.requiredItem)
					 this.getRequiredItem();
				} else {
					Toast({
                    	message:"提交失败",
                    	position: 'middle',
                    	duration: 2000
                  	})
				}
				
			},
			getRequiredItem() {
				this.questList.forEach( (item,index) => {
					this.requiredItem[index] = ''
				} )
			},
			validate() {
				for (let i in this.requiredItem) {
					if (this.requiredItem[i].length === 0) return false
				}
				return true
			}

		
		},
		computed:{
			
		},
		mounted(){
			this.questList = questions.questions;
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
				height: 10.6667rem;
				background: #A81F23;
				margin-bottom: 16px;
			}
			.begin-btn{
				width:90%;
				height: 1.1733rem;
				line-height: 1.1733rem;
				background: #09bb07;
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
        z-index: 90;
        width: 100%;
        height: 100%;
        overflow: auto;
        left: 0;
        top: 0;
		box-sizing: border-box;
		padding: 20px 15px 0 15px;
		animation: slideInRight 0.5s;
		li{
			height:1.1467rem;
			line-height:1.1467rem;
			text-align: center;
			margin-bottom: 15px;
			color: #333333;
			font-size: 18px;
			width: 4.3733rem;
			border: 1px solid #d6d5d6;
			border-radius: 5px;
			&:nth-child(odd){
				float: left;
			}
			&:nth-child(even){
				float: right;
			}
			&.sel{
				background: #09bb07;
				color: #fff;
				border-color: #029400;
			}
		}
	}
	.answerOne{
		position: absolute;
        z-index: 100;
        width: 100%;
        height: 100%;
        overflow: auto;
        left: 0;
        top: 0;
		overflow: auto;
		animation: slideInRight 0.5s;
		background: #efeff4;
		ul{
			padding-bottom: 50px;
		}
		li{
			background: #fff;
			margin-bottom: 10px;
			font-size: 16px;
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
				display: flex;
				align-items:center;
				&:last-child{
					border: none;
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
				background: #09bb07;
				width: 90%;
				height: 35px;
				line-height: 35px;
				font-size: 16px;
				color: #fff;
				margin: 7px auto;
				border-radius: 5px;
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
