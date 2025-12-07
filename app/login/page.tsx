import { Logo } from '@/components/landing/Logo'
import Link from 'next/link'

const LoginPage = () => {
    return (
        <div className='bg-[#f2f7fc] h-screen flex items-center justify-center'>
            <div>
                <Logo />
                <div className='  bg-[#ffffff] rounded p-8 border border-gray-200 shadow'>

                    {/*  login form */}
                    <div>
                        <form action="" className='space-y-4 w-fit'>
                            <h1 className='font-bold text-2xl'>Login</h1><br />
                            <label htmlFor="username" className='font-semibold'>Email</label>
                            <br />
                            <input
                                className='bg-[#f2f7fc] px-4 py-2 rounded outline-none w-[350px] mt-2 border border-gray-300'
                                type="text"
                                id='username'
                                name='username'
                                required
                                placeholder='example@gmail.com' />
                            <br />

                            <label htmlFor="password">Password:</label>
                            <br />
                            <input
                                className='bg-[#f2f7fc] px-4 py-2 rounded outline-none w-[350px] mt-2 border border-gray-300'
                                type="password"
                                id="password"
                                name="password"
                                required
                                placeholder="Enter your password">
                            </input>
                            <br />

                            <button className='text-white bg-[#245bff] w-full px-4 py-2 rounded-md mt-2 cursor-pointer'>Login</button>
                        </form>

                        <div className='h-px w-full bg-gray-300 mt-6 mb-6'></div>
                        <button className='bg-[#f2f7fc] w-full px-4 py-2 rounded-md mt-2 cursor-pointer border border-gray-300'>Continue with Google</button>

                        <div className='text-center text-sm mt-4'>
                            Dont have account? <span className='underline'> <Link href="/signup"> Signup</Link></span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default LoginPage;