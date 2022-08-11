import { Button, TextInput } from "@mantine/core"
import { useForm, zodResolver } from "@mantine/form";
import { signIn } from "next-auth/react";
import Link from "next/link"
import { useCallback } from "react";
import { ILogin, loginSchema } from "../../server/validations/auth";
import classes from './userLogin.module.scss'

const UserLogin: React.FC = () => {
  const loginForm = useForm({
    validate: zodResolver(loginSchema),
    initialValues: {
      email: '',
      password: '',
    },
  });

  const onLogin = useCallback(async (data: ILogin) => {
    await signIn("credentials", { ...data, callbackUrl: "/dashboard/user" });
  }, []);

  return (
    <div className={classes.Container}>
      <form onSubmit={loginForm.onSubmit((values) => onLogin(values))}>
        <TextInput
          required
          label="Email"
          placeholder="example@mail.com"
          {...loginForm.getInputProps('email')}
        />
        <TextInput
          required
          label="Password"
          type='password'
          placeholder="******"
          {...loginForm.getInputProps('password')}
        />
        <div className={classes.ActionContainer}>
          <Link href="/sign-up" className="link">
            <Button component="a" variant='subtle'>Go to sign up</Button>
          </Link>
          <Button variant='filled' type="submit">
            Login
          </Button>
        </div>
      </form>
    </div>
  )
}

export default UserLogin
