import { Index, Show, createSignal, onMount } from 'solid-js'

import type { Accessor, Setter } from 'solid-js'
import type { User } from '@/types'
interface Props {
  setUser: Setter<User>
  user: Accessor<User>
}

interface PayInfoType { name: string, price: number, tips: string }

export default (props: Props) => {
  onMount(async() => {
    getPayInfo()
    setInterval(() => {
      const userJson = JSON.parse(localStorage.getItem('user') as string)
      props.user().word = userJson.word
      props.setUser({ ...props.user() })
    }, 3000)
  })
  let qr = ''
  let emailRef: HTMLInputElement

  const [countdown, setCountdown] = createSignal(0)
  const [url, setUrl] = createSignal('')
  const [showCharge, setShowCharge] = createSignal(false)

  const [payinfo, setPayinfo] = createSignal<PayInfoType[]>([{ name: '', price: 0, tips: '' }])

  const selfCharge = async() => {
    const response = await fetch('/api/exchange', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: localStorage.getItem('token'),
        code: emailRef.value,
      }),
    })
    const responseJson = await response.json()
    if (responseJson.code === 200) {
      alert(responseJson.data.msg)
      localStorage.setItem('user', JSON.stringify(responseJson.data))
      // props.setUser(responseJson.data)
      setShowCharge(false)
    } else {
      alert(responseJson.message)
    }
  }

  const getPayInfo = async() => {
    const response = await fetch('/api/getpayinfo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: localStorage.getItem('token'),
      }),
    })
    const responseJson = await response.json()
    if (responseJson.code === 200)
      setPayinfo(responseJson.data)
    else
      alert(responseJson.message)
  }

  const close = () => {
    setShowCharge(false)
  }
  const isMobile = () => {
    const flag = navigator.userAgent.match(
      /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i,
    )
    return flag
  }
  const getPaycode = async(price: number) => {
    qr = ''
    let flow_id = ''
    const response = await fetch('/api/getpaycode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: localStorage.getItem('token'),
        price,
      }),
    })
    const responseJson = await response.json()
    if (responseJson.code === 200) {
      if (isMobile())
        qr = responseJson.data.qr

      setUrl(responseJson.data.url)
      flow_id = responseJson.data.flow_id
      setCountdown(300)
      const intv = setInterval(() => {
        setCountdown(countdown() - 1)
        if (countdown() <= 0) {
          clearInterval(intv)
          setShowCharge(false)
          setUrl('')
        }
      }, 1000)

      // 检查是否到账
      const intv2 = setInterval(async() => {
        if (countdown() <= 0) {
          clearInterval(intv2)
        } else {
          const response = await fetch('/api/paynotice', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              token: localStorage.getItem('token'),
              flow_id,

            }),
          })
          const responseJson = await response.json()
          if (responseJson.code === 200) {
            if (responseJson.data.msg === '充值已到账') {
              localStorage.setItem('user', JSON.stringify(responseJson.data))
              // props.setUser(responseJson.data)
              alert(responseJson.data.msg)
              setShowCharge(false)
              setUrl('')
            }
          }
        }
      }, 3000)
    } else {
      alert(responseJson.message)
    }
  }

  return (
    <div id="input_container" class="mt-2 max-w-[450px]">
      <p mt-1 op-60>
        Hi,{props.user().nickname} 剩余额度{props.user().word}字
        <span onClick={() => { setShowCharge(true) }} class="border-1 px-2 py-1 ml-2 rounded-md transition-colors bg-slate/20 cursor-pointer hover:bg-slate/50">充值</span>
      </p>
      <Show when={showCharge()}>
        <div class="h-md lg-h-auto overflow-auto">
          <div class="mt-4">
            <Show when={!url()}>
              <span class="text-sm">
                请选择充值金额, GPT4按字数计费, 不限时间
              </span>
              <div class="grid grid-cols-2">
                <Index each={payinfo()}>
                  {(v, _) => (
                    <button onClick={() => { getPaycode(v().price) }} class="h-12 mx-1 mt-2 px-4 py-2 bg-slate bg-op-15 hover:bg-op-20 rounded-sm">
                      {v().name}
                    </button>
                  )}
                </Index>
              </div>

            </Show>
            <Show when={url()}>
              <div class="flex flex-col">
                <span class="text-sm">
                  请在{countdown()}秒内完成支付
                </span>
                <img class="w-3/5 max-w-[200px] mt-2" src={url()} />
              </div>
              <div>请使用支付宝扫码支付</div>
              <Show when={qr}>
                <div class="mt-4 flex space-x-2 items-center">
                  <span>或</span>
                  <a target="_blank" href={qr} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" rel="noreferrer">点击支付
                  </a>
                </div>
              </Show>
              <div class="text-sm mt-2">
                付款后长时间未到账? 客服QQ:765500788
              </div>
            </Show>
          </div>

          <hr class="mt-4" />
          <div class="flex mt-4">
            <span class="text-sm">
              有兑换码? 可在下方输入字数兑换码
            </span>
          </div>

          <input
            ref={emailRef!}
            placeholder="请输入字数兑换码"
            type="text"
            class="px-4 py-3 h-12 rounded-sm bg-(slate op-15) base-focus w-full mt-2"
            value=""
          />
          <button onClick={selfCharge} class="w-1/3 h-12 mt-2 px-4 py-2 bg-slate bg-op-15 hover:bg-op-20 rounded-sm">
            兑换
          </button>
          <button onClick={close} class="w-1/3 h-12 mt-2 px-4 py-2 bg-slate bg-op-15 hover:bg-op-20 rounded-sm ml-2">
            关闭
          </button>

          <div class="text-xs text-gray-600 space-y-2 mt-6">

            <a href="/kefu" class="mt-4 w-40 text-sm rounded-md cursor-pointer border-b border-dashed">
              使用遇到问题? 在线客服
            </a>
            <div class="font-bold text-gray-700 text-center">常见问题</div>
            <div>
              <div class="font-bold text-gray-700">1.这是真的GPT4吗</div>
              <div>是的，默认使用OpenAI最新发布的gpt-4o(gpt-4o-2024-11-20)模型，它的知识库截止2023年10月，但你问它是GPT几的时候有可能它并不知道自己是GPT4，可以用一些经典逻辑题区分，如：爸爸妈妈结婚为什么没有邀请我？ 如果能回答到结婚时还没有出生就是GPT4, GPT3.5是回答不到这个点的</div>
            </div>

            <div>
              <div class="font-bold text-gray-700">2.为什么字数一下子消耗完了</div>
              <div>非必要，请每个问题开新对话单独提问！连续对话时为了能理解上下文，每次提问都需要带上前面所有的内容，所以前面内容会重复计算字数; 另外,提问和回答都会计算字数</div>
            </div>

            <div>
              <div class="font-bold text-gray-700">3.为什么发送问题后无任何反应</div>
              <div>如果是一直都无响应, 那可能是兼容性问题, 在太低版本的浏览器中可能无法使用, 电脑上请使用最新谷歌浏览器，手机上可使用夸克浏览器</div>
            </div>
          </div>
        </div>
      </Show>
    </div>
  )
}
