import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig/firebase";
import { setCurrentUser } from "./store/authentication/authSlice";
import { router } from "./routes/routes";



function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    const token = sessionStorage.getItem("userToken");

    if (token) {
      dispatch(setCurrentUser(token));
    }

  }, [dispatch])

  return <RouterProvider router={router} />;
}

export default App;
