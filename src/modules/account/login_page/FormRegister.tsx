import { Button, Input } from 'antd';
import React from 'react';

export const FormRegister = () => {
    return (
        <div className="container">
            <div className="form-group mt-3">
                <label htmlFor="fullName">FullName</label>
                <Input id="fullName" />
            </div>
            <div className="form-group mt-3">
                <label htmlFor="email">Email</label>
                <Input id="email" type="email" />
            </div>
            <div className="form-group mt-3">
                <label htmlFor="password">Password</label>
                <Input type="password" id="password"></Input>
            </div>
            <div className="form-group mt-3 text-center">
                <Button className="w-25 bg-success text-white fs-6 p-3">
                    Register
                </Button>
            </div>
        </div>
    );
};
