import { Index, Show, createSignal, onMount } from 'solid-js'
import type { User } from '@/types'
import type { Accessor, Setter } from 'solid-js'
interface Props {
  setUser: Setter<User>
  user: Accessor<User>
}

interface PayInfoType { name: string, price: number }

export default (props: Props) => {
  onMount(async() => {
    getPayInfo()
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

  const [payinfo, setPayinfo] = createSignal<PayInfoType[]>([{ name: '', price: 0 }])

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
              请选择充值金额,GPT4按字数计费
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
            <div class="text-sm mt-2">
              付款后长时间未到账? 可在支付宝-我的-账单-联系收款方 中给我发送订单号
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
      </Show>
    </div>
  )
}
