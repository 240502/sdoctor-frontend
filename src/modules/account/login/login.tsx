import React, { useRef, useState } from 'react';
import { Input, Flex, InputRef, Button } from 'antd';
import { handleFocusInput } from '../../../utils/global';
import { UserService } from '../../../services/userService';
import { useSetRecoilState } from 'recoil';
import { userState } from '../../../stores/userAtom';
import { useNavigate } from 'react-router-dom';
export const Login = () => {
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
        <div className="" style={{ width: '100%', height: '100vh' }}>
            <div className="container row pt-5 justify-content-center">
                <Flex
                    vertical={true}
                    className="col-5 rounded shadow-lg p-5"
                    style={{ minHeight: '60%' }}
                >
                    <div>
                        <h3 className="text-dark text-center fs-4 fw-bold text-uppercase">
                            Đăng nhập
                        </h3>
                    </div>
                    <div
                        className="form__group m-auto mt-3"
                        style={{ width: '80%' }}
                    >
                        <label
                            htmlFor=""
                            className="text-dark form-label fw-bold"
                        >
                            Email
                        </label>
                        <Input
                            onFocus={() => {
                                if (errors?.email && errors.email !== null) {
                                    const newErrors = {
                                        ...errors,
                                        email: null,
                                    };

                                    console.log(newErrors);
                                    setErrors(newErrors);
                                }
                            }}
                            ref={inputUserNameRef}
                            className=""
                            placeholder="Nhập email"
                        />
                        {errors.email !== null ? (
                            <p style={{ color: 'red' }}>{errors.email}</p>
                        ) : (
                            <></>
                        )}
                    </div>
                    <div
                        className="form__group m-auto mt-3"
                        style={{ width: '80%' }}
                    >
                        <label
                            htmlFor=""
                            className="text-dark form-label fw-bold"
                        >
                            Mật khẩu
                        </label>
                        <Input
                            type="password"
                            ref={inputUserPasswordRef}
                            onFocus={() => {
                                if (
                                    errors?.password &&
                                    errors.password !== null
                                ) {
                                    const newErrors = {
                                        ...errors,
                                        password: null,
                                    };

                                    console.log(newErrors);
                                    setErrors(newErrors);
                                }
                            }}
                            className=""
                            placeholder="Nhập mật khẩu"
                        />
                        {errors.password !== null ? (
                            <p style={{ color: 'red' }}>{errors.password}</p>
                        ) : (
                            <></>
                        )}
                    </div>
                    <div
                        className="form-group text-end m-auto"
                        style={{ width: '80%' }}
                    >
                        <Button className=" border-0">Quên mật khẩu?</Button>
                    </div>
                    <div
                        className="form-group mt-3 text-center m-auto"
                        style={{ width: '80%' }}
                    >
                        <Button onClick={Login} type="primary">
                            Đăng nhập
                        </Button>
                    </div>
                </Flex>
            </div>
        </div>
    );
};
