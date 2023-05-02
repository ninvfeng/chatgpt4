import { Show, createSignal, onMount } from 'solid-js'
import type { User } from '@/types'
import type { Accessor, Setter } from 'solid-js'
interface Props {
  setUser: Setter<User>
  user: Accessor<User>
}

export default (props: Props) => {
  onMount(async() => {
    setInterval(() => {
      const userJson = JSON.parse(localStorage.getItem('user') as string)
      props.user().word = userJson.word
      props.setUser({ ...props.user() })
    }, 3000)
  })

  let emailRef: HTMLInputElement

  const [countdown, setCountdown] = createSignal(0)
  const [url, setUrl] = createSignal('')
  const [showCharge, setShowCharge] = createSignal(false)

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
      props.setUser(responseJson.data)
      setShowCharge(false)
    } else {
      alert(responseJson.message)
    }
  }

  const close = () => {
    setShowCharge(false)
  }

  const getPaycode = async(price: number) => {
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
      setUrl(responseJson.data.url)
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
        <div class="mt-4">
          <Show when={!url()}>
            <span class="text-sm">
              请选择充值金额, GPT4按字数计费(注意!不是次数)
            </span>
            <div class="flex space-x-2 text-sm">
              <button onClick={() => { getPaycode(1) }} class="w-1/3 h-12 mt-2 px-4 py-2 bg-slate bg-op-15 hover:bg-op-20 rounded-sm">
                1元<br />1000字
              </button>
              <button onClick={() => { getPaycode(5) }} class="w-1/3 h-12 mt-2 px-4 py-2 bg-slate bg-op-15 hover:bg-op-20 rounded-sm">
                5元<br />5300字
              </button>
              <button onClick={() => { getPaycode(10) }} class="w-1/3 h-12 mt-2 px-4 py-2 bg-slate bg-op-15 hover:bg-op-20 rounded-sm">
                10元<br />10500字
              </button>
            </div>
          </Show>
          <Show when={url()}>
            <span class="text-sm">
              请在{countdown()}秒内完成支付
            </span>
            <img class="w-1/3 mt-2" src={url()} />
          </Show>
        </div>

        <hr class="mt-4" />
        <div class="flex mt-4">
          <span class="text-sm">
            有兑换码? 请在下方输入次数兑换码
          </span>
        </div>

        <input
          ref={emailRef!}
          placeholder="请输入次数兑换码"
          type="text"
          class="gpt-password-input w-full mt-2"
          value=""
        />
        <button onClick={selfCharge} class="w-1/3 h-12 mt-2 px-4 py-2 bg-slate bg-op-15 hover:bg-op-20 rounded-sm">
          兑换
        </button>
        <button onClick={close} class="w-1/3 h-12 mt-2 px-4 py-2 bg-slate bg-op-15 hover:bg-op-20 rounded-sm ml-2">
          关闭
        </button>
      </Show>
    </div>
  )
}
