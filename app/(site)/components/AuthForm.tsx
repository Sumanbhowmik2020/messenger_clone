'use client';

import axios from "axios";
import Button from "@/app/components/Button";
//import Input from "@/app/components/inputs/input";
import Input from "../../components/inputs/Input";
import { useCallback, useEffect, useState } from "react";
import {
    useForm,
    FieldValues,
    SubmitHandler
} from "react-hook-form";
import { BsGithub,BsGoogle} from "react-icons/bs"
import AuthSocialButton from "./AuthSocialButton";

import { signIn, useSession } from "next-auth/react";

import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

type Variant = 'Login' | 'REGISTER';

const AuthForm = () => {
    const session =useSession();
    const router = useRouter();
    const [variant, setVariant] = useState<Variant>("Login");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(()=>{
        if(session?.status==='authenticated')
        {
            router.push('/users')
        }
    },[session?.status,router]);

    const toggleVariant = useCallback(() => {
        if (variant === 'Login') {
            setVariant('REGISTER');
        } else {
            setVariant('Login');
        }
    }, [variant]);

    const {
        register,
        handleSubmit,
        formState: {
            errors,
        }
    } = useForm<FieldValues>({
        defaultValues: {
            name: '',
            email: '',
            password: ''
        },
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);

        if (variant === 'REGISTER') {
            //Axios Register
            axios.post('/api/register',data)
            .then(()=>signIn('credentials',data))
            .catch(()=> toast.error('Something went wrong!'))
            .finally(()=> setIsLoading(false));

        }

        if (variant === 'Login') {
            //NextAuth Siginin
            signIn('credentials' ,{
                ...data,
                redirect:false
            })
            .then((callback)=>{
                
                console.log(JSON.stringify(callback))
                if(callback?.error) {
                    toast.error('Invalid credetials');
                }

                if(callback?.ok && !callback?.error ) {

                    toast.success('Successfully Logged on !');
                    router.push('/users');
                }

                
            })
            .finally(()=>setIsLoading(false));
        }
    };

    const socialAction = (action: string) => {
        setIsLoading(true);

        //NextAuth SignIn
        signIn(action,{redirect:false})
        .then((callback)=>{
            if(callback?.error){
                toast.error('Invalid Credentials');
            }
            
            if(callback?.ok && !callback?.error){
                toast.success('Successfully Logged on !');
            }
        })
    };

    return (
        <div
            className="
                mt-8
                sm:mx-auto
                sm:w-full
                sm:max-w-md

            "
        >
            <div
                className="
                bg-white
                px-4
                py-8
                shadow
                sm:rounded-lg
                sm:px-10
                "
            >
                <form
                    className="space-y-6"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    {variant === 'REGISTER' && (
                        <Input
                            id="name"
                            label="Name"
                            register={register}
                            errors={errors}
                            disabled={isLoading}

                        />
                    )}
                    <Input
                        id="email"
                        label="Email Address"
                        type="email"
                        register={register}
                        errors={errors}
                        disabled={isLoading}

                    />

                    <Input
                        id="password"
                        label="password"
                        type="password"
                        register={register}
                        errors={errors}
                        disabled={isLoading}

                    />
                    <div>
                        <Button
                            disabled={isLoading}
                            fullWidth
                            type="submit"
                        >
                            {variant== 'Login'? 'Sign in': 'Register'}
                        </Button>
                    </div>
                </form>

                <div className="mt-6">
                    <div className="relative">
                        <div 
                            className="
                                absolute
                                inset-0
                                flex
                                items-center
                            "
                        >
                            <div className="w-full border-t border-gray-300" />

                        </div>
                        <div 
                            className="
                                relative 
                                flex
                                justify-center
                                text-sm
                        ">
                            <span className="
                            bg-white 
                            px-2
                            text-gray-500
                            ">
                                Or continue with
                            </span>

                        </div>
                    </div>

                    <div className="mt-6 flex gap-2">
                        <AuthSocialButton
                            icon={BsGithub}
                            onClick={()=> socialAction('github')}
                        />
                        <AuthSocialButton
                            icon={BsGoogle}
                            onClick={()=> socialAction('google')}
                        />
                    </div>
                </div>
                <div 
                    className="
                        flex
                        gap-2
                        justify-center
                        text-sm
                        mt-6
                        px-2
                        text-gray-500
                    ">
                        <div>
                            {variant=== 'Login'? 'New to Messenger?' :'Already have an account?'}
                        </div>

                        <div
                            onClick={toggleVariant}
                            className="underline cursor-pointer"
                        >
                            {variant==='Login'?'Create an account':'Login'}

                        </div>
                </div>
            </div>

        </div>
    )
}

export default AuthForm;