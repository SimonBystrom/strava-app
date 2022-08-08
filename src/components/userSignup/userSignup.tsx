import { Button, TextInput } from "@mantine/core"
import { useForm, zodResolver } from "@mantine/form";
import Link from "next/link"
import { useRouter } from "next/router";
import { useCallback } from "react";
import { ISignUp, signUpSchema } from "../../server/validations/auth";
import { trpc } from "../../utils/trpc";
import classes from './userSignup.module.scss'

const UserSignup: React.FC = () => {
  const router = useRouter()
  const loginForm = useForm({
    validate: zodResolver(signUpSchema),
    initialValues: {
      username: '',
      email: '',
      password: '',
    },
  })

  const { mutateAsync } = trpc.useMutation(["signup.signup"]);

  const onSubmit = useCallback(
    async (data: ISignUp) => {
      const result = await mutateAsync(data);
      if (result.status === 201) {
        router.push("/");
      }
    },
    [mutateAsync, router]
  );


  return (
    <div className={classes.Container}>
      <form onSubmit={loginForm.onSubmit((values) => onSubmit(values))}>
        <TextInput
          label="Username"
          placeholder="Patrick"
          {...loginForm.getInputProps('username')}
        />
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
          <Link href="/" className="link">
            <Button component="a" variant='subtle'>Go to login</Button>
          </Link>
          <Button variant='filled' type="submit">
            Sign Up
          </Button>
        </div>
      </form>
    </div>
  )
}

export default UserSignup
