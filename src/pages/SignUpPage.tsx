import { auth } from "../firebaseConfig/firebase";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";


function SignUp(){

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")


    async function handleSignUp(){

        try{

            const createdAccount = await createUserWithEmailAndPassword(auth, email, password);
            
            alert("Yay, you have an account now");
        }
        catch(err){
            alert("oops, smth went wrong");
        }

    }

    return(
        <>
        <input 
        type="text" 
        value = {email}
        onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        
        <input type="text" 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button onClick={handleSignUp}> Create an account</button>
        
        </>
    );


}



export default SignUp