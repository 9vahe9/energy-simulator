import { RouterProvider } from "react-router-dom";
import { router } from "./routes/routes";
import Login from "./pages/Login";
import SignUp from "./pages/SignUpPage";


function App() {
  return <RouterProvider router={router} />;
}

export default App;
