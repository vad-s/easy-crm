import React, { Component } from "react";
import { message, Button, Checkbox, Form, Icon, Input, Typography } from "antd";
import { connect } from "react-redux";
import { loggedIn } from "../../../redux/loggedIn";
import { Redirect } from "react-router-dom";

const { Title } = Typography;

// import { Redirect } from 'react-router-dom'

class NormalLoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: undefined,
      password: undefined
    };
  }
  // componentDidMount = async () =>  {
  //   let response = await fetch('/login');
  //   let result = await response.json();
  //   const responseContacts = await fetch('/contacts');
  //   const contacts = await responseContacts.json();
  //   if (result.isLoggedIn) {
  //     alert('you already logged in');
  //     let arrayWithProps = [result.username, result.email, result.id, contacts];
  //     this.props.set(arrayWithProps)
  //   } else {
  //     alert('login please')
  //   }
  // };

  componentDidMount = async () => {
    const response = await fetch("/login");
    const result = await response.json();

    const responseContacts = await fetch("/contacts");
    const contacts = await responseContacts.json();

    if (result.isLoggedIn) {
      // message.warning(`Вы уже вошли в систему, ${result.username}`);
      message.warning(`${result.username}, you are already logged in`);
      const arrayWithProps = [
        result.username,
        result.email,
        result.id,
        contacts
      ];
      this.props.set(arrayWithProps);
    }
  };

  loginFetch = async (formDataEmail, formDataPassword) => {
    let response = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: formDataEmail,
        password: formDataPassword
      })
    });
    let result = await response.json();
    const responseContacts = await fetch("/contacts");
    const contacts = await responseContacts.json();

    if (result.isLoggedIn) {
      // message.success(`Вы успешно вошли, ${result.username}`);
      message.success(`
      You have successfully logged in., ${result.username}`);
      let arrayWithProps = [result.username, result.email, result.id, contacts];
      this.props.set(arrayWithProps);
    } else {
      // message.error("Неверное имя пользователя или пароль");
      message.error("Wrong username or password");
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
        this.loginFetch(values.email, values.password);
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Form onSubmit={this.handleSubmit} className="login-form">
          <Title level={2} className={"form-title"}>
            {/* Вход */}
            Login
          </Title>
          <Form.Item>
            {getFieldDecorator("email", {
              rules: [
                /*{ required: true, message: "Введите адрес электронной почты" }*/
                { required: true, message: "Enter email" }
              ]
            })(
              <Input
                prefix={
                  <Icon
                    type="smile"
                    theme="outlined"
                    style={{ color: "rgba(0,0,0,.25)" }}
                  />
                }
                /*placeholder="Электронная почта"*/
                placeholder="Email"
                autoComplete={"email"}
              />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator("password", {
              /*rules: [{ required: true, message: "Введите пароль для входа" }]*/
              rules: [{ required: true, message: "Enter password" }]
            })(
              <Input
                prefix={
                  <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                type="password"
                /*placeholder="Пароль"*/
                placeholder="Password"
                autoComplete={"password"}
              />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator("remember", {
              valuePropName: "checked",
              initialValue: true
              /*})(<Checkbox>Запомнить меня</Checkbox>)}*/
            })(<Checkbox>Remember me</Checkbox>)}
            <a className="login-form-forgot" href="">
              {/* Я забыл пароль */}
              Forgotten password
            </a>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              {/* Войти */}
              Login
            </Button>
            {/* Или <a href="/signup">зарегистрироваться!</a> */}
            or <a href="/signup">Sign up!</a>
          </Form.Item>
        </Form>
        {this.props.isLoggedIn && <Redirect to="/dashboard" />}
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    set: data => {
      dispatch(loggedIn(data));
    }
  };
}

function mapStateToProps(store) {
  return {
    isLoggedIn: store.isLoggedIn
  };
}

const Login = Form.create({ name: "normal_login" })(NormalLoginForm);

export default connect(mapStateToProps, mapDispatchToProps)(Login);
