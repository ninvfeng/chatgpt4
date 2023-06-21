import { Show, createSignal } from 'solid-js'
import type { User } from '@/types'
import type { Setter } from 'solid-js'
interface Props {
  setIsLogin: Setter<boolean>
  setUser: Setter<User>
}

export default (props: Props) => {
  let emailRef: HTMLInputElement
  let codeRef: HTMLInputElement

  const [countdown, setCountdown] = createSignal(0)

  const login = async() => {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: emailRef.value,
        code: codeRef.value,
      }),
    })
    const responseJson = await response.json()
    if (responseJson.code === 200) {
      localStorage.setItem('token', responseJson.data.token)
      localStorage.setItem('user', JSON.stringify(responseJson.data))
      props.setIsLogin(true)
      props.setUser(responseJson.data)
      setTimeout(() => {
        location.reload()
      }, 1000)
    } else {
      alert(responseJson.message)
    }
  }

  const sendCode = async() => {
    if (!emailRef.value)
      alert('请输入邮箱')

    setCountdown(60)
    const intv = setInterval(() => {
      setCountdown(countdown() - 1)
      if (countdown() <= 0)
        clearInterval(intv)
    }, 1000)
    const response = await fetch('/api/sendCode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: emailRef.value,
      }),
    })
    const responseJson = await response.json()
    if (responseJson.code !== 200) {
      alert(responseJson.message)
      setCountdown(3)
    }
  }

  return (
    <div id="input_container" class="mt-2 max-w-[450px]">
      <input
        ref={emailRef!}
        placeholder="邮箱"
        type="text"
        class="px-4 py-3 h-12 rounded-sm bg-(slate op-15) base-focus w-full"
        value=""
      />
      <div class="flex mt-2 justify-center items-center">
        <input
          ref={codeRef!}
          id="code_input"
          class="px-4 py-3 h-12 rounded-sm bg-(slate op-15) base-focus w-2/3"
          placeholder="验证码"
          v-model="data.form.verify_code"
        />
        <Show when={countdown() <= 0}>
          <button onClick={sendCode} class="w-1/3 h-12 px-2 py-2 bg-slate bg-op-15 hover:bg-op-20 rounded-sm ml-2">
            发送
          </button>
        </Show>
        <Show when={countdown() > 0}>
          <div class="w-1/3 h-12 px-2 leading-12 bg-slate bg-op-15 hover:bg-op-20 rounded-sm ml-2 text-center text-gray-400">
            {countdown()}秒
          </div>
        </Show>
      </div>

      <button onClick={login} class="w-1/3 h-12 mt-2 px-4 py-2 bg-slate bg-op-15 hover:bg-op-20 rounded-sm">
        开启4.0
      </button>
    </div>
  )
}
