import { auth } from "../../firebaseConfig/firebase"
import { useState } from "react"
import { createUserWithEmailAndPassword } from "firebase/auth"

function SignUpContainer(){

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState(""); 


  async function handleSignUp(){

        try{
            const userSignUpAttempt = await createUserWithEmailAndPassword(auth, email, password);
            alert("Everything works fine");
        }
        
        catch(err) {
            alert("something went wrong");
        }

    }

    return(
        <>
        <input type="text"
        value = {email} 
        onChange ={(e) => setEmail(e.target.value)} />
        <br />
        
        <input type="text" 
        value = {password}
        onChange = {(e) => setPassword(e.target.value)}
        />
        
        <button onClick={handleSignUp}> Create an account </button>
        </>
        
    );


}



export default SignUpContainer