import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig/firebase";
import { setCurrentUser } from "./store/authentication/Authslice";
import { router } from "./routes/routes";


function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {

        dispatch(setCurrentUser(user.uid));
      }
    });

    return () => unsubscribe();
  }, [dispatch]);


  return <RouterProvider router={router} />;
}

export default App;
