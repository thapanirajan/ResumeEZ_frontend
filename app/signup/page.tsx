import { Logo } from '@/components/landing/Logo'
import Link from 'next/link'

const SignupPage = () => {
    return (
        <div className='bg-[#f2f7fc] h-screen flex items-center justify-center'>
            <div>
                <Logo />
                <div className='  bg-[#ffffff] rounded p-8 border border-gray-200 shadow'>

                    {/*  Signup form */}
                    <div>
                        <form action="" className='space-y-4 w-fit'>
                            <h1 className='font-bold text-2xl'>Signup</h1><br />

                            <label htmlFor="fullname" className='font-semibold'>Full Name</label>
                            <br />
                            <input
                                className='bg-[#f2f7fc] px-4 py-2 rounded outline-none w-[350px] mt-2 border border-gray-300'
                                type="text"
                                id='fullname'
                                name='fullname'
                                required
                                placeholder='Alex Kharel'
                            />
                            <br />

                            <label htmlFor="username" className='font-semibold'>Email</label>
                            <br />
                            <input
                                className='bg-[#f2f7fc] px-4 py-2 rounded outline-none w-[350px] mt-2 border border-gray-300'
                                type="text"
                                id='username'
                                name='username'
                                required
                                placeholder='example@gmail.com'
                            />
                            <br />

                            <label htmlFor="password" className='font-semibold'>Password:</label>
                            <br />
                            <input
                                className='bg-[#f2f7fc] px-4 py-2 rounded outline-none w-[350px] mt-2 border border-gray-300'
                                type="password"
                                id="password"
                                name="password"
                                required
                                placeholder="Enter your password"
                            />
                            <br />

                            <label htmlFor="role" className='font-semibold'>Role</label>
                            <br />
                            <select
                                id="role"
                                name="role"
                                className='bg-[#f2f7fc] px-4 py-2 rounded outline-none w-[350px] mt-2 border-gray-300'
                                required
                                // value="None"
                            >
                                <option value="None" selected>Select your role</option>
                                <option value="HR">HR</option>
                                <option value="Candidate">Candidate</option>
                            </select>
                            <br />

                            <button className='text-white bg-[#245bff] w-full px-4 py-2 rounded-md mt-2 cursor-pointer'>Signup</button>
                        </form>


                        <div className='h-px w-full bg-gray-300 mt-5 mb-5'></div>
                        <button className='bg-[#f2f7fc] w-full px-4 py-2 rounded-md cursor-pointer border border-gray-300'>Continue with Google</button>

                        <div className='text-center text-sm mt-4'>
                            Already have account? <span className='underline'> <Link href="/login"> Login</Link></span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default SignupPage;