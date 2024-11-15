import { Button, Input, InputRef } from 'antd';
import React, { useRef, useState } from 'react';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { UserService } from '../../../services/userService';
import { useSetRecoilState } from 'recoil';
import { userState } from '../../../stores/userAtom';
import { useNavigate } from 'react-router-dom';
export const FormLogin = () => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const inputUserNameRef = useRef<InputRef>(null);
    const inputUserPasswordRef = useRef<InputRef>(null);
    const [errors, setErrors] = useState<any>({});
    const setUser = useSetRecoilState(userState);
    const navigate = useNavigate();
    const handleLogin = (): boolean => {
        const emailRegex =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let tempErrors: any = {};
        let isValid: boolean = false;
        const email: any = inputUserNameRef.current?.input?.value;
        if (inputUserNameRef.current?.input?.value === '') {
            tempErrors.email = 'Vui lòng nhập email';
            isValid = true;
        }
        if (inputUserPasswordRef.current?.input?.value === '') {
            tempErrors.password = 'Vui lòng nhập mật khẩu';
            isValid = true;
        }
        if (!isValid) {
            if (!emailRegex.test(email)) {
                tempErrors.email = 'Email không hợp lệ';
                isValid = true;
            }
        }
        setErrors(tempErrors);
        return isValid;
    };

    const Login = async () => {
        if (!handleLogin()) {
            const data = {
                email: inputUserNameRef.current?.input?.value,
                password: inputUserPasswordRef.current?.input?.value,
            };
            console.log(data);
            try {
                const res = await UserService.login(data);
                sessionStorage.setItem('user', JSON.stringify(res));
                setUser(res);
                navigate('/admin/dashboard');
            } catch (err: any) {
                console.log(err.message);
            }
        }
    };
    return (
        <div className="container">
            <div className="form-group mt-3">
                <label htmlFor="email">Email</label>
                <Input ref={inputUserNameRef} id="email" type="email" />
            </div>
            <div className="form-group mt-3 position-relative">
                <label htmlFor="password">Password</label>
                <Input
                    ref={inputUserPasswordRef}
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                ></Input>
                <Button
                    onClick={() => setShowPassword(!showPassword)}
                    className="position-absolute border-0 bg-transparent p-0 m-0 translate-middle-y top-50"
                    style={{ right: '10px', cursor: 'pointer' }}
                >
                    {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                </Button>
            </div>
            <div className="form-group mt-3 text-center">
                <Button
                    className="w-25 bg-success text-white fs-6 p-3"
                    onClick={() => Login()}
                >
                    Login
                </Button>
            </div>
        </div>
    );
};
