import { Button, Input } from 'antd';
import React, { useEffect, useState } from 'react';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { UserService } from '../../../services/userService';
import { useSetRecoilState } from 'recoil';
import { userState } from '../../../stores/userAtom';
import { useNavigate } from 'react-router-dom';

export const FormLogin = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [errors, setErrors] = useState<any>({});
    const setUser = useSetRecoilState(userState);
    const navigate = useNavigate();

    const handleLogin = (): boolean => {
        const emailRegex =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let tempErrors: any = {};
        let isValid: boolean = false;

        if (!email) {
            tempErrors.email = 'Vui lòng nhập email';
            isValid = true;
        }
        if (!password) {
            tempErrors.password = 'Vui lòng nhập mật khẩu';
            isValid = true;
        }
        if (!isValid && !emailRegex.test(email)) {
            tempErrors.email = 'Email không hợp lệ';
            isValid = true;
        }
        setErrors(tempErrors);
        return isValid;
    };

    const Login = async () => {
        if (!handleLogin()) {
            try {
                const res = await UserService.login({ email, password });

                sessionStorage.setItem('user', JSON.stringify(res));
                setUser(res);
                setEmail('');
                setPassword('');

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
                <Input
                    autoComplete="off"
                    defaultValue={''}
                    value={email}
                    onFocus={() => {
                        setErrors({ ...errors, email: null });
                    }}
                    onChange={(e) => {
                        console.log(e.target.value);
                        setEmail(e.target.value);
                    }}
                    id="user-email"
                    type="email"
                />
                {errors.email && (
                    <p className="mt-1 text-danger">{errors.email}</p>
                )}
            </div>
            <div className="form-group mt-3 position-relative">
                <label htmlFor="password">Password</label>
                <Input
                    autoComplete="off"
                    defaultValue={''}
                    value={password}
                    onFocus={() => {
                        setErrors({ ...errors, password: null });
                    }}
                    onChange={(e) => {
                        console.log('e', e.target.value);
                        setPassword(e.target.value);
                    }}
                    type={showPassword ? 'text' : 'password'}
                    id="user-password"
                />
                {errors.password && (
                    <p className="mt-1 text-danger">{errors.password}</p>
                )}
                <Button
                    onClick={() => setShowPassword(!showPassword)}
                    className="position-absolute border-0 bg-transparent p-0 m-0 d-flex align-items-center"
                    style={{
                        right: '10px',
                        cursor: 'pointer',
                        top: '40%',
                    }}
                >
                    {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                </Button>
            </div>
            <div className="form-group mt-3 text-center">
                <Button
                    className="w-25 bg-success text-white fs-6 p-3"
                    onClick={Login}
                >
                    Login
                </Button>
            </div>
        </div>
    );
};
