import { Label, TextInput } from "flowbite-react"

const Login = () => {
    return (
        <>
            <form  >
                <div>
                    <div className="mb-2 block" >
                        <Label htmlFor="email" value="Your email" />
                    </div>
                <TextInput name="email" placeholder="mail@email.com" required type="email" />
                </div>
                <div>
                    <div className="mb-2 block" >
                        <Label htmlFor="password" value="Your password" />
                    </div>  
                    <TextInput name="password" placeholder="password" required type="password" />
                </div>
            </form>
        </>
    )
}

export default Login;