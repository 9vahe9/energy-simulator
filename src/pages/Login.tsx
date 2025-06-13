import { auth } from "../firebaseConfig/firebase";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";

function Login() {

    console.log(auth);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    

    async function handleClick() {

        try {
           await signInWithEmailAndPassword(auth, email, password);
            alert("loggedIn")
        }
        catch (err) {
            alert("nope");
        }
    }

    return (
        <>
            <input type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)} />
            <br />
            <input type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)} />
            <br />
            <button onClick={handleClick}>sign in</button>
        </>
    )


}


export default Login;